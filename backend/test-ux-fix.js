

async function testScenarios() {
  const loginRes = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '2k23cs2313737@gmail.com', password: 'password123' }) // Need an actual password or just use register
  });
  
  if (!loginRes.ok) {
    // Register instead
    const ts = Date.now();
    const regRes = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: `test${ts}@example.com`, password: 'password123' })
    });
    var token = (await regRes.json()).token;
  } else {
    var token = (await loginRes.json()).token;
  }

  // Helper to simulate handleAnalyze
  const simulateHandleAnalyze = async (jobDescription) => {
    const res = await fetch('http://localhost:5000/api/ats/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ jobDescription })
    });
    const data = await res.json();
    const missingSkills = data.missingSkills || [];
    const courses = missingSkills.slice(0, 5).flatMap(s => [1, 2]); // Simulate 2 courses per skill
    
    return {
      matchingLength: data.matchingSkills ? data.matchingSkills.length : 0,
      missingLength: missingSkills.length,
      coursesLength: courses.length,
      missingSkills: missingSkills
    };
  };

  console.log('Testing JD with missing skills...');
  const res1 = await simulateHandleAnalyze('We are looking for a Python developer with Python, Django, REST APIs, SQL, Git and AWS skills. The candidate should have knowledge of Data Structures and experience building web applications.');
  console.log(`Matching: ${res1.matchingLength}, Missing: ${res1.missingLength}, Courses: ${res1.coursesLength}`);
  console.log(`Missing skills returned:`, res1.missingSkills);

  console.log('\nTesting JD where all skills exist (or using a user with all skills)...');
  // I will just use a JD that only contains skills the test user ALREADY has, OR if the test user is new, they have NO skills.
  // Wait, if it's a new user, they have 0 skills, so every skill is missing.
  // I need to use a JD with NO recognized skills for scenario 3.
  console.log('\nTesting JD with no recognized skills...');
  const res3 = await simulateHandleAnalyze('We are looking for someone who can bake a cake and sing very loudly.');
  console.log(`Matching: ${res3.matchingLength}, Missing: ${res3.missingLength}, Courses: ${res3.coursesLength}`);
  
}

testScenarios();
