import { prisma } from '../lib/db'

async function main() {
  const transactionCount = await prisma.pointTransaction.count()
  const rulesCount = await prisma.pointsRule.count()
  const userPointsCount = await prisma.userPoints.count()

  console.log('\n✅ Points System Database Check:')
  console.log('  - Point Transactions:', transactionCount)
  console.log('  - Points Rules:', rulesCount)
  console.log('  - User Points Records:', userPointsCount)

  if (rulesCount === 14) {
    console.log('\n✅ All 14 points rules seeded successfully!')
  }

  await prisma.$disconnect()
}

main()
