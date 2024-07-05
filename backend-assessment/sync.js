const { sequelize, Country, City, Airport } = require('./models');
const xlsx = require('xlsx');

async function loadSpreadsheetData() {
  const workbook = xlsx.readFile('./data/spreadsheet.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  for (const row of rows) {
    const country = await Country.create({
      name: row.country_name,
      country_code_two: row.country_code_two,
      country_code_three: row.country_code_three,
      mobile_code: row.mobile_code,
      continent_id: row.continent_id
    });

    const city = await City.create({
      name: row.city_name,
      countryId: country.id,
      is_active: row.city_is_active,
      lat: row.city_lat,
      long: row.city_long
    });

    await Airport.create({
      icao_code: row.icao_code,
      iata_code: row.iata_code,
      name: row.airport_name,
      type: row.airport_type,
      latitude_deg: row.latitude_deg,
      longitude_deg: row.longitude_deg,
      elevation_ft: row.elevation_ft,
      cityId: city.id
    });
  }
}

sequelize.sync({ force: true }).then(async () => {
  console.log('Database & tables created!');
  await loadSpreadsheetData();
  console.log('Spreadsheet data loaded!');
  process.exit();
}).catch(error => {
  console.error('Error syncing database:', error);
});
