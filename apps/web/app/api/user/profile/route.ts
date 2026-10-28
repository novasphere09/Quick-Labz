export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfiles: true,
        addresses: {
          orderBy: { createdAt: 'desc' }
        },
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const profile = user.patientProfiles[0] || null;
    const addresses = user.addresses;

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      profile, 
      addresses 
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, email, phone, age, gender, bloodGroup } = body;

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        ...(email && { email }),
        ...(phone && { phone }),
      },
    });

    // Upsert PatientProfile
    // First, find if one exists
    const existingProfile = await prisma.patientProfile.findFirst({
      where: { userId },
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.patientProfile.update({
        where: { id: existingProfile.id },
        data: {
          fullName: name,
          age: parseInt(age) || 30,
          gender: gender || 'Male',
          bloodGroup: bloodGroup || null,
        },
      });
    } else {
      profile = await prisma.patientProfile.create({
        data: {
          userId,
          fullName: name,
          age: parseInt(age) || 30,
          gender: gender || 'Male',
          bloodGroup: bloodGroup || null,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully', user: updatedUser, profile });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ success: false, message: 'Failed to update profile' }, { status: 500 });
  }
}

