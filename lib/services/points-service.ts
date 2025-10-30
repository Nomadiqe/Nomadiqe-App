/**
 * Points Reward System Service
 *
 * This service handles all point-related operations including:
 * - Awarding points for user actions
 * - Anti-abuse mechanisms (daily limits, cooldowns)
 * - Transaction tracking and history
 * - Daily check-ins with streak tracking
 */

import { prisma } from '@/lib/db'
import { startOfDay, subDays, differenceInDays } from 'date-fns'

// Types
export interface AwardPointsParams {
  userId: string
  action: string
  points?: number // Optional override for custom points
  referenceId?: string
  referenceType?: string
  description?: string
  metadata?: any
}

export interface AwardPointsResult {
  success: boolean
  points: number
  message: string
  newBalance?: number
}

export interface CanAwardResult {
  allowed: boolean
  reason?: string
  currentCount?: number
  limit?: number
}

export interface PointsBalance {
  totalPoints: number
  currentPoints: number
  lifetimeEarned: number
  lifetimeRedeemed: number
}

export interface DailyCheckInResult {
  success: boolean
  points: number
  streakCount: number
  message: string
  bonusPoints?: number
}

// Streak bonus configuration
const STREAK_BONUSES: Record<number, number> = {
  7: 20,    // 7-day streak: +20 bonus points
  14: 50,   // 14-day streak: +50 bonus points
  30: 100,  // 30-day streak: +100 bonus points
  90: 300,  // 90-day streak: +300 bonus points
}

/**
 * Check if user can be awarded points for an action today
 * Checks daily limits from PointsRule table
 */
export async function canAwardPoints(
  userId: string,
  action: string
): Promise<CanAwardResult> {
  try {
    // Get the rule for this action
    const rule = await prisma.pointsRule.findUnique({
      where: { action },
    })

    if (!rule) {
      return { allowed: false, reason: 'No rule found for this action' }
    }

    if (!rule.isActive) {
      return { allowed: false, reason: 'This action is currently disabled' }
    }

    // If no daily limit, always allow
    if (rule.dailyLimit === null) {
      return { allowed: true }
    }

    // Check how many times this action has been performed today
    const startOfToday = startOfDay(new Date())
    const count = await prisma.pointTransaction.count({
      where: {
        userId,
        action,
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    if (count >= rule.dailyLimit) {
      return {
        allowed: false,
        reason: `Daily limit reached for ${action}`,
        currentCount: count,
        limit: rule.dailyLimit,
      }
    }

    return { allowed: true, currentCount: count, limit: rule.dailyLimit }
  } catch (error) {
    console.error('Error checking if points can be awarded:', error)
    return { allowed: false, reason: 'Error checking eligibility' }
  }
}

/**
 * Award points to a user for an action
 * Uses Prisma transactions for atomic operations
 */
export async function awardPoints(
  params: AwardPointsParams
): Promise<AwardPointsResult> {
  const { userId, action, points: customPoints, referenceId, referenceType, description, metadata } = params

  try {
    // Check if action is allowed (daily limits, etc.)
    const eligibility = await canAwardPoints(userId, action)
    if (!eligibility.allowed) {
      return {
        success: false,
        points: 0,
        message: eligibility.reason || 'Action not allowed',
      }
    }

    // Get the rule for this action to determine points
    const rule = await prisma.pointsRule.findUnique({
      where: { action },
    })

    if (!rule) {
      return {
        success: false,
        points: 0,
        message: `No rule found for action: ${action}`,
      }
    }

    const pointsToAward = customPoints !== undefined ? customPoints : rule.points

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create the point transaction record
      await tx.pointTransaction.create({
        data: {
          userId,
          points: pointsToAward,
          action,
          referenceId,
          referenceType,
          description: description || rule.description || `Points for ${action}`,
          metadata,
        },
      })

      // Update or create UserPoints record
      const userPoints = await tx.userPoints.upsert({
        where: { userId },
        update: {
          totalPoints: { increment: pointsToAward },
          currentPoints: { increment: pointsToAward },
          lifetimeEarned: { increment: pointsToAward },
        },
        create: {
          userId,
          totalPoints: pointsToAward,
          currentPoints: pointsToAward,
          lifetimeEarned: pointsToAward,
          lifetimeRedeemed: 0,
        },
      })

      return userPoints
    })

    return {
      success: true,
      points: pointsToAward,
      message: `Awarded ${pointsToAward} points for ${action}`,
      newBalance: result.currentPoints,
    }
  } catch (error) {
    console.error('Error awarding points:', error)
    return {
      success: false,
      points: 0,
      message: 'Error awarding points',
    }
  }
}

/**
 * Get user's current points balance
 */
export async function getPointsBalance(userId: string): Promise<PointsBalance> {
  try {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    })

    if (!userPoints) {
      return {
        totalPoints: 0,
        currentPoints: 0,
        lifetimeEarned: 0,
        lifetimeRedeemed: 0,
      }
    }

    return {
      totalPoints: userPoints.totalPoints,
      currentPoints: userPoints.currentPoints,
      lifetimeEarned: userPoints.lifetimeEarned,
      lifetimeRedeemed: userPoints.lifetimeRedeemed,
    }
  } catch (error) {
    console.error('Error getting points balance:', error)
    return {
      totalPoints: 0,
      currentPoints: 0,
      lifetimeEarned: 0,
      lifetimeRedeemed: 0,
    }
  }
}

/**
 * Get user's point transaction history with pagination
 */
export async function getPointsHistory(
  userId: string,
  options?: { limit?: number; offset?: number; action?: string }
) {
  try {
    const { limit = 50, offset = 0, action } = options || {}

    const transactions = await prisma.pointTransaction.findMany({
      where: {
        userId,
        ...(action && { action }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.pointTransaction.count({
      where: {
        userId,
        ...(action && { action }),
      },
    })

    return {
      transactions,
      total,
      hasMore: offset + transactions.length < total,
    }
  } catch (error) {
    console.error('Error getting points history:', error)
    return {
      transactions: [],
      total: 0,
      hasMore: false,
    }
  }
}

/**
 * Calculate streak count from check-in history
 */
async function calculateStreak(userId: string): Promise<number> {
  try {
    const checkIns = await prisma.dailyCheckIn.findMany({
      where: { userId },
      orderBy: { checkInDate: 'desc' },
      take: 100, // Get enough to calculate streak
    })

    if (checkIns.length === 0) {
      return 0
    }

    // Start from yesterday (don't count today yet)
    let currentDate = startOfDay(subDays(new Date(), 1))
    let streak = 0

    for (const checkIn of checkIns) {
      const checkInDay = startOfDay(new Date(checkIn.checkInDate))
      const daysDiff = differenceInDays(currentDate, checkInDay)

      if (daysDiff === 0) {
        // This day matches, increment streak
        streak++
        currentDate = subDays(currentDate, 1)
      } else if (daysDiff > 0) {
        // Gap in check-ins, streak is broken
        break
      }
      // If daysDiff < 0, we've already counted this day (duplicate), skip it
    }

    return streak
  } catch (error) {
    console.error('Error calculating streak:', error)
    return 0
  }
}

/**
 * Perform daily check-in and award points
 * Handles streak tracking and bonus points
 */
export async function performDailyCheckIn(userId: string): Promise<DailyCheckInResult> {
  try {
    const today = startOfDay(new Date())

    // Check if already checked in today
    const existingCheckIn = await prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        checkInDate: {
          gte: today,
        },
      },
    })

    if (existingCheckIn) {
      return {
        success: false,
        points: 0,
        streakCount: existingCheckIn.streakCount,
        message: 'Already checked in today',
      }
    }

    // Calculate current streak
    const currentStreak = await calculateStreak(userId)
    const newStreak = currentStreak + 1

    // Determine base points and bonus
    const basePoints = 10
    let bonusPoints = 0

    // Check for streak bonuses
    if (STREAK_BONUSES[newStreak]) {
      bonusPoints = STREAK_BONUSES[newStreak]
    }

    const totalPoints = basePoints + bonusPoints

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create check-in record
      const checkIn = await tx.dailyCheckIn.create({
        data: {
          userId,
          checkInDate: today,
          pointsAwarded: totalPoints,
          streakCount: newStreak,
        },
      })

      // Award points using the awardPoints function
      await tx.pointTransaction.create({
        data: {
          userId,
          points: totalPoints,
          action: 'daily_check_in',
          description: bonusPoints > 0
            ? `Daily check-in (${newStreak} day streak! +${bonusPoints} bonus)`
            : `Daily check-in (${newStreak} day streak)`,
          metadata: {
            streak: newStreak,
            basePoints,
            bonusPoints,
          },
        },
      })

      // Update user points
      await tx.userPoints.upsert({
        where: { userId },
        update: {
          totalPoints: { increment: totalPoints },
          currentPoints: { increment: totalPoints },
          lifetimeEarned: { increment: totalPoints },
        },
        create: {
          userId,
          totalPoints,
          currentPoints: totalPoints,
          lifetimeEarned: totalPoints,
          lifetimeRedeemed: 0,
        },
      })

      return checkIn
    })

    return {
      success: true,
      points: totalPoints,
      streakCount: newStreak,
      message: bonusPoints > 0
        ? `🎉 ${newStreak} day streak! Earned ${totalPoints} points (+${bonusPoints} bonus)!`
        : `Earned ${totalPoints} points! ${newStreak} day streak`,
      bonusPoints: bonusPoints > 0 ? bonusPoints : undefined,
    }
  } catch (error) {
    console.error('Error performing daily check-in:', error)
    return {
      success: false,
      points: 0,
      streakCount: 0,
      message: 'Error performing check-in',
    }
  }
}

/**
 * Get current streak info without checking in
 */
export async function getStreakInfo(userId: string) {
  try {
    const currentStreak = await calculateStreak(userId)
    const today = startOfDay(new Date())

    const checkedInToday = await prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        checkInDate: {
          gte: today,
        },
      },
    })

    return {
      currentStreak,
      checkedInToday: !!checkedInToday,
      nextStreakBonus: Object.keys(STREAK_BONUSES)
        .map(Number)
        .sort((a, b) => a - b)
        .find((days) => days > (checkedInToday ? currentStreak + 1 : currentStreak)),
    }
  } catch (error) {
    console.error('Error getting streak info:', error)
    return {
      currentStreak: 0,
      checkedInToday: false,
      nextStreakBonus: undefined,
    }
  }
}

/**
 * Admin function: Update points rule
 */
export async function updatePointsRule(
  action: string,
  updates: {
    points?: number
    dailyLimit?: number | null
    description?: string
    isActive?: boolean
  }
) {
  try {
    const rule = await prisma.pointsRule.update({
      where: { action },
      data: updates,
    })
    return { success: true, rule }
  } catch (error) {
    console.error('Error updating points rule:', error)
    return { success: false, error: 'Failed to update rule' }
  }
}

/**
 * Admin function: Get all points rules
 */
export async function getAllPointsRules() {
  try {
    const rules = await prisma.pointsRule.findMany({
      orderBy: {
        points: 'desc',
      },
    })
    return rules
  } catch (error) {
    console.error('Error getting points rules:', error)
    return []
  }
}

/**
 * Admin function: Manually adjust user points
 * Use with caution - creates a transaction but bypasses normal rules
 */
export async function adjustUserPoints(
  userId: string,
  points: number,
  reason: string,
  adminId: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction
      await tx.pointTransaction.create({
        data: {
          userId,
          points,
          action: 'admin_adjustment',
          description: reason,
          metadata: {
            adjustedBy: adminId,
            timestamp: new Date().toISOString(),
          },
        },
      })

      // Update user points
      const userPoints = await tx.userPoints.upsert({
        where: { userId },
        update: {
          totalPoints: { increment: points },
          currentPoints: { increment: points },
          lifetimeEarned: points > 0 ? { increment: points } : undefined,
          lifetimeRedeemed: points < 0 ? { increment: Math.abs(points) } : undefined,
        },
        create: {
          userId,
          totalPoints: points,
          currentPoints: points,
          lifetimeEarned: points > 0 ? points : 0,
          lifetimeRedeemed: points < 0 ? Math.abs(points) : 0,
        },
      })

      return userPoints
    })

    return { success: true, newBalance: result.currentPoints }
  } catch (error) {
    console.error('Error adjusting user points:', error)
    return { success: false, error: 'Failed to adjust points' }
  }
}

/**
 * Get leaderboard of top users by points
 */
export async function getLeaderboard(limit: number = 10) {
  try {
    const topUsers = await prisma.userPoints.findMany({
      take: limit,
      orderBy: {
        totalPoints: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    })

    return topUsers.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      user: entry.user,
      totalPoints: entry.totalPoints,
      currentPoints: entry.currentPoints,
    }))
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}
