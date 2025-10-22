import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedFacultiesAndDepartments = async () => {
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
    }
  });
};

async function main() {
  try {
    await seedFacultiesAndDepartments();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
