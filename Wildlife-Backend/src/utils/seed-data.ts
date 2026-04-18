import prisma from './prisma.client'
import logger from './logger'
import { ConservationStatus, VerificationStatus, ActivityType } from '@prisma/client'

export const seedLocations = async () => {
  const locations = [
    { 
      id: 'loc_corbett',
      name: 'Jim Corbett National Park', 
      latitude: 29.536, 
      longitude: 78.770, 
      forestType: 'Tropical Moist Deciduous', 
      area: 1318.5,
      description: 'Famous for Bengal tigers, located in Uttarakhand',
      threats: ['Poaching', 'Human-wildlife conflict']
    },
    { 
      id: 'loc_kaziranga',
      name: 'Kaziranga National Park', 
      latitude: 26.577, 
      longitude: 93.171, 
      forestType: 'Swampy Grasslands', 
      area: 430,
      description: 'Home to the largest population of one-horned rhinos',
      threats: ['Flooding', 'Poaching']
    },
    { 
      id: 'loc_sunderban',
      name: 'Sunderban National Park', 
      latitude: 21.949, 
      longitude: 88.938, 
      forestType: 'Mangrove', 
      area: 1330.1,
      description: 'Largest mangrove forest, home to Royal Bengal tigers',
      threats: ['Climate change', 'Cyclones']
    },
    { 
      id: 'loc_bandipur',
      name: 'Bandipur National Park', 
      latitude: 11.662, 
      longitude: 76.627, 
      forestType: 'Dry Deciduous', 
      area: 874.2,
      description: 'Part of Nilgiri Biosphere Reserve',
      threats: ['Forest fires', 'Road accidents']
    }
  ]
  
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {},
      create: loc,
    })
  }
  
  logger.info('✅ Locations seeded')
}

export const seedSpecies = async () => {
  const species = [
    { 
      id: 'sp_tiger',
      name: 'Bengal Tiger', 
      scientificName: 'Panthera tigris tigris', 
      category: 'Mammal', 
      conservationStatus: ConservationStatus.ENDANGERED,  
      population: 2967,
      habitat: 'Tropical forests, mangroves, grasslands',
      threats: ['Poaching', 'Habitat loss'],
      description: 'National animal of India, apex predator'
    },
    { 
      id: 'sp_elephant',
      name: 'Indian Elephant', 
      scientificName: 'Elephas maximus indicus', 
      category: 'Mammal', 
      conservationStatus: ConservationStatus.ENDANGERED,  
      population: 27312,
      habitat: 'Forests, grasslands',
      threats: ['Human-elephant conflict', 'Habitat fragmentation'],
      description: 'Largest land animal in Asia'
    },
    { 
      id: 'sp_rhino',
      name: 'One-horned Rhino', 
      scientificName: 'Rhinoceros unicornis', 
      category: 'Mammal', 
      conservationStatus: ConservationStatus.VULNERABLE,  
      population: 3700,
      habitat: 'Grasslands, floodplains',
      threats: ['Poaching for horn', 'Habitat loss'],
      description: 'Largest of the three Asian rhino species'
    },
    { 
      id: 'sp_peafowl',
      name: 'Indian Peafowl', 
      scientificName: 'Pavo cristatus', 
      category: 'Bird', 
      conservationStatus: ConservationStatus.LEAST_CONCERN,  
      population: 100000,
      habitat: 'Forests, open woodlands',
      threats: ['Habitat loss', 'Poaching for feathers'],
      description: 'National bird of India, known for its vibrant plumage'
    },
    { 
      id: 'sp_lion',
      name: 'Asiatic Lion', 
      scientificName: 'Panthera leo persica', 
      category: 'Mammal', 
      conservationStatus: ConservationStatus.ENDANGERED,  
      population: 674,
      habitat: 'Dry deciduous forests, grasslands',
      threats: ['Habitat loss', 'Disease', 'Human conflict'],
      description: 'Found only in Gir Forest, Gujarat'
    },
    { 
      id: 'sp_leopard',
      name: 'Indian Leopard', 
      scientificName: 'Panthera pardus fusca', 
      category: 'Mammal', 
      conservationStatus: ConservationStatus.VULNERABLE,  
      population: 12000,
      habitat: 'Forests, scrublands, urban edges',
      threats: ['Poaching', 'Habitat fragmentation', 'Human-wildlife conflict'],
      description: 'Highly adaptable big cat found across India'
    }
  ]
  
  for (const sp of species) {
    await prisma.species.upsert({
      where: { id: sp.id },
      update: {},
      create: sp,
    })
  }
  
  logger.info('✅ Species seeded')
}

export const seedParticipants = async () => {
  const participants = [
    {
      id: 'part_wwf',
      name: 'WWF India',
      email: 'contact@wwfindia.org',
      phone: '9876543210',
      city: 'New Delhi',
      state: 'Delhi',
      organizationType: 'NGO',
      status: VerificationStatus.VERIFIED,  
      documents: [],
      registeredAt: new Date(),
      address: '172-B, Lodhi Estate'
    },
    {
      id: 'part_wti',
      name: 'Wildlife Trust of India',
      email: 'info@wti.org.in',
      phone: '9876543211',
      city: 'Noida',
      state: 'Uttar Pradesh',
      organizationType: 'Trust',
      status: VerificationStatus.VERIFIED,  
      documents: [],
      registeredAt: new Date(),
      address: 'F-13, Sector 8'
    },
    {
      id: 'part_bnhs',
      name: 'Bombay Natural History Society',
      email: 'bnhs@bnhs.org',
      phone: '9876543212',
      city: 'Mumbai',
      state: 'Maharashtra',
      organizationType: 'Research Organization',
      status: VerificationStatus.VERIFIED,  
      documents: [],
      registeredAt: new Date(),
      address: 'Hornbill House, S.B. Singh Road'
    },
    {
      id: 'part_atree',
      name: 'ATREE',
      email: 'info@atree.org',
      phone: '9876543213',
      city: 'Bengaluru',
      state: 'Karnataka',
      organizationType: 'Research Institute',
      status: VerificationStatus.PENDING,  
      documents: [],
      registeredAt: new Date(),
      address: 'Royal Enclave, Srirampura'
    }
  ]
  
  for (const part of participants) {
    await prisma.participant.upsert({
      where: { id: part.id },
      update: {},
      create: part,
    })
  }
  
  logger.info('✅ Participants seeded')
}

export const seedDemoActivities = async () => {
  const locations = await prisma.location.findMany()
  const species = await prisma.species.findMany()
  const users = await prisma.user.findMany()
  const participants = await prisma.participant.findMany()
  
  if (locations.length === 0 || species.length === 0) {
    logger.info('⚠️ No locations or species found. Skipping demo activities.')
    return
  }
  
  const demoActivities = [
    {
      id: 'act_tiger_sighting',
      title: 'Tiger Sighting in Core Zone',
      description: 'Spotted a Bengal tiger with cubs near the waterhole in Zone 3',
      type: ActivityType.WILDLIFE_SIGHTING,
      date: new Date('2026-03-28'),
      locationId: locations[0]?.id,
      reportedById: users[0]?.id,
      participantId: participants[0]?.id,
      status: VerificationStatus.VERIFIED,
      images: [],
      findings: 'Healthy tiger with two cubs. No signs of distress or injury.',
      actionTaken: 'Area marked for special protection. Increased patrol frequency.',
      verifiedBy: users[0]?.id,
      verifiedAt: new Date('2026-03-29')
    },
    {
      id: 'act_patrol_routine',
      title: 'Routine Forest Patrol',
      description: 'Regular patrol in the eastern range to monitor wildlife activity',
      type: ActivityType.PATROL,
      date: new Date('2026-03-30'),
      locationId: locations[1]?.id,
      reportedById: users[0]?.id,
      participantId: participants[1]?.id,
      status: VerificationStatus.VERIFIED,
      images: [],
      findings: 'No illegal activities detected. Wildlife movement normal.',
      actionTaken: 'Patrol logs updated. Camera traps checked.',
      verifiedBy: users[0]?.id,
      verifiedAt: new Date('2026-03-31')
    },
    {
      id: 'act_illegal_activity',
      title: 'Suspected Poaching Attempt',
      description: 'Found snares and traps in the buffer zone',
      type: ActivityType.ILLEGAL_ACTIVITY,
      date: new Date('2026-03-27'),
      locationId: locations[2]?.id,
      reportedById: users[0]?.id,
      participantId: participants[2]?.id,
      status: VerificationStatus.PENDING,
      images: [],
      findings: 'Three wire snares recovered. Footprints of 2 individuals.',
      actionTaken: 'Snares removed. Forest guard deployed. FIR filed.'
    },
    {
      id: 'act_rescue',
      title: 'Elephant Rescue Operation',
      description: 'Rescued a young elephant trapped in a canal',
      type: ActivityType.RESCUE_OPERATION,
      date: new Date('2026-03-26'),
      locationId: locations[3]?.id,
      reportedById: users[0]?.id,
      participantId: participants[0]?.id,
      status: VerificationStatus.VERIFIED,
      images: [],
      findings: 'Juvenile elephant, approx 2 years old, dehydrated',
      actionTaken: 'Successfully rescued and released to herd',
      verifiedBy: users[0]?.id,
      verifiedAt: new Date('2026-03-27')
    }
  ]
  
  for (const activity of demoActivities) {
    if (activity.locationId && activity.reportedById) {
      await prisma.monitoringActivity.upsert({
        where: { id: activity.id },
        update: {},
        create: activity,
      })
    }
  }
  
  const tigerActivity = await prisma.monitoringActivity.findUnique({
    where: { id: 'act_tiger_sighting' }
  })
  
  const tigerSpecies = await prisma.species.findUnique({
    where: { id: 'sp_tiger' }
  })
  
  if (tigerActivity && tigerSpecies) {
    await prisma.speciesReport.upsert({
      where: { 
        activityId_speciesId: {
          activityId: tigerActivity.id,
          speciesId: tigerSpecies.id
        }
      },
      update: {},
      create: {
        activityId: tigerActivity.id,
        speciesId: tigerSpecies.id,
        count: 3,
        behavior: 'Resting near waterhole with cubs',
        notes: 'Mother and two cubs, all appeared healthy'
      }
    })
  }
  
  logger.info('✅ Demo activities seeded')
}

export const seedAll = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    
    await seedLocations()
    await seedSpecies()
    await seedParticipants()
    await seedDemoActivities()
    
    console.log('✅ All seed data completed successfully!')
  } catch (error) {
    console.error('❌ Seeding error:', error)
    throw error
  }
}

export const seedIfEmpty = async () => {
  try {
    const locationCount = await prisma.location.count()
    const speciesCount = await prisma.species.count()
    
    if (locationCount === 0 && speciesCount === 0) {
      console.log('📦 Database is empty. Seeding data...')
      await seedAll()
    } else {
      console.log(`✅ Database already has ${locationCount} locations and ${speciesCount} species. Skipping seed.`)
    }
  } catch (error) {
    console.error('Error checking database:', error)
  }
}