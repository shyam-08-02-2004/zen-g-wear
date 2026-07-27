import fs from 'fs';

async function scrapePexels(query) {
  try {
    const res = await fetch(`https://www.pexels.com/search/${encodeURIComponent(query)}/`);
    const html = await res.text();
    // Pexels images are like https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg
    const regex = /https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg\?auto=compress&amp;cs=tinysrgb&amp;w=\d+/g;
    const matches = html.match(regex) || [];
    
    // clean and unique
    const unique = [...new Set(matches.map(url => url.replace(/&amp;/g, '&').replace(/w=\d+/, 'w=600')))];
    return unique;
  } catch (e) {
    console.error('Error:', e.message);
    return [];
  }
}

async function test() {
  const tshirts = await scrapePexels('men plain tshirt white background');
  console.log(`Found ${tshirts.length} tshirts`);
  if (tshirts.length > 0) {
    console.log(tshirts.slice(0, 5));
  }
}

test();
