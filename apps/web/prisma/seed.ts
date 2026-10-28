import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding QuickLabz database with production-ready HealthTech data...');

  // Clear existing records in correct relation order
  try {
    await prisma.report.deleteMany({});
    await prisma.referralTransaction.deleteMany({});
    await prisma.bookingItem.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.packageTest.deleteMany({});
    await prisma.healthPackage.deleteMany({});
    await prisma.labTest.deleteMany({});
    await prisma.test.deleteMany({});
    await prisma.testCategory.deleteMany({});
    await prisma.laboratory.deleteMany({});
    await prisma.collector.deleteMany({});
    await prisma.referralPartner.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.patientProfile.deleteMany({});
    await prisma.serviceArea.deleteMany({});
    await prisma.platformSetting.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (e) {
    console.log('Tables already clear or fresh database.');
  }

  // 1. Users for each Persona
  const adminUser = await prisma.user.create({
    data: {
      name: 'QuickLabz Admin',
      email: 'admin@quicklabz.com',
      phone: '7018623940',
      role: 'ADMIN',
    },
  });

  const patientUser = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '9876543210',
      role: 'PATIENT',
    },
  });

  const labUser = await prisma.user.create({
    data: {
      name: 'Apex Diagnostic Care Manager',
      email: 'manager@apexdiagnostics.com',
      phone: '9811122233',
      role: 'LAB_PARTNER',
    },
  });

  const collectorUser = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar (Phlebotomist)',
      email: 'collector@quicklabz.com',
      phone: '9811022334',
      role: 'COLLECTOR',
    },
  });

  // Patient Profile & Saved Address
  await prisma.patientProfile.create({
    data: {
      userId: patientUser.id,
      fullName: 'Rohan Sharma',
      age: 34,
      gender: 'Male',
      bloodGroup: 'O+',
      emergencyContact: '9876543211',
    },
  });

  await prisma.address.create({
    data: {
      userId: patientUser.id,
      house: 'Flat 402, Tower 3',
      street: 'Express Green Apartments',
      area: 'Vaishali Sector 4',
      city: 'Ghaziabad',
      state: 'Delhi NCR',
      pincode: '201010',
      landmark: 'Near Mahagun Mall',
      isDefault: true,
    },
  });

  // 2. Service Areas
  const serviceAreas = [
    { city: 'Delhi NCR', pincode: '110001', areaName: 'Connaught Place / Central Delhi', isServed: true },
    { city: 'Delhi NCR', pincode: '110016', areaName: 'Hauz Khas / Green Park', isServed: true },
    { city: 'Delhi NCR', pincode: '110092', areaName: 'Laxmi Nagar / East Delhi', isServed: true },
    { city: 'Noida', pincode: '201301', areaName: 'Sector 15 / Sector 18 Noida', isServed: true },
    { city: 'Noida', pincode: '201309', areaName: 'Sector 62 / Sector 63 IT Hub', isServed: true },
    { city: 'Ghaziabad', pincode: '201010', areaName: 'Vaishali / Kaushambi', isServed: true },
    { city: 'Ghaziabad', pincode: '201014', areaName: 'Indirapuram / Vasundhara', isServed: true },
    { city: 'Gurugram', pincode: '122001', areaName: 'DLF Phase 1-5 / Cyber City', isServed: true },
    { city: 'Bengaluru', pincode: '560001', areaName: 'MG Road / Indiranagar (Beta)', isServed: true },
    { city: 'Mumbai', pincode: '400001', areaName: 'Fort / South Mumbai (Beta)', isServed: true },
  ];

  for (const sa of serviceAreas) {
    await prisma.serviceArea.create({ data: sa });
  }

  // 3. Platform Settings
  const settings = [
    { key: 'SUPPORT_PHONE', value: '7018623940', description: 'Primary customer support phone' },
    { key: 'SUPPORT_EMAIL', value: 'quicklabzofficial@gmail.com', description: 'Primary support email' },
    { key: 'WHATSAPP_NUMBER', value: '917018623940', description: 'WhatsApp Business number' },
    { key: 'HOME_COLLECTION_CHARGE', value: '0', description: 'Doorstep sample collection fee (Free Beta)' },
    { key: 'ACTIVE_CITY', value: 'Delhi NCR', description: 'Current primary service zone' },
    { key: 'REFERRAL_SLAB_SMALL', value: '30', description: 'Referral payout for tests ₹99-₹349' },
    { key: 'REFERRAL_SLAB_REGULAR', value: '60', description: 'Referral payout for tests ₹350-₹799' },
    { key: 'REFERRAL_SLAB_ADVANCED', value: '120', description: 'Referral payout for tests ₹800-₹1299' },
    { key: 'REFERRAL_SLAB_PACKAGE', value: '300', description: 'Referral payout for Full Body Package' },
  ];

  for (const s of settings) {
    await prisma.platformSetting.create({ data: s });
  }

  // 4. Partner Laboratories
  const lab1 = await prisma.laboratory.create({
    data: {
      name: 'Apex Diagnostic Care & Pathology',
      slug: 'apex-diagnostic-care',
      area: 'Indirapuram & Sector 62',
      city: 'Delhi NCR',
      pincode: '201014',
      distanceKm: 2.1,
      turnaroundText: '12 - 24 Hours',
      partnerStatus: 'Verified Partner Lab',
      rating: 4.9,
      phone: '+91 98111 22233',
      email: 'lab@apexdiagnostics.com',
      address: 'Plot 14-B, Niti Khand 1, Indirapuram, Ghaziabad, UP 201014',
      active: true,
      userId: labUser.id,
    },
  });

  const lab2 = await prisma.laboratory.create({
    data: {
      name: 'MetroPath Clinical Diagnostic Hub',
      slug: 'metropath-clinical-lab',
      area: 'Sector 62 / Noida Central',
      city: 'Noida',
      pincode: '201309',
      distanceKm: 3.8,
      turnaroundText: '18 - 24 Hours',
      partnerStatus: 'Verified Partner Lab',
      rating: 4.8,
      phone: '+91 98222 33344',
      email: 'contact@metropathlabs.in',
      address: 'B-Block, Electronic City Metro Hub, Sector 62, Noida 201309',
      active: true,
    },
  });

  const lab3 = await prisma.laboratory.create({
    data: {
      name: 'CityCare Reference Laboratory',
      slug: 'citycare-reference-lab',
      area: 'South Extension & Central Delhi',
      city: 'Delhi',
      pincode: '110049',
      distanceKm: 5.4,
      turnaroundText: '12 - 18 Hours',
      partnerStatus: 'Verified Partner Lab',
      rating: 4.9,
      phone: '+91 98333 44455',
      email: 'ops@citycarediagnostics.com',
      address: 'Ring Road, South Extension Part II, New Delhi 110049',
      active: true,
    },
  });

  const lab4 = await prisma.laboratory.create({
    data: {
      name: 'MaxPath Molecular Diagnostics',
      slug: 'maxpath-molecular-lab',
      area: 'Connaught Place & Civil Lines',
      city: 'Delhi',
      pincode: '110001',
      distanceKm: 6.8,
      turnaroundText: '24 Hours',
      partnerStatus: 'Verified Partner Lab',
      rating: 4.7,
      phone: '+91 98444 55566',
      email: 'info@maxpathmolecular.com',
      address: 'Barakhamba Road, Connaught Place, Central Delhi 110001',
      active: true,
    },
  });

  const allLabs = [lab1, lab2, lab3, lab4];

  // 5. Collectors / Phlebotomists
  const collector1 = await prisma.collector.create({
    data: {
      name: 'Rajesh Kumar',
      phone: '9811022334',
      email: 'collector@quicklabz.com',
      area: 'Indirapuram / Vaishali / Noida Sec 62',
      city: 'Delhi NCR',
      active: true,
      userId: collectorUser.id,
    },
  });

  const collector2 = await prisma.collector.create({
    data: {
      name: 'Amit Sharma',
      phone: '9822033445',
      email: 'amit.collector@quicklabz.com',
      area: 'South Delhi / Hauz Khas / Saket',
      city: 'Delhi NCR',
      active: true,
    },
  });

  const collector3 = await prisma.collector.create({
    data: {
      name: 'Vikram Singh',
      phone: '9833044556',
      email: 'vikram.collector@quicklabz.com',
      area: 'East Delhi / Laxmi Nagar / Preet Vihar',
      city: 'Delhi NCR',
      active: true,
    },
  });

  // 6. Referral Partners
  const ref1 = await prisma.referralPartner.create({
    data: {
      name: 'Dr. Verma Family Clinic & Wellness',
      type: 'CLINIC',
      code: 'CLINIC001',
      phone: '9810011223',
      email: 'drvermaclinic@gmail.com',
      totalEarnings: 1800,
      paidEarnings: 1200,
      pendingEarnings: 600,
      active: true,
    },
  });

  const ref2 = await prisma.referralPartner.create({
    data: {
      name: 'Apollo Pharmacy Partner Vaishali',
      type: 'PHARMACY',
      code: 'MEDICAL001',
      phone: '9820022334',
      email: 'vaishali.apollo@partner.com',
      totalEarnings: 2400,
      paidEarnings: 2000,
      pendingEarnings: 400,
      active: true,
    },
  });

  const ref3 = await prisma.referralPartner.create({
    data: {
      name: 'Dr. Sneha Rao Diabetes & Thyroid Care',
      type: 'DOCTOR',
      code: 'DOC002',
      phone: '9830033445',
      email: 'drsneha.endocrine@gmail.com',
      totalEarnings: 3600,
      paidEarnings: 3000,
      pendingEarnings: 600,
      active: true,
    },
  });

  // 7. Test Categories
  const catData = [
    { name: 'Diabetes', slug: 'diabetes', icon: 'Activity', description: 'Blood glucose, HbA1C, and insulin metabolic markers' },
    { name: 'Thyroid', slug: 'thyroid', icon: 'Zap', description: 'TSH, T3, T4 and complete thyroid profile assays' },
    { name: 'Vitamins', slug: 'vitamins', icon: 'Sun', description: 'Essential Vitamin D3, B12, and micronutrient levels' },
    { name: 'Blood Tests', slug: 'blood-tests', icon: 'Droplets', description: 'Complete Blood Count (CBC), ESR, Blood Grouping and hematology' },
    { name: 'Liver', slug: 'liver', icon: 'HeartPulse', description: 'Liver Function Tests (LFT), Bilirubin, SGOT/SGPT enzymes' },
    { name: 'Kidney', slug: 'kidney', icon: 'Shield', description: 'Renal Function (RFT), Creatinine, Urea, and filtration rate' },
    { name: 'Lipid', slug: 'lipid', icon: 'PieChart', description: 'Cholesterol, Triglycerides, HDL, LDL, and VLDL profiling' },
    { name: 'Infection', slug: 'infection', icon: 'AlertCircle', description: 'CRP, Widal, Typhoid, Malaria, and Viral infection screens' },
    { name: 'Hormonal', slug: 'hormonal', icon: 'Compass', description: 'PSA, Rheumatoid factor, and endocrine assessments' },
    { name: 'Urine', slug: 'urine', icon: 'TestTube', description: 'Urine Routine, Microscopic examination, and sterile Culture' },
    { name: 'Cardiac', slug: 'cardiac', icon: 'Heart', description: 'Troponin-T, Troponin-I, Electrolytes, and cardiovascular risk' },
    { name: 'Other', slug: 'other', icon: 'Layers', description: 'Specialized and multi-parameter pathology screenings' },
  ];

  const catMap: Record<string, string> = {};
  for (let i = 0; i < catData.length; i++) {
    const created = await prisma.testCategory.create({
      data: {
        ...catData[i],
        sortOrder: i + 1,
      },
    });
    catMap[created.slug] = created.id;
  }

  // 8. Test Catalog (Exact tests & pricing from Section 11 of the prompt)
  const rawTests = [
    {
      name: 'FBS / RBS (Blood Sugar Fasting / Random)',
      slug: 'fbs-rbs-blood-sugar',
      categorySlug: 'diabetes',
      labPrice: 30,
      sellingPrice: 99,
      sampleType: 'Fluoride Blood (Grey Tube)',
      fastingRequired: true,
      fastingDurationHours: 10,
      preparationNotes: 'Fasting 10 to 12 hours required before collection for FBS. Water intake is allowed.',
      turnaroundHours: 12,
      description: 'Measures glucose concentration in blood to screen for prediabetes and monitor diabetes mellitus management.',
      popular: true,
    },
    {
      name: 'Lipid Profile',
      slug: 'lipid-profile',
      categorySlug: 'lipid',
      labPrice: 250,
      sellingPrice: 399,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: true,
      fastingDurationHours: 12,
      preparationNotes: 'Mandatory 12 to 14 hours overnight fasting. Avoid fatty meals and alcohol 24 hours prior.',
      turnaroundHours: 18,
      description: 'Comprehensive panel measuring Total Cholesterol, HDL, LDL, VLDL, and Triglycerides to evaluate cardiovascular risk.',
      popular: true,
    },
    {
      name: 'HbA1C (Glycated Hemoglobin)',
      slug: 'hba1c',
      categorySlug: 'diabetes',
      labPrice: 300,
      sellingPrice: 449,
      sampleType: 'EDTA Whole Blood (Purple Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'Fasting is not mandatory. Can be taken at any convenient time of the day.',
      turnaroundHours: 12,
      description: 'Gold standard biomarker indicating average blood glucose control over the preceding 2 to 3 months.',
      popular: true,
    },
    {
      name: 'TSH (Thyroid Stimulating Hormone)',
      slug: 'tsh-thyroid-stimulating-hormone',
      categorySlug: 'thyroid',
      labPrice: 200,
      sellingPrice: 329,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'Early morning sample preferred. Please take morning thyroid medications after sample collection.',
      turnaroundHours: 12,
      description: 'Sensitive pituitary hormone test to screen for hypothyroidism, hyperthyroidism, and thyroid gland dysfunction.',
      popular: true,
    },
    {
      name: 'TFT (Total Thyroid Profile - T3, T4, TSH)',
      slug: 'tft-total-thyroid-profile',
      categorySlug: 'thyroid',
      labPrice: 300,
      sellingPrice: 449,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'Morning sample recommended. Inform if taking biotin or thyroid hormone supplements.',
      turnaroundHours: 18,
      description: 'Complete 3-parameter thyroid evaluation measuring Triiodothyronine (T3), Thyroxine (T4), and TSH.',
      popular: true,
    },
    {
      name: 'Vitamin D3 (25-Hydroxy Cholecalciferol)',
      slug: 'vitamin-d3',
      categorySlug: 'vitamins',
      labPrice: 500,
      sellingPrice: 749,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No special dietary fasting required. Stay hydrated before blood collection.',
      turnaroundHours: 24,
      description: 'Essential test to detect Vitamin D deficiency affecting bone density, immune response, muscle health, and fatigue.',
      popular: true,
    },
    {
      name: 'Vitamin B12 (Cyanocobalamin)',
      slug: 'vitamin-b12',
      categorySlug: 'vitamins',
      labPrice: 500,
      sellingPrice: 749,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'Fasting is not required. Discontinue high-dose B12 supplements 48 hours prior if advised by doctor.',
      turnaroundHours: 24,
      description: 'Vital micronutrient assessment for nerve health, red blood cell formation, brain function, and energy metabolism.',
      popular: true,
    },
    {
      name: 'CBC (Complete Blood Count with 24 Parameters)',
      slug: 'cbc-complete-blood-count',
      categorySlug: 'blood-tests',
      labPrice: 200,
      sellingPrice: 329,
      sampleType: 'EDTA Whole Blood (Purple Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Suitable for all age groups at any time of day.',
      turnaroundHours: 12,
      description: 'Fundamental hematology screen measuring Hemoglobin, RBC, Total & Differential WBC, Platelets, MCV, MCH, and RDW.',
      popular: true,
    },
    {
      name: 'LFT (Liver Function Test)',
      slug: 'lft-liver-function-test',
      categorySlug: 'liver',
      labPrice: 250,
      sellingPrice: 399,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: true,
      fastingDurationHours: 8,
      preparationNotes: '8 to 10 hours overnight fasting is recommended for accurate bilirubin and hepatic enzyme measurements.',
      turnaroundHours: 18,
      description: 'Comprehensive liver screen evaluating Bilirubin (Total, Direct, Indirect), SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Total Protein, and Albumin.',
      popular: true,
    },
    {
      name: 'RFT / KFT (Renal Function / Kidney Profile)',
      slug: 'rft-renal-function-test',
      categorySlug: 'kidney',
      labPrice: 200,
      sellingPrice: 329,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: true,
      fastingDurationHours: 8,
      preparationNotes: '8 hours fasting recommended. Avoid heavy protein diet immediately before the test.',
      turnaroundHours: 18,
      description: 'Evaluates kidney filtration capacity via Serum Creatinine, Blood Urea Nitrogen (BUN), Uric Acid, and estimated GFR.',
      popular: true,
    },
    {
      name: 'Calcium (Serum Total)',
      slug: 'calcium-serum-total',
      categorySlug: 'blood-tests',
      labPrice: 100,
      sellingPrice: 179,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Stay normally hydrated.',
      turnaroundHours: 12,
      description: 'Checks ionized and protein-bound circulating calcium to assess bone integrity, neuromuscular function, and parathyroid health.',
      popular: false,
    },
    {
      name: 'PSA (Prostate Specific Antigen)',
      slug: 'psa-prostate-specific-antigen',
      categorySlug: 'hormonal',
      labPrice: 400,
      sellingPrice: 599,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'Avoid vigorous cycling or ejaculation 48 hours before sample collection as it may temporarily elevate PSA.',
      turnaroundHours: 24,
      description: 'Male health biomarker screening for prostate inflammation, benign prostatic hyperplasia (BPH), and clinical prostate evaluation.',
      popular: false,
    },
    {
      name: 'CRP Quantitative (C-Reactive Protein)',
      slug: 'crp-quantitative',
      categorySlug: 'infection',
      labPrice: 250,
      sellingPrice: 399,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required.',
      turnaroundHours: 12,
      description: 'Sensitive acute-phase inflammatory biomarker used to detect active bacterial/viral infections, autoimmune flares, and systemic inflammation.',
      popular: true,
    },
    {
      name: 'PT / INR (Prothrombin Time & International Normalized Ratio)',
      slug: 'pt-inr-prothrombin-time',
      categorySlug: 'blood-tests',
      labPrice: 200,
      sellingPrice: 329,
      sampleType: 'Sodium Citrate Plasma (Blue Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'Inform collection technician if taking anticoagulant medications like Warfarin or Acitrom.',
      turnaroundHours: 12,
      description: 'Measures blood clotting speed and extrinsic coagulation pathway function for anticoagulant drug monitoring and pre-surgery safety.',
      popular: false,
    },
    {
      name: 'HPLC (Hemoglobin Variant Analysis / Thalassemia Screen)',
      slug: 'hplc-hemoglobin-variants',
      categorySlug: 'blood-tests',
      labPrice: 600,
      sellingPrice: 899,
      sampleType: 'EDTA Whole Blood (Purple Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Blood transfusion within the past 3 months must be recorded.',
      turnaroundHours: 48,
      description: 'High-Performance Liquid Chromatography test to identify abnormal hemoglobin variants, Thalassemia carrier traits, and HbS.',
      popular: false,
    },
    {
      name: 'Electrolytes (Serum Sodium, Potassium, Chloride)',
      slug: 'electrolytes-serum',
      categorySlug: 'cardiac',
      labPrice: 300,
      sellingPrice: 449,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Vital for dehydration, heart rhythm, and fluid regulation.',
      turnaroundHours: 12,
      description: 'Measures mineral ions (Na+, K+, Cl-) vital for cellular electrical conduction, blood pressure homeostasis, and kidney balance.',
      popular: false,
    },
    {
      name: 'Urine Routine & Microscopic (Urine R/M)',
      slug: 'urine-routine-microscopic',
      categorySlug: 'urine',
      labPrice: 50,
      sellingPrice: 129,
      sampleType: 'Fresh Urine (Sterile Cup)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'First morning mid-stream clean-catch urine sample is preferred for optimal sediment evaluation.',
      turnaroundHours: 12,
      description: 'Physical, chemical, and microscopic examination of urine to detect urinary tract infections (UTI), kidney stones, proteinuria, and hematuria.',
      popular: true,
    },
    {
      name: 'Urine Culture & Sensitivity (Aerobic)',
      slug: 'urine-culture-sensitivity',
      categorySlug: 'urine',
      labPrice: 200,
      sellingPrice: 329,
      sampleType: 'Sterile Mid-Stream Urine (Sterile Container)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'Sample must be collected in the sterile container provided prior to commencing any antibiotic therapy.',
      turnaroundHours: 48,
      description: 'Bacteriological incubation to isolate specific bacterial pathogens causing UTI and determine targeted antibiotic sensitivity.',
      popular: false,
    },
    {
      name: 'Blood Grouping & Rh Factor',
      slug: 'blood-group-rh-factor',
      categorySlug: 'blood-tests',
      labPrice: 50,
      sellingPrice: 129,
      sampleType: 'EDTA Whole Blood (Purple Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required.',
      turnaroundHours: 6,
      description: 'Determines ABO blood type (A, B, AB, O) and Rh antigen (+ or -) status for medical records, driving license, and emergency preparedness.',
      popular: true,
    },
    {
      name: 'ESR (Erythrocyte Sedimentation Rate - Westergren)',
      slug: 'esr-erythrocyte-sedimentation-rate',
      categorySlug: 'blood-tests',
      labPrice: 50,
      sellingPrice: 129,
      sampleType: 'Sodium Citrate / EDTA Blood',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required.',
      turnaroundHours: 12,
      description: 'Nonspecific indicator of underlying inflammation, infection, autoimmune disorders, and tissue breakdown in the body.',
      popular: true,
    },
    {
      name: 'Widal Test (Slide & Tube Agglutination)',
      slug: 'widal-test-typhoid',
      categorySlug: 'infection',
      labPrice: 50,
      sellingPrice: 129,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required.',
      turnaroundHours: 12,
      description: 'Serological agglutination test used to detect Salmonella enterica antibodies in suspected enteric (Typhoid) fever cases.',
      popular: false,
    },
    {
      name: 'Typhoid Dot (Rapid IgM & IgG Antibody)',
      slug: 'typhoid-dot-igm-igg',
      categorySlug: 'infection',
      labPrice: 250,
      sellingPrice: 379,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Can be tested during active fever spikes.',
      turnaroundHours: 12,
      description: 'Rapid dot immunoassay detecting early IgM antibodies for prompt confirmation of acute Salmonella typhi infection.',
      popular: false,
    },
    {
      name: 'MP (Malaria Parasite - Thick & Thin Smear)',
      slug: 'mp-malaria-parasite-smear',
      categorySlug: 'infection',
      labPrice: 50,
      sellingPrice: 129,
      sampleType: 'EDTA Whole Blood (Purple Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Collection during or right after a fever chill is ideal for peak parasite visibility.',
      turnaroundHours: 12,
      description: 'Microscopic examination of Giemsa-stained blood smears to visualize Plasmodium vivax and Plasmodium falciparum parasites.',
      popular: false,
    },
    {
      name: 'MP Antigen (Malaria Rapid Diagnostic Card)',
      slug: 'mp-antigen-rapid-card',
      categorySlug: 'infection',
      labPrice: 150,
      sellingPrice: 249,
      sampleType: 'EDTA Whole Blood / Serum',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required.',
      turnaroundHours: 6,
      description: 'Rapid immunochromatographic antigen detection for Plasmodium falciparum and Plasmodium vivax species differentiation.',
      popular: false,
    },
    {
      name: 'RA Quantitative (Rheumatoid Factor)',
      slug: 'ra-quantitative-rheumatoid-factor',
      categorySlug: 'hormonal',
      labPrice: 350,
      sellingPrice: 499,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required.',
      turnaroundHours: 24,
      description: 'Measures circulating autoantibody titers to assist in the diagnosis and staging of Rheumatoid Arthritis and joint autoimmune conditions.',
      popular: false,
    },
    {
      name: 'Viral Markers (HIV 1&2, HBsAg, HCV Rapid Screen)',
      slug: 'viral-markers-screen',
      categorySlug: 'infection',
      labPrice: 600,
      sellingPrice: 899,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Confidential testing protocols strictly followed.',
      turnaroundHours: 24,
      description: 'Comprehensive screening panel for Human Immunodeficiency Virus, Hepatitis B surface antigen, and Hepatitis C virus antibodies.',
      popular: false,
    },
    {
      name: 'Trop-T (Troponin-T Quantitative / Rapid Cardiac)',
      slug: 'trop-t-cardiac-troponin',
      categorySlug: 'cardiac',
      labPrice: 900,
      sellingPrice: 1199,
      sampleType: 'Heparinized Plasma / Serum (Green / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required. Emergency biomarker for suspected acute coronary syndrome or myocardial distress.',
      turnaroundHours: 6,
      description: 'Highly sensitive myocardial marker released upon myocardial injury to assist in the evaluation of acute myocardial infarction.',
      popular: false,
    },
    {
      name: 'Trop-I (Troponin-I Quantitative)',
      slug: 'trop-i-cardiac-troponin',
      categorySlug: 'cardiac',
      labPrice: 700,
      sellingPrice: 999,
      sampleType: 'Serum (Yellow / Red Tube)',
      fastingRequired: false,
      fastingDurationHours: 0,
      preparationNotes: 'No fasting required.',
      turnaroundHours: 6,
      description: 'Cardiac-specific troponin isoform measuring structural myocardial damage with exceptional diagnostic specificity.',
      popular: false,
    },
  ];

  const testMap: Record<string, any> = {};

  for (const t of rawTests) {
    const created = await prisma.test.create({
      data: {
        name: t.name,
        slug: t.slug,
        categoryId: catMap[t.categorySlug] || catMap['other'],
        labPrice: t.labPrice,
        sellingPrice: t.sellingPrice,
        sampleType: t.sampleType,
        fastingRequired: t.fastingRequired,
        fastingDurationHours: t.fastingDurationHours,
        preparationNotes: t.preparationNotes,
        turnaroundHours: t.turnaroundHours,
        description: t.description,
        popular: t.popular,
        active: true,
      },
    });
    testMap[t.slug] = created;

    // Link test to all partner labs with lab-level availability
    for (const lab of allLabs) {
      await prisma.labTest.create({
        data: {
          labId: lab.id,
          testId: created.id,
          customLabPrice: t.labPrice,
          available: true,
        },
      });
    }
  }

  // 9. Packages (Full Body Package ₹2999 + Curated Health Packages)
  const fullBodyPkg = await prisma.healthPackage.create({
    data: {
      name: 'QuickLabz Comprehensive Full Body Health Package',
      slug: 'full-body-health-package',
      labPrice: 2500,
      sellingPrice: 2999,
      popular: true,
      active: true,
      description: 'Our premier all-in-one preventive health checkup covering 75+ vital parameters across Liver, Kidney, Heart, Diabetes, Thyroid, Bone, Blood, and Vitamins.',
      includedTestsSummary: 'CBC (24 Parameters), ESR, FBS, LFT (11 Parameters), RFT (5 Parameters), Lipid Profile (8 Parameters), Calcium, CRP Quantitative, TFT (T3, T4, TSH), Serum Electrolytes (Na, K, Cl), Iron Profile, Vitamin D3, Vitamin B12, HbA1C (Plus PSA for Men / CA125 for Women as configured).',
    },
  });

  const diabeticPkg = await prisma.healthPackage.create({
    data: {
      name: 'Advanced Diabetes & Metabolic Monitor Package',
      slug: 'diabetes-metabolic-package',
      labPrice: 650,
      sellingPrice: 899,
      popular: true,
      active: true,
      description: 'Tailored for diabetic and pre-diabetic patients to assess glycation, kidney filtration, and lipid cardiovascular health in a single home visit.',
      includedTestsSummary: 'HbA1C, Fasting Blood Sugar (FBS), Lipid Profile, Urine Routine & Microscopic, Serum Creatinine.',
    },
  });

  const heartPkg = await prisma.healthPackage.create({
    data: {
      name: 'Healthy Heart & Lipid Wellness Package',
      slug: 'healthy-heart-wellness-package',
      labPrice: 600,
      sellingPrice: 799,
      popular: false,
      active: true,
      description: 'Cardiovascular screening evaluating cholesterol ratios, acute inflammation via CRP, and cardiac electrolytes.',
      includedTestsSummary: 'Lipid Profile, CRP Quantitative, Serum Electrolytes, Blood Sugar Random (RBS).',
    },
  });

  const womenPkg = await prisma.healthPackage.create({
    data: {
      name: 'Women Wellness & Thyroid Vitality Package',
      slug: 'women-wellness-thyroid-package',
      labPrice: 1100,
      sellingPrice: 1499,
      popular: true,
      active: true,
      description: 'Specialized health checkup for women evaluating hormonal balance, bone density vitamins, and anemia status.',
      includedTestsSummary: 'Complete Blood Count (CBC), Thyroid Profile (TFT), Vitamin D3, Vitamin B12, Serum Calcium, ESR.',
    },
  });

  // Link constituent tests to packages
  if (testMap['cbc-complete-blood-count']) {
    await prisma.packageTest.create({ data: { packageId: fullBodyPkg.id, testId: testMap['cbc-complete-blood-count'].id } });
  }
  if (testMap['lipid-profile']) {
    await prisma.packageTest.create({ data: { packageId: fullBodyPkg.id, testId: testMap['lipid-profile'].id } });
  }
  if (testMap['lft-liver-function-test']) {
    await prisma.packageTest.create({ data: { packageId: fullBodyPkg.id, testId: testMap['lft-liver-function-test'].id } });
  }
  if (testMap['vitamin-d3']) {
    await prisma.packageTest.create({ data: { packageId: fullBodyPkg.id, testId: testMap['vitamin-d3'].id } });
  }
  if (testMap['vitamin-b12']) {
    await prisma.packageTest.create({ data: { packageId: fullBodyPkg.id, testId: testMap['vitamin-b12'].id } });
  }
  if (testMap['hba1c']) {
    await prisma.packageTest.create({ data: { packageId: fullBodyPkg.id, testId: testMap['hba1c'].id } });
  }

  // 10. Sample Realistic Bookings & Status Milestones
  // Booking 1: Complete with Delivered Report
  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'QLZ-2026-00001',
      userId: patientUser.id,
      patientName: 'Rohan Sharma',
      patientAge: 34,
      patientGender: 'Male',
      patientPhone: '9876543210',
      patientEmail: 'rohan.sharma@example.com',
      house: 'Flat 402, Tower 3',
      street: 'Express Green Apartments',
      area: 'Vaishali Sector 4',
      city: 'Ghaziabad',
      state: 'Delhi NCR',
      pincode: '201010',
      landmark: 'Near Mahagun Mall',
      labId: lab1.id,
      collectorId: collector1.id,
      scheduledDate: '2026-08-18',
      timeSlot: '07:00 AM - 08:00 AM',
      fastingWindow: 'Fasting 12 hours required before collection',
      totalAmount: 399,
      labBaseAmount: 250,
      grossMargin: 149,
      status: 'REPORT_DELIVERED',
      paymentStatus: 'PAID',
      referralCode: 'CLINIC001',
      referralPartnerId: ref1.id,
      referralEarned: 60,
      consentAgreed: true,
      notes: 'Please ring bell twice upon arrival.',
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking1.id,
      testId: testMap['lipid-profile']?.id,
      itemType: 'TEST',
      itemName: 'Lipid Profile',
      price: 399,
    },
  });

  await prisma.referralTransaction.create({
    data: {
      partnerId: ref1.id,
      bookingId: booking1.id,
      amount: 60,
      status: 'APPROVED',
    },
  });

  const reportFindings1 = JSON.stringify([
    { parameter: 'Total Cholesterol', value: '182', unit: 'mg/dL', normalRange: '< 200 mg/dL', status: 'Normal' },
    { parameter: 'HDL (Good Cholesterol)', value: '46', unit: 'mg/dL', normalRange: '> 40 mg/dL', status: 'Normal' },
    { parameter: 'LDL (Bad Cholesterol)', value: '108', unit: 'mg/dL', normalRange: '< 100 mg/dL', status: 'Borderline High' },
    { parameter: 'Triglycerides', value: '140', unit: 'mg/dL', normalRange: '< 150 mg/dL', status: 'Normal' },
    { parameter: 'VLDL Cholesterol', value: '28', unit: 'mg/dL', normalRange: '< 30 mg/dL', status: 'Normal' },
    { parameter: 'Cholesterol / HDL Ratio', value: '3.95', unit: 'Ratio', normalRange: '3.3 - 4.4', status: 'Normal' },
  ]);

  await prisma.report.create({
    data: {
      bookingId: booking1.id,
      testName: 'Lipid Profile Report',
      fileUrl: '/reports/QLZ-2026-00001-LipidProfile.pdf',
      findingsJson: reportFindings1,
      summary: 'Lipid parameters are largely within normal limits. Mild borderline LDL observed; balanced low-saturated-fat diet recommended.',
      isNormal: true,
      doctorName: 'Dr. Alok Verma, MD (Pathology)',
      labName: 'Apex Diagnostic Care & Pathology Lab',
      isDelivered: true,
    },
  });

  // Booking 2: In-Progress Home Collection
  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: 'QLZ-2026-00002',
      userId: patientUser.id,
      patientName: 'Sunita Sharma',
      patientAge: 58,
      patientGender: 'Female',
      patientPhone: '9876543210',
      patientEmail: 'rohan.sharma@example.com',
      house: 'Flat 402, Tower 3',
      street: 'Express Green Apartments',
      area: 'Vaishali Sector 4',
      city: 'Ghaziabad',
      state: 'Delhi NCR',
      pincode: '201010',
      landmark: 'Near Mahagun Mall',
      labId: lab1.id,
      collectorId: collector1.id,
      scheduledDate: '2026-08-20',
      timeSlot: '08:00 AM - 09:00 AM',
      fastingWindow: 'Fasting 10-12 hours required',
      totalAmount: 2999,
      labBaseAmount: 2500,
      grossMargin: 499,
      status: 'SAMPLE_RECEIVED_AT_LAB',
      paymentStatus: 'PAID',
      referralCode: 'CLINIC001',
      referralPartnerId: ref1.id,
      referralEarned: 300,
      consentAgreed: true,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking2.id,
      packageId: fullBodyPkg.id,
      itemType: 'PACKAGE',
      itemName: 'QuickLabz Comprehensive Full Body Health Package',
      price: 2999,
    },
  });

  await prisma.referralTransaction.create({
    data: {
      partnerId: ref1.id,
      bookingId: booking2.id,
      amount: 300,
      status: 'PENDING',
    },
  });

  // Booking 3: Collector Assigned / En Route
  const booking3 = await prisma.booking.create({
    data: {
      bookingNumber: 'QLZ-2026-00003',
      patientName: 'Kavita Mehta',
      patientAge: 29,
      patientGender: 'Female',
      patientPhone: '9812345678',
      patientEmail: 'kavita.m@example.com',
      house: 'House 18, Block C',
      street: 'Sector 62',
      area: 'Noida Central',
      city: 'Noida',
      state: 'Delhi NCR',
      pincode: '201309',
      landmark: 'Opposite Fortis Hospital',
      labId: lab2.id,
      collectorId: collector1.id,
      scheduledDate: '2026-08-20',
      timeSlot: '07:30 AM - 08:30 AM',
      fastingWindow: 'No fasting required',
      totalAmount: 749,
      labBaseAmount: 500,
      grossMargin: 249,
      status: 'COLLECTOR_ASSIGNED',
      paymentStatus: 'CASH_ON_COLLECTION',
      referralCode: 'MEDICAL001',
      referralPartnerId: ref2.id,
      referralEarned: 60,
      consentAgreed: true,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking3.id,
      testId: testMap['vitamin-d3']?.id,
      itemType: 'TEST',
      itemName: 'Vitamin D3 (25-Hydroxy Cholecalciferol)',
      price: 749,
    },
  });

  console.log('Database seeded successfully with all 28+ tests, partner labs, packages, phlebotomists, and sample bookings!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
