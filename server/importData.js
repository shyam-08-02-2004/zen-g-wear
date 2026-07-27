import fs from 'fs';

async function importDb() {
  console.log('Reading db_export.json...');
  const data = JSON.parse(fs.readFileSync('db_export.json', 'utf8'));
  
  console.log('Sending data to Vercel...');
  try {
    const response = await fetch('https://server-sage-chi.vercel.app/api/import-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log('Result:', result);
  } catch (err) {
    console.error('Error importing:', err.message);
  }
}

importDb();
