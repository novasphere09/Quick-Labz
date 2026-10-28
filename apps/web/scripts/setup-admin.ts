import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'ranaayush063@gmail.com';
  const password = 'RRhy8v0pzc@931';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'Rana Ayush',
      email,
      phone: '0000000000', // Dummy phone since it is required and unique
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin user setup successfully:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
