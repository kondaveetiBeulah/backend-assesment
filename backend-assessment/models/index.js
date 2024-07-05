const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Country = sequelize.define('Country', {
  name: { type: DataTypes.STRING, allowNull: false },
  country_code_two: { type: DataTypes.STRING, allowNull: false },
  country_code_three: { type: DataTypes.STRING, allowNull: false },
  mobile_code: { type: DataTypes.INTEGER, allowNull: false },
  continent_id: { type: DataTypes.INTEGER, allowNull: false }
});

const City = sequelize.define('City', {
  name: { type: DataTypes.STRING, allowNull: false },
  countryId: { type: DataTypes.INTEGER, references: { model: Country, key: 'id' } },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  long: { type: DataTypes.FLOAT, allowNull: false }
});

const Airport = sequelize.define('Airport', {
  icao_code: { type: DataTypes.STRING, allowNull: false },
  iata_code: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  latitude_deg: { type: DataTypes.FLOAT, allowNull: false },
  longitude_deg: { type: DataTypes.FLOAT, allowNull: false },
  elevation_ft: { type: DataTypes.INTEGER, allowNull: false },
  cityId: { type: DataTypes.INTEGER, references: { model: City, key: 'id' } }
});

Country.hasMany(City, { foreignKey: 'countryId' });
City.belongsTo(Country, { foreignKey: 'countryId' });
City.hasMany(Airport, { foreignKey: 'cityId' });
Airport.belongsTo(City, { foreignKey: 'cityId' });

module.exports = { sequelize, Country, City, Airport };
