import sequelize from 'sequelize';
const { Model,DataTypes } = sequelize
import db from "../db.js"
class User extends Model{}
User.init({
	user_id: {
		type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    user_name: {
        type: DataTypes.STRING
    },
    join_rps_id: {
        type: DataTypes.INTEGER
    },
    current_round: {
        type: DataTypes.INTEGER
    },
    current_hand: {
        type: DataTypes.INTEGER
    },
    prev_hand: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
	
},{
	sequelize: db,
    freezeTableName: true,
    timestamps: false,
    modelName: 'users',
    scopes:{}
});

export default User;
    
    