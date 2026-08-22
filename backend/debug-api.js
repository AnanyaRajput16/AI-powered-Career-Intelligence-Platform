

async function debugAPI() {
  // Login
  const loginRes = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '2k23cs2313737@gmail.com', password: 'password123' }) // assuming this works, if not we register
  });
  
  if (!loginRes.ok) {
     console.log("Login failed");
     return;
  }
  
  const token = (await loginRes.json()).token;
  
  // Analyze
  const jd = "We are looking for a Python developer with Python, Django, REST APIs, SQL, Git and AWS skills. The candidate should have knowledge of Data Structures and experience building web applications.";
  
  const res = await fetch('http://localhost:5000/api/ats/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ jobDescription: jd })
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

debugAPI();
