import * as Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import db from "../db.js"
export class User extends Sequelize.Model{}
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
    scopes:{

	}
});
IndivItems.belongsTo(Locations,{foreignKey:"location_cd",as:"locations",targetKey:"location_cd"});

    
    