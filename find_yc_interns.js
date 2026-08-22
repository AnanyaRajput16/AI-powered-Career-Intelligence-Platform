const https = require('https');
const companies = ['frontpage', 'peakflo', 'superkalam', 'naive', 'effigov', 'deep24', 'circleback'];
companies.forEach(company => {
  https.get(`https://www.ycombinator.com/companies/${company}/jobs`, res => {
    let data = '';
    res.on('data', d => data+=d);
    res.on('end', () => {
      const match = data.match(/href="(\/companies\/[^/]+\/jobs\/[^"]+)"/g);
      if(match) {
        match.forEach(m => {
           if(m.toLowerCase().includes('intern')) console.log(`https://www.ycombinator.com${m.replace(/href="|"/g, '')}`);
        });
      }
    });
  });
});