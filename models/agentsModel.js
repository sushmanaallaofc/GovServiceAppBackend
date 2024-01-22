module.exports = (sequelize, DataTypes) =>{
    const Agent =  sequelize.define("agent", {
        agent_id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        notification_id: { type: DataTypes.STRING},
        user_type_id: { type: DataTypes.INTEGER, allowNull: false},
        email: {type: DataTypes.STRING, allowNull: false,unique: true },
        full_name: {type: DataTypes.STRING,allowNull: false },
        mobile: { type: DataTypes.BIGINT(11), allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        users_assigned: { type: DataTypes.ARRAY(DataTypes.JSON),defaultValue: []},
        agent_sector: { type: DataTypes.STRING, allowNull: false },
        otp: { type: DataTypes.STRING},
        otpExpiration: {type: DataTypes.DATE},
        aadhar_number: { type: DataTypes.STRING, allowNull: false },
    })
    return Agent
}