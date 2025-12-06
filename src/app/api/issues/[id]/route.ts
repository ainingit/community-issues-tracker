import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single issue
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: params.id },
      include: {
        ngo: true
      }
    })

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Error fetching issue:', error)
    return NextResponse.json({ error: 'Failed to fetch issue' }, { status: 500 })
  }
}

// PATCH update issue (for status updates)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const issue = await prisma.issue.update({
      where: { id: params.id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.priority && { priority: body.priority }),
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.category && { category: body.category }),
        ...(body.state && { state: body.state }),
        ...(body.ngoId !== undefined && { ngoId: body.ngoId || null })
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

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Error updating issue:', error)
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 })
  }
}

// DELETE issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.issue.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Issue deleted successfully' })
  } catch (error) {
    console.error('Error deleting issue:', error)
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 })
  }
}

