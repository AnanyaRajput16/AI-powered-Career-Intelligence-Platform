const https = require('https');
https.get('https://hacker-news.firebaseio.com/v0/jobstories.json', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const ids = JSON.parse(data);
    let count = 0;
    ids.forEach(id => {
      https.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => {
          const item = JSON.parse(d);
          if (item && item.title && item.url && item.title.toLowerCase().includes('intern')) {
            console.log(item.title, '||', item.url);
          }
        });
      });
    });
  });
});