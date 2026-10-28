import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const seededSlugs = [
    'apex-diagnostic-care',
    'metropath-clinical-lab',
    'citycare-reference-lab',
    'maxpath-molecular-lab'
  ];
  const res = await prisma.laboratory.updateMany({
    where: { slug: { in: seededSlugs } },
    data: { active: false }
  });
  console.log(`Deactivated ${res.count} seeded labs successfully`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
