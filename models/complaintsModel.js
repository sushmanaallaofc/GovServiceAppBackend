module.exports = (sequelize, DataTypes) =>{
    const Complaint =  sequelize.define("complaint", {
        complaint_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false},
        sector: {type: DataTypes.STRING, allowNull: false },
        notes:{type: DataTypes.STRING},
        agent_id:{type: DataTypes.INTEGER},
        status:{type: DataTypes.STRING},
        complaint_address:{type: DataTypes.STRING},
        complaint_pincode:{type: DataTypes.INTEGER},
        pdfComplaint:{
            type: DataTypes.STRING
        },
    })

    return Complaint
}
