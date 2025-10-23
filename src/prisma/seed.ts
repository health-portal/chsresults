import { PrismaClient, StaffRole, UserRole } from '@prisma/client';
import { env } from 'src/environment';

const prisma = new PrismaClient();

const seedFacultiesAndDepartments = async () => {
  console.log('Starting faculty and department seeding...');
  const collegeOfHealthSciences = {
    'Basic Medical Sciences': [
      'Anatomy and Cell Biology',
      'Chemical Pathology',
      'Haematology and Immunology',
      'Medical Biochemistry',
      'Medical Pharmacology and Therapeutics',
      'Department of Medical Rehabilitation',
      'Morbid Anatomy and Forensic Medicine',
      'Nursing Science',
      'Physiological Sciences',
    ],
    'Faculty of Clinical Sciences': [
      'Anaethesia and Intensive Care',
      'Community Health',
      'Dermatology and Venereology',
      'Medicine',
      'Mental Health',
      'Obstetrics, Gyanaecology and Perinatology',
      'Ophthalmology',
      'Orthopaedic Surgery and Traumatology',
      'Otorhinolaryngology',
      'Paediatrics and Child Health',
      'Radiology',
      'Surgery',
    ],
    Dentistry: [
      'Child Dental Health',
      'Oral or Maxillofacial Surgery',
      'Oral Medicine and Oral Pathology',
      'Preventive and Community Dentistry',
      'Restorative Dentistry',
    ],
  };

  await prisma.$transaction(async (tx) => {
    for (const [facultyName, departmentNames] of Object.entries(
      collegeOfHealthSciences,
    )) {
      console.log(`Processing faculty: ${facultyName}`);
      await tx.faculty.upsert({
        where: { name: facultyName },
        update: {},
        create: {
          name: facultyName,
          departments: {
            create: departmentNames.map((name) => ({ name })),
          },
        },
      });
      console.log(
        `Upserted faculty: ${facultyName} with ${departmentNames.length} departments`,
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
        fullName: admin.name,
        role: UserRole.STAFF,
        staff: {
          create: { role: StaffRole.ADMIN },
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
