import { PrismaClient, UserRole, Level } from '@prisma/client';
import { env } from 'src/lib/environment';

const prisma = new PrismaClient();

const seedFacultiesAndDepartments = async () => {
  console.log('Starting faculty and department seeding...');

  const collegeOfHealthSciences: Record<
    string,
    { name: string; maxLevel: Level }[]
  > = {
    'Basic Medical Sciences': [
      { name: 'Anatomy and Cell Biology', maxLevel: Level.LVL_400 },
      { name: 'Chemical Pathology', maxLevel: Level.LVL_500 },
      { name: 'Haematology and Immunology', maxLevel: Level.LVL_500 },
      { name: 'Medical Biochemistry', maxLevel: Level.LVL_400 },
      {
        name: 'Medical Pharmacology and Therapeutics',
        maxLevel: Level.LVL_500,
      },
      { name: 'Department of Medical Rehabilitation', maxLevel: Level.LVL_600 },
      { name: 'Morbid Anatomy and Forensic Medicine', maxLevel: Level.LVL_500 },
      { name: 'Nursing Science', maxLevel: Level.LVL_500 },
      { name: 'Physiological Sciences', maxLevel: Level.LVL_400 },
    ],
    'Faculty of Clinical Sciences': [
      { name: 'Anaethesia and Intensive Care', maxLevel: Level.LVL_600 },
      { name: 'Community Health', maxLevel: Level.LVL_600 },
      { name: 'Dermatology and Venereology', maxLevel: Level.LVL_600 },
      { name: 'Medicine', maxLevel: Level.LVL_600 },
      { name: 'Mental Health', maxLevel: Level.LVL_600 },
      {
        name: 'Obstetrics, Gyanaecology and Perinatology',
        maxLevel: Level.LVL_600,
      },
      { name: 'Ophthalmology', maxLevel: Level.LVL_600 },
      { name: 'Orthopaedic Surgery and Traumatology', maxLevel: Level.LVL_600 },
      { name: 'Otorhinolaryngology', maxLevel: Level.LVL_600 },
      { name: 'Paediatrics and Child Health', maxLevel: Level.LVL_600 },
      { name: 'Radiology', maxLevel: Level.LVL_600 },
      { name: 'Surgery', maxLevel: Level.LVL_600 },
    ],
    Dentistry: [
      { name: 'Child Dental Health', maxLevel: Level.LVL_600 },
      { name: 'Oral or Maxillofacial Surgery', maxLevel: Level.LVL_600 },
      { name: 'Oral Medicine and Oral Pathology', maxLevel: Level.LVL_600 },
      { name: 'Preventive and Community Dentistry', maxLevel: Level.LVL_600 },
      { name: 'Restorative Dentistry', maxLevel: Level.LVL_600 },
    ],
  };

  await prisma.$transaction(async (tx) => {
    for (const [facultyName, departments] of Object.entries(
      collegeOfHealthSciences,
    )) {
      console.log(`Processing faculty: ${facultyName}`);

      await tx.faculty.upsert({
        where: { name: facultyName },
        update: {},
        create: {
          name: facultyName,
          departments: {
            create: departments.map((dept) => ({
              name: dept.name,
              maxLevel: dept.maxLevel,
            })),
          },
        },
      });

      console.log(
        `Upserted faculty: ${facultyName} with ${departments.length} departments`,
      );
    }
  });

  console.log('Faculty and department seeding completed.');
};

const seedAdmin = async () => {
  console.log('Starting admin seeding...');
  for (const admin of env.DEFAULT_ADMINS) {
    console.log(`Checking admin: ${admin.email}`);
    const existingUser = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (existingUser) continue;

    await prisma.user.create({
      data: {
        email: admin.email,
        role: UserRole.ADMIN,
        admin: {
          create: { name: admin.name },
        },
      },
    });

    console.log(`Created admin: ${admin.email}`);
  }
  console.log('Admin seeding completed.');
};

async function main() {
  try {
    console.log('Starting database seeding...');
    await seedFacultiesAndDepartments();
    await seedAdmin();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    console.log('Disconnecting Prisma client...');
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  }
}

main();
