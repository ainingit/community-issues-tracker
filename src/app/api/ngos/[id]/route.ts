import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single NGO with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ngo = await prisma.nGO.findUnique({
      where: { id: params.id },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' }
        },
        volunteerCalls: {
          orderBy: { startDate: 'asc' }
        },
        impactReports: {
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { issues: true }
        }
      }
    })

    if (!ngo) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 })
    }

    return NextResponse.json(ngo)
  } catch (error) {
    console.error('Error fetching NGO:', error)
    return NextResponse.json({ error: 'Failed to fetch NGO' }, { status: 500 })
  }
}

// PATCH update NGO (including lastActivityAt)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const ngo = await prisma.nGO.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.website !== undefined && { website: body.website }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.state && { state: body.state }),
        ...(body.focusAreas && { focusAreas: body.focusAreas }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.latitude !== undefined && { latitude: body.latitude }),
        ...(body.longitude !== undefined && { longitude: body.longitude }),
        // Update lastActivityAt when any update is made
        lastActivityAt: new Date()
      }
    })

    return NextResponse.json(ngo)
  } catch (error) {
    console.error('Error updating NGO:', error)
    return NextResponse.json({ error: 'Failed to update NGO' }, { status: 500 })
  }
}
