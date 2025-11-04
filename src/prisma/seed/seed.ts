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
  console.log('\n=== Faculty & Department Seeding Started ===\n');

  await prisma.$transaction(async (tx) => {
    for (const [facultyName, departments] of Object.entries(
      collegeOfHealthSciences,
    )) {
      console.log(`Processing Faculty: ${facultyName}`);

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
        `→ Upserted Faculty: ${facultyName} (${departments.length} departments)\n`,
      );
    }
  });

  console.log('=== Faculty & Department Seeding Completed ===\n');
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

  const resetPasswordUrl = new URL(env.FRONTEND_BASE_URL);
  resetPasswordUrl.searchParams.set('email', email);
  resetPasswordUrl.searchParams.set('role', UserRole.ADMIN);
  resetPasswordUrl.searchParams.set('token', tokenString);
  console.log(`Activation link generated for ${email}:`);
  console.log(resetPasswordUrl.toString(), '\n');
}

const seedAdmin = async () => {
  console.log('\n=== Admin Seeding Started ===\n');

  for (const admin of env.DEFAULT_ADMINS) {
    console.log(`Checking Admin: ${admin.email}`);

    const foundUser = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (foundUser) {
      console.log(`→ Admin already exists: ${admin.email}\n`);
      continue;
    }

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
    console.log(`→ Created Admin: ${admin.email}\n`);
  }

  console.log('=== Admin Seeding Completed ===\n');
};

const seedLecturerDesignations = async () => {
  console.log('\n=== Lecturer Designations Seeding Started ===\n');

  const designations: { role: LecturerRole; entity: string }[] = [
    {
      role: LecturerRole.PROVOST,
      entity: `College of Health Sciences`,
    },
  ];
  console.log('→ Added Provost Designation');

  const deanOfFacultyDesignations = Object.keys(collegeOfHealthSciences).map(
    (faculty) => ({
      role: LecturerRole.DEAN,
      entity: faculty,
    }),
  );
  designations.push(...deanOfFacultyDesignations);
  console.log(`→ Added ${deanOfFacultyDesignations.length} Dean Designations`);

  const departments = Object.values(collegeOfHealthSciences).flatMap(
    (faculty) => faculty,
  );
  const hodDesignations = departments.map((dept) => ({
    role: LecturerRole.HOD,
    entity: dept.name,
  }));
  designations.push(...hodDesignations);
  console.log(`→ Added ${hodDesignations.length} HOD Designations`);

  let partAdviserCount = 0;
  for (const dept of departments) {
    const maxLevel = parseInt(dept.maxLevel.split('LVL_')[1], 10);
    for (let level = 100; level <= maxLevel; level += 100) {
      designations.push({
        role: LecturerRole.PART_ADVISER,
        entity: `${dept.name} LVL_${level}`,
      });
      partAdviserCount++;
    }
  }
  console.log(`→ Added ${partAdviserCount} Part Adviser Designations`);

  await prisma.lecturerDesignation.createMany({
    data: designations,
    skipDuplicates: true,
  });

  console.log(
    `\nTotal Lecturer Designations Added: ${designations.length}\n=== Lecturer Designations Seeding Completed ===\n`,
  );
};

async function main() {
  try {
    console.log('\n====================================');
    console.log('🚀 Starting Database Seeding Process');
    console.log('====================================\n');

    await seedAdmin();
    await seedFacultiesAndDepartments();
    await seedLecturerDesignations();

    console.log('✅ Database Seeding Completed Successfully.\n');
  } catch (error) {
    console.error('\n❌ Error Seeding Database:\n', error);
    process.exit(1);
  } finally {
    console.log('Disconnecting Prisma Client...\n');
    await prisma.$disconnect();
    console.log('✅ Prisma Client Disconnected.\n');
  }
}

main();
