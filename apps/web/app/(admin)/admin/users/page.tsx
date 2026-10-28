import { prisma } from "@/lib/prisma";
import { UsersClient } from "./components/UsersClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <UsersClient initialUsers={users} />
    </div>
  );
}
