import {
  PrismaClient,
  UserRole,
  Level,
  TokenType,
  LecturerRole,
} from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { env } from 'src/lib/environment';
import { generateAccountActivationToken } from 'src/lib/tokens';

const prisma = new PrismaClient();
const collegeOfHealthSciences = JSON.parse(
  readFileSync(
    join(__dirname, './college-of-health-sciences-structure.json'),
    'utf-8',
  ),
) as Record<
  string,
  {
    name: string;
    shortName: string;
    maxLevel: Level;
  }[]
>;

const seedFacultiesAndDepartments = async () => {
  console.log('Starting faculty and department seeding...');

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

const seedLecturerDesignations = async () => {
  const designations: { role: LecturerRole; entity: string }[] = [
    {
      role: LecturerRole.PROVOST,
      entity: `College of Health Sciences`,
    },
  ];

  // DeansMedicine
  const deanOfFacultyDesignations = Object.keys(collegeOfHealthSciences).map(
    (faculty) => ({
      role: LecturerRole.DEAN,
      entity: faculty,
    }),
  );
  designations.push(...deanOfFacultyDesignations);

  // HODs
  const departments = Object.values(collegeOfHealthSciences).flatMap(
    (faculty) => faculty,
  );
  const hodDesignations = departments.map((dept) => ({
    role: LecturerRole.HOD,
    entity: dept.name,
  }));
  designations.push(...hodDesignations);

  // Part Advisers
  for (const dept of departments) {
    const maxLevel = parseInt(dept.maxLevel.split('LVL_')[1], 10);
    for (let level = 100; level <= maxLevel; level + 100) {
      designations.push({
        role: LecturerRole.PART_ADVISER,
        entity: `${dept.name} LVL_${level}`,
      });
    }
  }

  console.log(JSON.stringify(designations));

  await prisma.lecturerDesignation.createMany({
    data: designations,
    skipDuplicates: true,
  });
};

async function main() {
  try {
    console.log('Starting database seeding...');
    await seedAdmin();
    await seedFacultiesAndDepartments();
    await seedLecturerDesignations();
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
