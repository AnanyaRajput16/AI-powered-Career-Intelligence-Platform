const https = require('https');
https.get('https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/README.md', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    const links = [];
    for(let line of lines) {
      if(line.includes('http') && line.includes('India')) {
        let match = line.match(/href="([^"]+)"/);
        if(!match) match = line.match(/\]\(([^)]+)\)/);
        if(match) links.push({ line: line.trim(), url: match[1] });
      }
    }
    console.log(JSON.stringify(links.slice(0, 15), null, 2));
  });
});