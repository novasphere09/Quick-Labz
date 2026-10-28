const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lab = await prisma.laboratory.findUnique({
    where: { id: 'cmtydt2c20002r14d9zuag7k8' }
  });
  console.log('Lab Approval Status:', lab?.approvalStatus);
}

main().finally(() => prisma.$disconnect());
