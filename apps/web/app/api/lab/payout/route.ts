import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { upiId } = body;

    if (!upiId) {
      return NextResponse.json({ success: false, message: 'UPI ID is required' }, { status: 400 });
    }

    // Update the Laboratory associated with this user
    const updatedLab = await prisma.laboratory.update({
      where: { userId: userId },
      data: {
        upiId: upiId,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payout details updated successfully',
      upiId: updatedLab.upiId 
    });

  } catch (error) {
    console.error("Error updating payout details:", error);
    return NextResponse.json({ success: false, message: 'Failed to update payout details' }, { status: 500 });
  }
}
