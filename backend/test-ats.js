async function test() {
  try {
    const ts = Date.now();
    const regRes = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${ts}@example.com`,
        password: 'password123'
      })
    });
    
    if (!regRes.ok) {
        throw new Error('Register failed: ' + await regRes.text());
    }
    const regData = await regRes.json();
    const token = regData.token;
    console.log('Registration successful, token obtained.');

    const analyzeRes = await fetch('http://localhost:5000/api/ats/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        jobDescription: 'We are looking for a Python developer with Python, Django, REST APIs, SQL, Git and AWS skills. The candidate should have knowledge of data structures and experience building web applications.'
      })
    });
    
    const text = await analyzeRes.text();
    console.log(`ATS Analyze Status: ${analyzeRes.status}`);
    
    try {
        console.log(JSON.parse(text));
    } catch(e) {
        console.log(text);
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
