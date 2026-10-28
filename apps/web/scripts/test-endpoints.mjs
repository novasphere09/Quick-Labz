async function testAll() {
  const endpoints = [
    'http://localhost:3000/',
    'http://localhost:3000/tests',
    'http://localhost:3000/tests/lipid-profile',
    'http://localhost:3000/packages',
    'http://localhost:3000/labs',
    'http://localhost:3000/how-it-works',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
    'http://localhost:3000/privacy',
    'http://localhost:3000/terms',
    'http://localhost:3000/refund',
    'http://localhost:3000/disclaimer',
    'http://localhost:3000/book',
    'http://localhost:3000/dashboard',
    'http://localhost:3000/admin',
    'http://localhost:3000/lab-portal',
    'http://localhost:3000/collector-portal',
    'http://localhost:3000/track/QLZ-2026-00001',
    'http://localhost:3000/reports/QLZ-2026-00001',
    'http://localhost:3000/api/tests',
    'http://localhost:3000/api/labs',
    'http://localhost:3000/api/packages',
  ];

  console.log('--- QuickLabz Automated Endpoints Verification ---');
  let passed = 0;

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`[PASS ${res.status}] ${url}`);
        passed++;
      } else {
        console.error(`[FAIL ${res.status}] ${url}`);
      }
    } catch (e) {
      console.error(`[ERR] ${url} -> ${e.message}`);
    }
  }

  console.log(`\nTest Summary: ${passed} / ${endpoints.length} endpoints passed!`);

  // Test Referral Validation API
  console.log('\n--- Testing Referral Code Validation API ---');
  try {
    const refRes = await fetch('http://localhost:3000/api/referrals/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'CLINIC001', amount: 399, isPackage: false }),
    });
    const refData = await refRes.json();
    console.log('Referral Response for CLINIC001:', refData);
  } catch (e) {
    console.error('Referral validation test error:', e);
  }

  // Test Booking Creation API
  console.log('\n--- Testing Booking Creation API ---');
  try {
    const bookRes = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'Automated Test Patient',
        patientAge: 40,
        patientGender: 'Female',
        patientPhone: '9811122233',
        patientEmail: 'test@quicklabz.com',
        house: 'A-102',
        street: 'Main Road',
        area: 'Indirapuram',
        city: 'Delhi NCR',
        state: 'Delhi NCR',
        pincode: '201014',
        scheduledDate: '2026-08-21',
        timeSlot: '07:00 AM - 08:00 AM',
        totalAmount: 399,
        itemName: 'Lipid Profile',
      }),
    });
    const bookData = await bookRes.json();
    console.log('Booking Creation Response:', bookData);
  } catch (e) {
    console.error('Booking API test error:', e);
  }
}

testAll();
