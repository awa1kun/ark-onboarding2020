import sequelize from 'sequelize';
const { Model,DataTypes } = sequelize
import db from "../db.js"
class Rps extends Model{}
Rps.init({
	rps_id: {
		type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    title: {
        type: DataTypes.STRING
    },
    host_user_id: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    round: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
},{
	sequelize: db,
    freezeTableName: true,
    timestamps: false,
    modelName: 'rpses'
});
export default Rps;
