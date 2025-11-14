/**
 * Points Reward System Service
 *
 * This service handles all point-related operations including:
 * - Awarding points for user actions
 * - Anti-abuse mechanisms (daily limits, cooldowns)
 * - Transaction tracking and history
 * - Daily check-ins with streak tracking
 */

import { createClient } from '@/lib/supabase/server'
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
 * Checks daily limits from points_rules table
 */
export async function canAwardPoints(
  userId: string,
  action: string
): Promise<CanAwardResult> {
  try {
    const supabase = await createClient()

    // Get the rule for this action
    const { data: rule, error: ruleError } = await supabase
      .from('points_rules')
      .select('*')
      .eq('action', action)
      .single()

    if (ruleError || !rule) {
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
    const startOfToday = startOfDay(new Date()).toISOString()
    const { count, error: countError } = await supabase
      .from('point_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .eq('action', action)
      .gte('createdAt', startOfToday)

    if (countError) {
      console.error('Error counting transactions:', countError)
      return { allowed: false, reason: 'Error checking eligibility' }
    }

    const transactionCount = count || 0

    if (transactionCount >= rule.dailyLimit) {
      return {
        allowed: false,
        reason: `Daily limit reached for ${action}`,
        currentCount: transactionCount,
        limit: rule.dailyLimit,
      }
    }

    return { allowed: true, currentCount: transactionCount, limit: rule.dailyLimit }
  } catch (error) {
    console.error('Error checking if points can be awarded:', error)
    return { allowed: false, reason: 'Error checking eligibility' }
  }
}

/**
 * Award points to a user for an action
 * Uses Supabase RPC for atomic operations
 */
export async function awardPoints(
  params: AwardPointsParams
): Promise<AwardPointsResult> {
  const { userId, action, points: customPoints, referenceId, referenceType, description } = params

  try {
    const supabase = await createClient()

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
    const { data: rule, error: ruleError } = await supabase
      .from('points_rules')
      .select('*')
      .eq('action', action)
      .single()

    if (ruleError || !rule) {
      return {
        success: false,
        points: 0,
        message: `No rule found for action: ${action}`,
      }
    }

    const pointsToAward = customPoints !== undefined ? customPoints : rule.points

    // Use RPC to award points atomically
    const { data, error: awardError } = await supabase.rpc('award_points', {
      p_user_id: userId,
      p_action: action,
      p_points: pointsToAward,
      p_reference_id: referenceId,
      p_reference_type: referenceType,
      p_description: description || rule.description || `Points for ${action}`,
    })

    if (awardError) {
      console.error('Error awarding points:', awardError)
      return {
        success: false,
        points: 0,
        message: 'Error awarding points',
      }
    }

    // Get updated balance
    const { data: userPoints } = await supabase
      .from('user_points')
      .select('currentPoints')
      .eq('userId', userId)
      .single()

    return {
      success: true,
      points: pointsToAward,
      message: `Awarded ${pointsToAward} points for ${action}`,
      newBalance: userPoints?.currentPoints || 0,
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
    const supabase = await createClient()

    const { data: userPoints, error } = await supabase
      .from('user_points')
      .select('totalPoints, currentPoints, lifetimeEarned, lifetimeRedeemed')
      .eq('userId', userId)
      .maybeSingle()

    if (error) {
      console.error('Error getting points balance:', error)
      return {
        totalPoints: 0,
        currentPoints: 0,
        lifetimeEarned: 0,
        lifetimeRedeemed: 0,
      }
    }

    if (!userPoints) {
      return {
        totalPoints: 0,
        currentPoints: 0,
        lifetimeEarned: 0,
        lifetimeRedeemed: 0,
      }
    }

    return {
      totalPoints: userPoints.totalPoints || 0,
      currentPoints: userPoints.currentPoints || 0,
      lifetimeEarned: userPoints.lifetimeEarned || 0,
      lifetimeRedeemed: userPoints.lifetimeRedeemed || 0,
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
    const supabase = await createClient()
    const { limit = 50, offset = 0, action } = options || {}

    // Build query
    let query = supabase
      .from('point_transactions')
      .select('*', { count: 'exact' })
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (action) {
      query = query.eq('action', action)
    }

    const { data: transactions, error, count } = await query

    if (error) {
      console.error('Error getting points history:', error)
      return {
        transactions: [],
        total: 0,
        hasMore: false,
      }
    }

    return {
      transactions: transactions || [],
      total: count || 0,
      hasMore: offset + (transactions?.length || 0) < (count || 0),
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
    const supabase = await createClient()

    const { data: checkIns, error } = await supabase
      .from('daily_check_ins')
      .select('checkInDate')
      .eq('userId', userId)
      .order('checkInDate', { ascending: false })
      .limit(100)

    if (error || !checkIns || checkIns.length === 0) {
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
    const supabase = await createClient()
    const today = startOfDay(new Date()).toISOString()

    // Check if already checked in today
    const { data: existingCheckIn } = await supabase
      .from('daily_check_ins')
      .select('*')
      .eq('userId', userId)
      .gte('checkInDate', today)
      .maybeSingle()

    if (existingCheckIn) {
      return {
        success: false,
        points: 0,
        streakCount: existingCheckIn.streakCount || 0,
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

    // Create check-in record
    const { error: checkInError } = await supabase
      .from('daily_check_ins')
      .insert({
        userId,
        checkInDate: today,
        pointsAwarded: totalPoints,
        streakCount: newStreak,
      })

    if (checkInError) {
      console.error('Check-in error:', checkInError)
      return {
        success: false,
        points: 0,
        streakCount: 0,
        message: 'Error performing check-in',
      }
    }

    // Award points using RPC
    await supabase.rpc('award_points', {
      p_user_id: userId,
      p_action: 'daily_check_in',
      p_points: totalPoints,
      p_description: bonusPoints > 0
        ? `Daily check-in (${newStreak} day streak! +${bonusPoints} bonus)`
        : `Daily check-in (${newStreak} day streak)`,
    })

    // Update user points streak info
    // TODO: Implement streak tracking in database schema
    // await supabase
    //   .from('user_points')
    //   .update({
    //     currentStreak: newStreak,
    //     longestStreak: newStreak,
    //     lastCheckIn: today,
    //   })
    //   .eq('userId', userId)

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
    const supabase = await createClient()
    const currentStreak = await calculateStreak(userId)
    const today = startOfDay(new Date()).toISOString()

    const { data: checkedInToday } = await supabase
      .from('daily_check_ins')
      .select('id')
      .eq('userId', userId)
      .gte('checkInDate', today)
      .maybeSingle()

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
    const supabase = await createClient()

    const { data: rule, error } = await supabase
      .from('points_rules')
      .update(updates)
      .eq('action', action)
      .select()
      .single()

    if (error) {
      console.error('Error updating points rule:', error)
      return { success: false, error: 'Failed to update rule' }
    }

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
    const supabase = await createClient()

    const { data: rules, error } = await supabase
      .from('points_rules')
      .select('*')
      .order('points', { ascending: false })

    if (error) {
      console.error('Error getting points rules:', error)
      return []
    }

    return rules || []
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
    const supabase = await createClient()

    // Create transaction
    const { error: txError } = await supabase
      .from('point_transactions')
      .insert({
        userId,
        points,
        action: 'admin_adjustment',
        description: reason,
        metadata: {
          adjustedBy: adminId,
          timestamp: new Date().toISOString(),
        },
      })

    if (txError) {
      console.error('Error creating transaction:', txError)
      return { success: false, error: 'Failed to adjust points' }
    }

    // Update user points
    const { data: currentPoints } = await supabase
      .from('user_points')
      .select('totalPoints, currentPoints, lifetimeEarned, lifetimeRedeemed')
      .eq('userId', userId)
      .maybeSingle()

    const updateData: any = {
      totalPoints: (currentPoints?.totalPoints || 0) + points,
      currentPoints: (currentPoints?.currentPoints || 0) + points,
    }

    if (points > 0) {
      updateData.lifetimeEarned = (currentPoints?.lifetimeEarned || 0) + points
    } else {
      updateData.lifetimeRedeemed = (currentPoints?.lifetimeRedeemed || 0) + Math.abs(points)
    }

    const { data: userPoints, error: updateError } = await supabase
      .from('user_points')
      .upsert({
        userId,
        ...updateData,
      })
      .eq('userId', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user points:', updateError)
      return { success: false, error: 'Failed to adjust points' }
    }

    return {
      success: true,
      newBalance: userPoints?.currentPoints || 0
    }
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
    const supabase = await createClient()

    const { data: topUsers, error } = await supabase
      .from('user_points')
      .select(`
        userId,
        totalPoints,
        currentPoints,
        user:users!userId (
          id, name, username, image, profilePictureUrl
        )
      `)
      .order('totalPoints', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting leaderboard:', error)
      return []
    }

    return (topUsers || []).map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      user: entry.user,
      totalPoints: entry.totalPoints || 0,
      currentPoints: entry.currentPoints || 0,
    }))
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}
