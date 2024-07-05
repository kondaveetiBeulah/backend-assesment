const express = require('express');
const { sequelize, Airport, City, Country } = require('./models');

const app = express();

app.get('/airport', async (req, res) => {
  const { iata_code } = req.query;

  if (!iata_code) {
    return res.status(400).send({ error: 'iata_code parameter is required' });
  }

  try {
    const airport = await Airport.findOne({
      where: { iata_code },
      include: {
        model: City,
        include: Country
      }
    });

    if (!airport) {
      return res.status(404).send({ error: 'Airport not found' });
    }

    const response = {
      airport: {
        id: airport.id,
        icao_code: airport.icao_code,
        iata_code: airport.iata_code,
        name: airport.name,
        type: airport.type,
        latitude_deg: airport.latitude_deg,
        longitude_deg: airport.longitude_deg,
        elevation_ft: airport.elevation_ft,
        address: {
          city: {
            id: airport.City.id,
            name: airport.City.name,
            country_id: airport.City.countryId,
            is_active: airport.City.is_active,
            lat: airport.City.lat,
            long: airport.City.long
          },
          country: {
            id: airport.City.Country.id,
            name: airport.City.Country.name,
            country_code_two: airport.City.Country.country_code_two,
            country_code_three: airport.City.Country.country_code_three,
            mobile_code: airport.City.Country.mobile_code,
            continent_id: airport.City.Country.continent_id
          }
        }
      }
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
});
