import { PrismaClient, UserRole, Level, TokenType } from '@prisma/client';
import { env } from 'src/lib/environment';
import { generateAccountActivationToken } from 'src/lib/tokens';

const prisma = new PrismaClient();

const seedFacultiesAndDepartments = async () => {
  console.log('Starting faculty and department seeding...');

  const collegeOfHealthSciences: Record<
    string,
    { name: string; shortName: string; maxLevel: Level }[]
  > = {
    'Basic Medical Sciences': [
      {
        name: 'Anatomy and Cell Biology',
        shortName: 'ACB',
        maxLevel: Level.LVL_400,
      },
      { name: 'Chemical Pathology', shortName: 'CHP', maxLevel: Level.LVL_500 },
      {
        name: 'Haematology and Immunology',
        shortName: 'HAI',
        maxLevel: Level.LVL_500,
      },
      {
        name: 'Medical Biochemistry',
        shortName: 'MBC',
        maxLevel: Level.LVL_400,
      },
      {
        name: 'Medical Pharmacology and Therapeutics',
        shortName: 'MPT',
        maxLevel: Level.LVL_500,
      },
      {
        name: 'Department of Medical Rehabilitation',
        shortName: 'DMR',
        maxLevel: Level.LVL_600,
      },
      {
        name: 'Morbid Anatomy and Forensic Medicine',
        shortName: 'MAF',
        maxLevel: Level.LVL_500,
      },
      { name: 'Nursing Science', shortName: 'NRS', maxLevel: Level.LVL_500 },
      {
        name: 'Physiological Sciences',
        shortName: 'PHS',
        maxLevel: Level.LVL_400,
      },
    ],
    'Faculty of Clinical Sciences': [
      {
        name: 'Anaethesia and Intensive Care',
        shortName: 'AIC',
        maxLevel: Level.LVL_600,
      },
      { name: 'Community Health', shortName: 'CMH', maxLevel: Level.LVL_600 },
      {
        name: 'Dermatology and Venereology',
        shortName: 'DRV',
        maxLevel: Level.LVL_600,
      },
      { name: 'Medicine', shortName: 'MED', maxLevel: Level.LVL_600 },
      { name: 'Mental Health', shortName: 'MNH', maxLevel: Level.LVL_600 },
      {
        name: 'Obstetrics, Gyanaecology and Perinatology',
        shortName: 'OBG',
        maxLevel: Level.LVL_600,
      },
      { name: 'Ophthalmology', shortName: 'OPH', maxLevel: Level.LVL_600 },
      {
        name: 'Orthopaedic Surgery and Traumatology',
        shortName: 'ORT',
        maxLevel: Level.LVL_600,
      },
      {
        name: 'Otorhinolaryngology',
        shortName: 'ENT',
        maxLevel: Level.LVL_600,
      },
      {
        name: 'Paediatrics and Child Health',
        shortName: 'PED',
        maxLevel: Level.LVL_600,
      },
      { name: 'Radiology', shortName: 'RAD', maxLevel: Level.LVL_600 },
      { name: 'Surgery', shortName: 'SUR', maxLevel: Level.LVL_600 },
    ],
    Dentistry: [
      {
        name: 'Child Dental Health',
        shortName: 'CDH',
        maxLevel: Level.LVL_600,
      },
      {
        name: 'Oral or Maxillofacial Surgery',
        shortName: 'OMS',
        maxLevel: Level.LVL_600,
      },
      {
        name: 'Oral Medicine and Oral Pathology',
        shortName: 'OMP',
        maxLevel: Level.LVL_600,
      },
      {
        name: 'Preventive and Community Dentistry',
        shortName: 'PCD',
        maxLevel: Level.LVL_600,
      },
      {
        name: 'Restorative Dentistry',
        shortName: 'RED',
        maxLevel: Level.LVL_600,
      },
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
              shortName: dept.shortName,
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

async function sendActivationToken(userId: string, email: string) {
  const { tokenString, expiresAt } = generateAccountActivationToken();
  await prisma.tokenData.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      tokenString,
      tokenType: TokenType.ACCOUNT_ACTIVATION,
      expiresAt,
    },
  });

  // TODO: Send activation link email
  const resetPasswordUrl = new URL(env.FRONTEND_BASE_URL);
  resetPasswordUrl.searchParams.set('email', email);
  resetPasswordUrl.searchParams.set('role', UserRole.ADMIN);
  resetPasswordUrl.searchParams.set('token', tokenString);
  console.log(resetPasswordUrl);
}

const seedAdmin = async () => {
  console.log('Starting admin seeding...');
  for (const admin of env.DEFAULT_ADMINS) {
    console.log(`Checking admin: ${admin.email}`);
    const foundUser = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (foundUser) continue;

    const createdUser = await prisma.user.create({
      data: {
        email: admin.email,
        role: UserRole.ADMIN,
        admin: {
          create: { name: admin.name },
        },
      },
    });

    await sendActivationToken(createdUser.id, admin.email);
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
