const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.healthPackage.findMany();
  console.log('Packages:', packages);
}

main().finally(() => prisma.$disconnect());
