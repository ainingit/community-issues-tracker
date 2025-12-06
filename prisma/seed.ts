import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const malaysianNGOs = [
  {
    name: "Mercy Malaysia",
    description: "Medical relief organization providing humanitarian aid domestically and internationally. Responds to disasters and provides healthcare to vulnerable communities.",
    website: "https://www.mercy.org.my",
    email: "info@mercy.org.my",
    phone: "+603-2935 9935",
    state: "Kuala Lumpur",
    focusAreas: "Healthcare,Disaster Relief,Humanitarian Aid"
  },
  {
    name: "WWF-Malaysia",
    description: "Leading conservation organization working to protect Malaysia's rich biodiversity, forests, and marine ecosystems.",
    website: "https://www.wwf.org.my",
    email: "contactus@wwf.org.my",
    phone: "+603-7450 3773",
    state: "Selangor",
    focusAreas: "Environment,Wildlife Conservation,Climate Action"
  },
  {
    name: "Pertubuhan Kebajikan Anak-Anak Yatim Malaysia (PEYATIM)",
    description: "Dedicated to providing shelter, education, and care for orphans across Malaysia.",
    website: "https://www.peyatim.org.my",
    email: "info@peyatim.org.my",
    phone: "+603-6250 6440",
    state: "Selangor",
    focusAreas: "Children Welfare,Education,Orphan Care"
  },
  {
    name: "Malaysian Relief Agency (MRA)",
    description: "Humanitarian organization providing emergency relief and sustainable development programs for communities in need.",
    website: "https://www.malaysianrelief.org",
    email: "info@malaysianrelief.org",
    phone: "+603-7960 6432",
    state: "Selangor",
    focusAreas: "Humanitarian Aid,Disaster Relief,Community Development"
  },
  {
    name: "Women's Aid Organisation (WAO)",
    description: "Provides free shelter, counseling, and support services for women and children affected by domestic violence.",
    website: "https://wao.org.my",
    email: "info@wao.org.my",
    phone: "+603-7956 3488",
    state: "Selangor",
    focusAreas: "Women Rights,Domestic Violence,Shelter Services"
  },
  {
    name: "Reef Check Malaysia",
    description: "Marine conservation NGO focused on coral reef monitoring, protection, and rehabilitation in Malaysian waters.",
    website: "https://www.reefcheck.org.my",
    email: "info@reefcheck.org.my",
    phone: "+603-2201 0911",
    state: "Kuala Lumpur",
    focusAreas: "Marine Conservation,Environment,Research"
  },
  {
    name: "Food Aid Foundation",
    description: "Rescues surplus food and redistributes to communities in need, fighting food waste and hunger simultaneously.",
    website: "https://www.foodaidfoundation.org",
    email: "info@foodaidfoundation.org",
    phone: "+603-7972 2691",
    state: "Selangor",
    focusAreas: "Food Security,Poverty Relief,Sustainability"
  },
  {
    name: "Dignity for Children Foundation",
    description: "Provides holistic education and community development programs for urban poor children in Kuala Lumpur.",
    website: "https://www.dignityforchildren.org",
    email: "info@dignityforchildren.org",
    phone: "+603-2697 2780",
    state: "Kuala Lumpur",
    focusAreas: "Education,Children Welfare,Urban Poor"
  },
  {
    name: "The Lost Food Project",
    description: "Malaysia's first food bank, rescuing quality surplus food and redistributing to those facing food insecurity.",
    website: "https://www.thelostfoodproject.org",
    email: "hello@thelostfoodproject.org",
    phone: "+6010-936 9498",
    state: "Selangor",
    focusAreas: "Food Security,Poverty Relief,Zero Waste"
  },
  {
    name: "SOLS 24/7 Malaysia",
    description: "Social enterprise providing free education, technology access, and skills training to underserved communities.",
    website: "https://sols247.org",
    email: "info@sols247.org",
    phone: "+603-7960 2020",
    state: "Selangor",
    focusAreas: "Education,Technology,Youth Development"
  },
  {
    name: "Malaysian Nature Society (MNS)",
    description: "Malaysia's oldest environmental NGO, promoting the study, conservation, and protection of natural heritage.",
    website: "https://www.mns.my",
    email: "mns@mns.my",
    phone: "+603-2287 9422",
    state: "Kuala Lumpur",
    focusAreas: "Environment,Nature Conservation,Education"
  },
  {
    name: "Yayasan Chow Kit",
    description: "Provides safe spaces, education, and support services for marginalized children and families in the Chow Kit area.",
    website: "https://www.yayasanchowkit.org",
    email: "info@yayasanchowkit.org",
    phone: "+603-2691 9718",
    state: "Kuala Lumpur",
    focusAreas: "Children Welfare,Education,Urban Poor"
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

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
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

  // Get NGO IDs for linking issues
  const ngos = await prisma.nGO.findMany()
  
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

