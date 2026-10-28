import { prisma } from "@/lib/prisma";
import { LabsClient } from "./components/LabsClient";

export default async function AdminLabsPage() {
  const labs = await prisma.laboratory.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <LabsClient initialLabs={labs} />
    </div>
  );
}
