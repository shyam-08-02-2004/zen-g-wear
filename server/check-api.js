import http from 'http';

http.get('http://localhost:5000/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Success:', json.success);
      console.log('Products count:', json.data ? json.data.length : 0);
    } catch (e) {
      console.log('Parse error', e);
      console.log('Raw output:', data.slice(0, 100));
    }
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
