import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all issues
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const state = searchParams.get('state')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    const where: {
      status?: string
      state?: string
      category?: string
      priority?: string
    } = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (state && state !== 'all') {
      where.state = state
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (priority && priority !== 'all') {
      where.priority = priority
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        ngo: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(issues)
  } catch (error) {
    console.error('Error fetching issues:', error)
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}

// POST create new issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const issue = await prisma.issue.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        state: body.state,
        status: body.status || 'open',
        priority: body.priority || 'medium',
        ngoId: body.ngoId || null
      },
      include: {
        ngo: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error('Error creating issue:', error)
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 })
  }
}

