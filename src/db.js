import  Sequelize  from 'sequelize';
const options = {
    logging: true,
    dialect: "mysql",
    host: "127.0.0.1",
    pool : {
      maxConnections: 5,
      maxIdleTime: 30
    },
    port:33306
}
const dbConfig = new Sequelize("RPSDB","mysql","123",options);
export default dbConfig;