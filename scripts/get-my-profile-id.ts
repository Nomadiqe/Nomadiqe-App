import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getMyProfileId() {
  try {
    // Cerca l'utente di Luca
    const lucaUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { contains: 'luca' } },
          { name: { contains: 'Luca' } },
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (lucaUser) {
      console.log('\n✅ Il tuo profilo:')
      console.log(`   ID: ${lucaUser.id}`)
      console.log(`   Nome: ${lucaUser.fullName || lucaUser.name}`)
      console.log(`   Email: ${lucaUser.email}`)
      console.log(`   Ruolo: ${lucaUser.role}`)
      console.log(`\n🔗 URL del profilo: http://localhost:3000/profile/${lucaUser.id}`)
    } else {
      console.log('\n❌ Nessun profilo trovato per Luca')
      
      // Mostra tutti gli utenti disponibili
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      console.log('\n📋 Utenti disponibili:')
      allUsers.forEach((u, i) => {
        console.log(`${i + 1}. ${u.name} (${u.email}) - http://localhost:3000/profile/${u.id}`)
      })
    }

  } catch (error) {
    console.error('Errore:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getMyProfileId()

