import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from 'src/environment';
import * as schema from 'drizzle/schema';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log('Starting database seed...');

  // Admins
  const defaultAdmins = env.DEFAULT_ADMINS;
  console.log(`Seeding ${defaultAdmins.length} admin(s)...`);

  await db
    .insert(schema.admin)
    .values(
      defaultAdmins.map((admin) => ({
        id: uuidv4(),
        role: 'admin',
        ...admin,
      })),
    )
    .onConflictDoNothing({ target: schema.admin.email });

  console.log('Admins seeded');

  const collegeOfHealthSciences: Record<string, string[]> = {
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

  console.log('Seeding faculties and departments...');

  // Faculties and Departments
  await db.transaction(async (tx) => {
    for (const [facultyName, departments] of Object.entries(
      collegeOfHealthSciences,
    )) {
      console.log(`Faculty: ${facultyName}`);

      const [insertedFaculty] = await tx
        .insert(schema.faculty)
        .values({ name: facultyName })
        .returning();

      await tx.insert(schema.department).values(
        departments.map((deptName) => ({
          name: deptName,
          facultyId: insertedFaculty.id,
        })),
      );

      console.log(
        `Inserted ${departments.length} departments for ${facultyName}`,
      );
    }
  });

  console.log('Database seed complete');
}

seed()
  .then(() => {
    console.log('Seeding finished successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
