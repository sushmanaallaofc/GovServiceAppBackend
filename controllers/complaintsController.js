const db = require('../models')

// image Upload
const multer = require('multer')
const path =  require('path')

const fs = require('fs')

const User = db.users;
const Complaint = db.complaints;
const Agent = db.agents;
//Register Complaint
async function registerComplaint(req,res) {
       
        if (req.file === undefined) {
        
        const agents = await Agent.findAll({ where:{ agent_sector:req.body.sector }});

        console.log(agents,"check this first")

        // Handle cases with no agents or a single agent
        if (agents.length === 0) {
          return res.status(400).send({ message: "No agents available for this sector." });
        } 
        else if (agents.length === 1) {
          const agent = agents[0];

          const randomDigits = Math.random().toString().substr(2, 4); // Generate 4 random digits
          const complaint_id = `SRV${randomDigits}AB`; // Construct the ID

           let complaint = {
            complaint_id:complaint_id,
            pdfComplaint: '',
            user_id:req.body.user_id,
            sector:req.body.sector,
            complaint_address:req.body.complaint_address,
            complaint_pincode:req.body.complaint_pincode,
            notes:req.body.notes,
            agent_id:agent.agent_id,
            status:req.body.status
          };

         
          const info = await Complaint.create(complaint);
          agent.users_assigned.push(info);

          console.log(agent.users_assigned,"check this agent!!!!!!!")
          await Agent.update({users_assigned:agent.users_assigned}, { where: {agent_id: agent.agent_id }})
          
          return res.json({agentAssigned:agent.agent_id});
        }
      
        // Allocate complaints equally among multiple agents
        const leastAssignedAgent = agents.sort((a, b) => a.users_assigned.length - b.users_assigned.length)[0];
        // const complaint = new Complaint({ sector, description, agent: leastAssignedAgent._id, status: 'pending' });
        // await complaint.save();
        const randomDigits = Math.random().toString().substr(2, 4); // Generate 4 random digits
        const complaint_id = `SRV${randomDigits}AB`; // Construct the ID

        let complaintData = {
          complaint_id:complaint_id,
          pdfComplaint: '',
          user_id:req.body.user_id,
          sector:req.body.sector,
          complaint_address:req.body.complaint_address,
          complaint_pincode:req.body.complaint_pincode,
          notes:req.body.notes,
          agent_id:leastAssignedAgent.agent_id,
          status:'pending'
        };
       
        const complaint = await Complaint.create(complaintData);
      
        // Update the agent's complaint count
        leastAssignedAgent.users_assigned.push(complaint);
        await Agent.update({users_assigned:leastAssignedAgent.users_assigned}, { where: {agent_id: leastAssignedAgent.agent_id }})
          
        return res.json({agentAssigned:leastAssignedAgent.agent_id});
        
        } else {
         
          const agents = await Agent.findAll({ where:{ agent_sector:req.body.sector }});

          console.log(agents,"check this first")
  
          // Handle cases with no agents or a single agent
          if (agents.length === 0) {
            return res.status(400).send({ message: "No agents available for this sector." });
          } 
          else if (agents.length === 1) {
            const agent = agents[0];
            const randomDigits = Math.random().toString().substr(2, 4); // Generate 4 random digits
            const complaint_id = `SRV${randomDigits}AB`; // Construct the ID
  
             let complaint = {
              complaint_id:complaint_id,
              pdfComplaint: req.file.path,
              user_id:req.body.user_id,
              sector:req.body.sector,
              complaint_address:req.body.complaint_address,
              complaint_pincode:req.body.complaint_pincode,
              notes:req.body.notes,
              agent_id:agent.agent_id,
              status:req.body.status
            };
  
            
            const info = await Complaint.create(complaint);
            agent.users_assigned.push(info);
  
            console.log(agent.users_assigned,"check this agent!!!!!!!")
            let agentAssigned = await Agent.update({users_assigned:agent.users_assigned}, { where: {agent_id: agent.agent_id }})
            
            return res.json({agentAssigned:agent.agent_id});
          }
        
          // Allocate complaints equally among multiple agents
          const leastAssignedAgent = agents.sort((a, b) => a.users_assigned.length - b.users_assigned.length)[0];
          // const complaint = new Complaint({ sector, description, agent: leastAssignedAgent._id, status: 'pending' });
          // await complaint.save();
          const randomDigits = Math.random().toString().substr(2, 4); // Generate 4 random digits
          const complaint_id = `SRV${randomDigits}AB`; // Construct the ID

          let complaintData = {
            complaint_id:complaint_id,
            pdfComplaint: req.file.path,
            user_id:req.body.user_id,
            sector:req.body.sector,
            complaint_address:req.body.complaint_address,
            complaint_pincode:req.body.complaint_pincode,
            notes:req.body.notes,
            agent_id:leastAssignedAgent.agent_id,
            status:'pending'
          };
          
          const complaint = await Complaint.create(complaintData);
        
          // Update the agent's complaint count
          leastAssignedAgent.users_assigned.push(complaint);
          let agentAssigned = await Agent.update({users_assigned:leastAssignedAgent.users_assigned}, { where: {agent_id: leastAssignedAgent.agent_id }})
            
          return res.json({agentAssigned:leastAssignedAgent.agent_id});
        
        }   
  }

// Get All Complaints
async function getAllComplaints(req,res) {
    let complaints = await Complaint.findAll()
    res.status(200).json({complaints})
}


// Upload Images

const storage=multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/',(err)=>{
           cb(null, './uploads/');
        });
      },
      filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname));
      }
})


const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000'},
   
}).single('pdfComplaint')

module.exports = {
    registerComplaint,
    getAllComplaints,
    upload
}