import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from 'src/environment';
import * as schema from 'drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

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

      let facultyRecord = await db.query.faculty.findFirst({
        where: eq(schema.faculty.name, facultyName),
      });

      if (!facultyRecord) {
        [facultyRecord] = await tx
          .insert(schema.faculty)
          .values({ name: facultyName })
          .onConflictDoNothing()
          .returning();
      }

      await tx
        .insert(schema.department)
        .values(
          departments.map((deptName) => ({
            name: deptName,
            facultyId: facultyRecord.id,
          })),
        )
        .onConflictDoNothing();
    }
  });

  console.log('Database seed complete');
}

seed()
  .then(async () => {
    console.log('Seeding finished successfully');
    await pool.end();
  })
  .catch(async (err) => {
    console.error('Seeding failed:', err);
    await pool.end();
    process.exitCode = 1;
  });
