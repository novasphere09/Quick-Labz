import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth";
import { prisma } from "@/lib/prisma";
import { sendLabApprovalNotification } from "@/lib/notifications";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const data = await req.json();
    const lab = await prisma.laboratory.update({
      where: { id: params.id },
      data: { 
        active: data.active,
        approvalStatus: data.active ? 'APPROVED' : 'TERMINATED'
      }
    });

    if (data.active) {
      // Trigger notification if newly approved
      await sendLabApprovalNotification(lab.name, lab.email, lab.phone);
    }

    return NextResponse.json(lab);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lab" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await prisma.laboratory.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Cannot delete lab because it has active bookings" }, { status: 500 });
  }
}
