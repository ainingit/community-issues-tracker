import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all NGOs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    const where: {
      state?: string
      OR?: Array<{ name?: { contains: string }, description?: { contains: string } }>
    } = {}

    if (state && state !== 'all') {
      where.state = state
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const ngos = await prisma.nGO.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { issues: true }
        }
      }
    })

    return NextResponse.json(ngos)
  } catch (error) {
    console.error('Error fetching NGOs:', error)
    return NextResponse.json({ error: 'Failed to fetch NGOs' }, { status: 500 })
  }
}

// POST create new NGO
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const ngo = await prisma.nGO.create({
      data: {
        name: body.name,
        description: body.description,
        website: body.website || null,
        email: body.email || null,
        phone: body.phone || null,
        state: body.state,
        focusAreas: body.focusAreas
      }
    })

    return NextResponse.json(ngo, { status: 201 })
  } catch (error) {
    console.error('Error creating NGO:', error)
    return NextResponse.json({ error: 'Failed to create NGO' }, { status: 500 })
  }
}

