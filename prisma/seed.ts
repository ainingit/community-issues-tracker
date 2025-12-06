import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to create dates relative to now
function daysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

function daysFromNow(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const malaysianNGOs = [
  {
    name: "Mercy Malaysia",
    description: "Medical relief organization providing humanitarian aid domestically and internationally. Responds to disasters and provides healthcare to vulnerable communities.",
    website: "https://www.mercy.org.my",
    email: "info@mercy.org.my",
    phone: "+603-2935 9935",
    state: "Kuala Lumpur",
    focusAreas: "Healthcare,Disaster Relief,Humanitarian Aid",
    address: "Level 2, Podium Block, City Point, Kompleks Dayabumi, Jalan Sultan Hishamuddin, 50050 Kuala Lumpur",
    latitude: 3.1412,
    longitude: 101.6865,
    lastActivityAt: daysAgo(2) // Very active
  },
  {
    name: "WWF-Malaysia",
    description: "Leading conservation organization working to protect Malaysia's rich biodiversity, forests, and marine ecosystems.",
    website: "https://www.wwf.org.my",
    email: "contactus@wwf.org.my",
    phone: "+603-7450 3773",
    state: "Selangor",
    focusAreas: "Environment,Wildlife Conservation,Climate Action",
    address: "1 Jalan PJS 5/28A, Petaling Jaya Commercial Centre (PJCC), 46150 Petaling Jaya, Selangor",
    latitude: 3.0738,
    longitude: 101.6178,
    lastActivityAt: daysAgo(5) // Active
  },
  {
    name: "Pertubuhan Kebajikan Anak-Anak Yatim Malaysia (PEYATIM)",
    description: "Dedicated to providing shelter, education, and care for orphans across Malaysia.",
    website: "https://www.peyatim.org.my",
    email: "info@peyatim.org.my",
    phone: "+603-6250 6440",
    state: "Selangor",
    focusAreas: "Children Welfare,Education,Orphan Care",
    address: "No. 7, Jalan 3/3, Seksyen 3, 43650 Bandar Baru Bangi, Selangor",
    latitude: 2.9467,
    longitude: 101.7683,
    lastActivityAt: daysAgo(45) // Inactive - should be orange
  },
  {
    name: "Malaysian Relief Agency (MRA)",
    description: "Humanitarian organization providing emergency relief and sustainable development programs for communities in need.",
    website: "https://www.malaysianrelief.org",
    email: "info@malaysianrelief.org",
    phone: "+603-7960 6432",
    state: "Selangor",
    focusAreas: "Humanitarian Aid,Disaster Relief,Community Development",
    address: "No. 32, Jalan SS 6/12, 47301 Petaling Jaya, Selangor",
    latitude: 3.1102,
    longitude: 101.6168,
    lastActivityAt: daysAgo(1) // Very active
  },
  {
    name: "Women's Aid Organisation (WAO)",
    description: "Provides free shelter, counseling, and support services for women and children affected by domestic violence.",
    website: "https://wao.org.my",
    email: "info@wao.org.my",
    phone: "+603-7956 3488",
    state: "Selangor",
    focusAreas: "Women Rights,Domestic Violence,Shelter Services",
    address: "P.O. Box 493, Jalan Sultan, 46760 Petaling Jaya, Selangor",
    latitude: 3.1067,
    longitude: 101.6056,
    lastActivityAt: daysAgo(3) // Active
  },
  {
    name: "Reef Check Malaysia",
    description: "Marine conservation NGO focused on coral reef monitoring, protection, and rehabilitation in Malaysian waters.",
    website: "https://www.reefcheck.org.my",
    email: "info@reefcheck.org.my",
    phone: "+603-2201 0911",
    state: "Kuala Lumpur",
    focusAreas: "Marine Conservation,Environment,Research",
    address: "Suite 5.01, Level 5, Menara Atlan, 161B Jalan Ampang, 50450 Kuala Lumpur",
    latitude: 3.1590,
    longitude: 101.7183,
    lastActivityAt: daysAgo(90) // Very inactive - should be red
  },
  {
    name: "Food Aid Foundation",
    description: "Rescues surplus food and redistributes to communities in need, fighting food waste and hunger simultaneously.",
    website: "https://www.foodaidfoundation.org",
    email: "info@foodaidfoundation.org",
    phone: "+603-7972 2691",
    state: "Selangor",
    focusAreas: "Food Security,Poverty Relief,Sustainability",
    address: "No. 8, Jalan PJU 3/50, Sunway Damansara, 47810 Petaling Jaya, Selangor",
    latitude: 3.1234,
    longitude: 101.5901,
    lastActivityAt: daysAgo(7) // Active
  },
  {
    name: "Dignity for Children Foundation",
    description: "Provides holistic education and community development programs for urban poor children in Kuala Lumpur.",
    website: "https://www.dignityforchildren.org",
    email: "info@dignityforchildren.org",
    phone: "+603-2697 2780",
    state: "Kuala Lumpur",
    focusAreas: "Education,Children Welfare,Urban Poor",
    address: "Lot 5-1, Level 5, Menara Sentral Vista, 150 Jalan Sultan Abdul Samad, 50470 Kuala Lumpur",
    latitude: 3.1390,
    longitude: 101.6869,
    lastActivityAt: daysAgo(10) // Active
  },
  {
    name: "The Lost Food Project",
    description: "Malaysia's first food bank, rescuing quality surplus food and redistributing to those facing food insecurity.",
    website: "https://www.thelostfoodproject.org",
    email: "hello@thelostfoodproject.org",
    phone: "+6010-936 9498",
    state: "Selangor",
    focusAreas: "Food Security,Poverty Relief,Zero Waste",
    address: "No. 10, Jalan Tandang, 46050 Petaling Jaya, Selangor",
    latitude: 3.1012,
    longitude: 101.6345,
    lastActivityAt: daysAgo(60) // Inactive - orange
  },
  {
    name: "SOLS 24/7 Malaysia",
    description: "Social enterprise providing free education, technology access, and skills training to underserved communities.",
    website: "https://sols247.org",
    email: "info@sols247.org",
    phone: "+603-7960 2020",
    state: "Selangor",
    focusAreas: "Education,Technology,Youth Development",
    address: "B-3-6, Block B, Plaza Damas, 60 Jalan Sri Hartamas 1, 50480 Kuala Lumpur",
    latitude: 3.1612,
    longitude: 101.6589,
    lastActivityAt: daysAgo(4) // Active
  },
  {
    name: "Malaysian Nature Society (MNS)",
    description: "Malaysia's oldest environmental NGO, promoting the study, conservation, and protection of natural heritage.",
    website: "https://www.mns.my",
    email: "mns@mns.my",
    phone: "+603-2287 9422",
    state: "Kuala Lumpur",
    focusAreas: "Environment,Nature Conservation,Education",
    address: "JKR 641, Jalan Kelantan, Bukit Persekutuan, 50480 Kuala Lumpur",
    latitude: 3.1390,
    longitude: 101.6802,
    lastActivityAt: daysAgo(120) // Very inactive - red
  },
  {
    name: "Yayasan Chow Kit",
    description: "Provides safe spaces, education, and support services for marginalized children and families in the Chow Kit area.",
    website: "https://www.yayasanchowkit.org",
    email: "info@yayasanchowkit.org",
    phone: "+603-2691 9718",
    state: "Kuala Lumpur",
    focusAreas: "Children Welfare,Education,Urban Poor",
    address: "No. 52, Lorong Haji Hussein 3, Off Jalan Raja Alang, 50300 Kuala Lumpur",
    latitude: 3.1667,
    longitude: 101.6978,
    lastActivityAt: daysAgo(8) // Active
  }
]

const sampleIssues = [
  {
    title: "Flash Flood Damage in Taman Sri Muda",
    description: "Severe flooding has affected over 500 families in Taman Sri Muda, Shah Alam. Immediate relief supplies and cleanup assistance needed.",
    category: "Disaster Relief",
    state: "Selangor",
    status: "in_progress",
    priority: "critical"
  },
  {
    title: "Illegal Logging in Cameron Highlands",
    description: "Reports of illegal logging activities near protected forest areas. Wildlife habitat destruction observed.",
    category: "Environment",
    state: "Pahang",
    status: "open",
    priority: "high"
  },
  {
    title: "Food Insecurity in Kerinchi PPR",
    description: "Many families in Kerinchi PPR flats struggling with food access due to economic hardship. Food bank distribution needed.",
    category: "Poverty Relief",
    state: "Kuala Lumpur",
    status: "in_progress",
    priority: "high"
  },
  {
    title: "School Dropout Rates in Rural Sabah",
    description: "High dropout rates among indigenous children in remote Sabah villages. Need for educational support programs.",
    category: "Education",
    state: "Sabah",
    status: "open",
    priority: "medium"
  },
  {
    title: "Coral Bleaching at Pulau Perhentian",
    description: "Significant coral bleaching observed at dive sites. Marine conservation intervention required.",
    category: "Marine Conservation",
    state: "Terengganu",
    status: "open",
    priority: "high"
  },
  {
    title: "Domestic Violence Cases Surge in Penang",
    description: "Increased reports of domestic violence cases. Need for shelter spaces and counseling services.",
    category: "Women Rights",
    state: "Penang",
    status: "in_progress",
    priority: "critical"
  },
  {
    title: "Abandoned Elderly in Ipoh",
    description: "Growing number of elderly being abandoned by families. Care facilities and support services needed.",
    category: "Elderly Care",
    state: "Perak",
    status: "open",
    priority: "medium"
  },
  {
    title: "Plastic Pollution at Malacca Beaches",
    description: "Excessive plastic waste washing up on Malacca beaches. Beach cleanup and awareness programs needed.",
    category: "Environment",
    state: "Malacca",
    status: "resolved",
    priority: "medium"
  }
]

// Sample projects for NGOs
const sampleProjects = [
  // Mercy Malaysia projects
  {
    title: "Mobile Clinic Program - Sabah",
    description: "Providing healthcare access to remote communities in Sabah through mobile medical teams.",
    status: "active",
    startDate: daysAgo(180),
    endDate: daysFromNow(180),
    budget: 500000,
    beneficiaries: 5000,
    location: "Sabah, East Malaysia",
    ngoName: "Mercy Malaysia"
  },
  {
    title: "Flood Relief Operation 2024",
    description: "Emergency response to recent flooding in Johor, providing food, clean water, and medical aid.",
    status: "active",
    startDate: daysAgo(30),
    budget: 250000,
    beneficiaries: 2500,
    location: "Johor Bahru, Johor",
    ngoName: "Mercy Malaysia"
  },
  // WWF-Malaysia projects
  {
    title: "Save Our Tigers Campaign",
    description: "Conservation program to protect Malayan tigers through habitat preservation and anti-poaching efforts.",
    status: "active",
    startDate: daysAgo(365),
    budget: 1200000,
    beneficiaries: 150, // tigers protected
    location: "Taman Negara, Pahang",
    ngoName: "WWF-Malaysia"
  },
  {
    title: "Plastic Free Waters",
    description: "River cleanup and community education program to reduce plastic pollution in Malaysian waterways.",
    status: "completed",
    startDate: daysAgo(200),
    endDate: daysAgo(30),
    budget: 80000,
    beneficiaries: 15000,
    location: "Klang River, Selangor",
    ngoName: "WWF-Malaysia"
  },
  // WAO projects
  {
    title: "Safe Haven Shelter Expansion",
    description: "Expanding shelter capacity to accommodate more survivors of domestic violence.",
    status: "active",
    startDate: daysAgo(90),
    budget: 350000,
    beneficiaries: 200,
    location: "Petaling Jaya, Selangor",
    ngoName: "Women's Aid Organisation (WAO)"
  },
  // Food Aid Foundation
  {
    title: "Community Kitchen Network",
    description: "Establishing community kitchens in PPR flats to provide daily meals to low-income families.",
    status: "active",
    startDate: daysAgo(60),
    budget: 150000,
    beneficiaries: 3000,
    location: "Multiple locations, KL & Selangor",
    ngoName: "Food Aid Foundation"
  },
  // Dignity for Children
  {
    title: "Digital Learning Initiative",
    description: "Providing tablets and internet access to underprivileged students for online learning.",
    status: "active",
    startDate: daysAgo(120),
    budget: 200000,
    beneficiaries: 500,
    location: "Sentul, Kuala Lumpur",
    ngoName: "Dignity for Children Foundation"
  }
]

// Sample volunteer calls
const sampleVolunteerCalls = [
  {
    title: "Flood Relief Volunteers Needed",
    description: "Urgent need for volunteers to help distribute relief supplies and assist with cleanup operations.",
    volunteersNeeded: 50,
    volunteersRegistered: 32,
    skills: "Physical fitness,Driving license,First aid",
    location: "Shah Alam, Selangor",
    startDate: daysFromNow(2),
    endDate: daysFromNow(7),
    status: "open",
    ngoName: "Mercy Malaysia"
  },
  {
    title: "Medical Volunteers for Mobile Clinic",
    description: "Doctors and nurses needed for weekend mobile clinic in rural Sabah.",
    volunteersNeeded: 10,
    volunteersRegistered: 10,
    skills: "Medical degree,Nursing qualification",
    location: "Kota Kinabalu, Sabah",
    startDate: daysFromNow(14),
    endDate: daysFromNow(16),
    status: "filled",
    ngoName: "Mercy Malaysia"
  },
  {
    title: "Beach Cleanup Volunteers",
    description: "Join us for monthly beach cleanup at Port Dickson. All ages welcome!",
    volunteersNeeded: 100,
    volunteersRegistered: 67,
    skills: "None required",
    location: "Port Dickson, Negeri Sembilan",
    startDate: daysFromNow(10),
    status: "open",
    ngoName: "WWF-Malaysia"
  },
  {
    title: "Wildlife Survey Assistants",
    description: "Help our team conduct wildlife surveys in Taman Negara. Training provided.",
    volunteersNeeded: 20,
    volunteersRegistered: 8,
    skills: "Hiking experience,Photography",
    location: "Taman Negara, Pahang",
    startDate: daysFromNow(30),
    endDate: daysFromNow(37),
    status: "open",
    ngoName: "WWF-Malaysia"
  },
  {
    title: "Shelter Support Staff",
    description: "Volunteers needed to help with administrative tasks and childcare at our shelter.",
    volunteersNeeded: 15,
    volunteersRegistered: 5,
    skills: "Childcare experience,Administrative skills,Counseling",
    location: "Petaling Jaya, Selangor",
    startDate: daysFromNow(1),
    status: "open",
    ngoName: "Women's Aid Organisation (WAO)"
  },
  {
    title: "Food Sorting & Packing",
    description: "Help sort and pack rescued food for distribution to communities.",
    volunteersNeeded: 30,
    volunteersRegistered: 28,
    skills: "None required",
    location: "Petaling Jaya, Selangor",
    startDate: daysFromNow(3),
    status: "open",
    ngoName: "Food Aid Foundation"
  },
  {
    title: "Tutoring Program Volunteers",
    description: "Volunteer tutors needed for after-school program helping underprivileged children.",
    volunteersNeeded: 25,
    volunteersRegistered: 12,
    skills: "Teaching experience,Patience,BM/English fluency",
    location: "Sentul, Kuala Lumpur",
    startDate: daysFromNow(7),
    status: "open",
    ngoName: "Dignity for Children Foundation"
  }
]

// Sample impact reports (crowdsourced)
const sampleImpactReports = [
  {
    title: "Relief supplies reached our kampung",
    testimony: "Alhamdulillah, the Mercy Malaysia team arrived yesterday with food, water and medicine. My grandmother finally got her diabetes medication after 3 days without it. Terima kasih banyak!",
    photoUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
    reporterName: "Ahmad bin Hassan",
    location: "Taman Sri Muda, Shah Alam",
    verified: true,
    ngoName: "Mercy Malaysia"
  },
  {
    title: "Mobile clinic saved my son",
    testimony: "The doctors at the mobile clinic diagnosed my son with dengue fever early. They arranged transport to the hospital. He's recovering now. Without them, we might have lost him.",
    photoUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800",
    reporterName: "Maria Gonzales",
    location: "Kampung Sugud, Sabah",
    verified: true,
    ngoName: "Mercy Malaysia"
  },
  {
    title: "Beautiful coral restoration",
    testimony: "Joined the coral planting activity at Perhentian. Amazing to see the baby corals attached to the reef. The WWF team explained everything about marine conservation. Very educational!",
    photoUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800",
    reporterName: "Tan Wei Ming",
    location: "Pulau Perhentian, Terengganu",
    verified: true,
    ngoName: "WWF-Malaysia"
  },
  {
    title: "Tigers spotted in protected area",
    testimony: "Our camera traps captured images of a mother tiger with 2 cubs in the conservation zone. This is proof that the protection efforts are working!",
    photoUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800",
    reporterName: "Dr. Zainal Abidin",
    location: "Taman Negara, Pahang",
    verified: true,
    ngoName: "WWF-Malaysia"
  },
  {
    title: "Found safety at the shelter",
    testimony: "After years of abuse, I finally had the courage to leave. WAO gave me and my children a safe place to stay. The counselors helped me rebuild my confidence. Now I have a job and my own place.",
    reporterName: "Anonymous",
    location: "Selangor",
    verified: true,
    ngoName: "Women's Aid Organisation (WAO)"
  },
  {
    title: "Food bank helped my family",
    testimony: "Since losing my job during MCO, we struggled to put food on the table. Food Aid Foundation delivers groceries every week. My children don't go hungry anymore. God bless these volunteers.",
    photoUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    reporterName: "Siti Aminah",
    location: "PPR Kerinchi, Kuala Lumpur",
    verified: true,
    ngoName: "Food Aid Foundation"
  },
  {
    title: "My daughter can read now",
    testimony: "The teachers at Dignity were so patient with my daughter who struggled with reading. After 6 months in their program, she can read Malay and English books. I cry happy tears seeing her progress.",
    photoUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    reporterName: "Rokiah binti Yusof",
    location: "Sentul, Kuala Lumpur",
    verified: true,
    ngoName: "Dignity for Children Foundation"
  },
  {
    title: "Beach cleanup made a difference",
    testimony: "I participated in the beach cleanup at Port Dickson last month. We collected over 500kg of plastic waste! The beach looks so much cleaner now. Planning to join again next month.",
    photoUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800",
    reporterName: "Kevin Lim",
    location: "Port Dickson, Negeri Sembilan",
    verified: true,
    ngoName: "WWF-Malaysia"
  },
  {
    title: "Got my first laptop for online class",
    testimony: "Before SOLS247 gave me this laptop, I had to borrow my neighbor's phone for online classes. Now I can attend all my classes and even learned to code! Thank you SOLS!",
    photoUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    reporterName: "Mohamad Hafiz",
    location: "Bukit Jalil, Kuala Lumpur",
    verified: true,
    ngoName: "SOLS 24/7 Malaysia"
  },
  {
    title: "Community garden thriving",
    testimony: "MNS helped our community start a vegetable garden. We now have fresh vegetables every week. The kids love gardening and learning about nature.",
    photoUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    reporterName: "Lakshmi Devi",
    location: "Setapak, Kuala Lumpur",
    verified: false,
    ngoName: "Malaysian Nature Society (MNS)"
  }
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️ Clearing existing data...')
  await prisma.impactReport.deleteMany()
  await prisma.volunteerCall.deleteMany()
  await prisma.project.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.nGO.deleteMany()

  // Seed NGOs
  console.log('📋 Seeding Malaysian NGOs...')
  for (const ngo of malaysianNGOs) {
    await prisma.nGO.create({
      data: ngo
    })
  }
  console.log(`✅ Created ${malaysianNGOs.length} NGOs`)

  // Get NGO IDs for linking
  const ngos = await prisma.nGO.findMany()
  const ngoMap = new Map(ngos.map(ngo => [ngo.name, ngo.id]))
  
  // Seed Issues with random NGO assignments
  console.log('📝 Seeding sample issues...')
  for (const issue of sampleIssues) {
    const randomNgo = ngos[Math.floor(Math.random() * ngos.length)]
    await prisma.issue.create({
      data: {
        ...issue,
        ngoId: randomNgo.id
      }
    })
  }
  console.log(`✅ Created ${sampleIssues.length} issues`)

  // Seed Projects
  console.log('🏗️ Seeding projects...')
  for (const project of sampleProjects) {
    const ngoId = ngoMap.get(project.ngoName)
    if (ngoId) {
      const { ngoName, ...projectData } = project
      await prisma.project.create({
        data: {
          ...projectData,
          ngoId
        }
      })
    }
  }
  console.log(`✅ Created ${sampleProjects.length} projects`)

  // Seed Volunteer Calls
  console.log('🙋 Seeding volunteer calls...')
  for (const call of sampleVolunteerCalls) {
    const ngoId = ngoMap.get(call.ngoName)
    if (ngoId) {
      const { ngoName, ...callData } = call
      await prisma.volunteerCall.create({
        data: {
          ...callData,
          ngoId
        }
      })
    }
  }
  console.log(`✅ Created ${sampleVolunteerCalls.length} volunteer calls`)

  // Seed Impact Reports
  console.log('📸 Seeding impact reports...')
  for (const report of sampleImpactReports) {
    const ngoId = ngoMap.get(report.ngoName)
    if (ngoId) {
      const { ngoName, ...reportData } = report
      await prisma.impactReport.create({
        data: {
          ...reportData,
          ngoId
        }
      })
    }
  }
  console.log(`✅ Created ${sampleImpactReports.length} impact reports`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
