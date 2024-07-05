// download.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const url = 'C:\Users\ramba\OneDrive\Documents'; // Replace with the actual link

async function downloadFile() {
  const filePath = path.resolve(__dirname, 'data', 'spreadsheet.xlsx');
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

downloadFile().then(() => {
  console.log('Spreadsheet downloaded successfully');
}).catch(error => {
  console.error('Error downloading the spreadsheet:', error);
});
