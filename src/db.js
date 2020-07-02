import  Sequelize  from 'sequelize';
const options = {
    logging: true,
    dialect: "mysql",
    host: "db",
    pool : {
      maxConnections: 5,
      maxIdleTime: 30
    },
    port:3306
}
const dbConfig = new Sequelize("RPSDB","mysql","123",options);
export default dbConfig;