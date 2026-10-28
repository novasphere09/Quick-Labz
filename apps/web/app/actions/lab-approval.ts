'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendLabApprovalNotification } from '@/lib/notifications';

export async function approveLab(labId: string) {
  try {
    const lab = await prisma.laboratory.update({
      where: { id: labId },
      data: {
        approvalStatus: 'APPROVED',
        active: true,
      }
    });
    
    // Trigger the notification
    await sendLabApprovalNotification(lab.name, lab.email, lab.phone);
    
    revalidatePath('/admin/labs/pending');
    revalidatePath('/admin/labs');
    return { success: true };
  } catch (error) {
    console.error('Error approving lab:', error);
    return { success: false, error: 'Failed to approve laboratory.' };
  }
}

export async function rejectLab(labId: string) {
  try {
    await prisma.laboratory.update({
      where: { id: labId },
      data: {
        approvalStatus: 'REJECTED',
        active: false,
      }
    });
    
    revalidatePath('/admin/labs/pending');
    return { success: true };
  } catch (error) {
    console.error('Error rejecting lab:', error);
    return { success: false, error: 'Failed to reject laboratory.' };
  }
}

export async function terminateLab(labId: string) {
  try {
    await prisma.laboratory.update({
      where: { id: labId },
      data: {
        approvalStatus: 'TERMINATED',
        active: false,
      }
    });
    
    revalidatePath('/admin/labs');
    return { success: true };
  } catch (error) {
    console.error('Error terminating lab:', error);
    return { success: false, error: 'Failed to terminate laboratory.' };
  }
}
