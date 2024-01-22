const db = require('../models')

// create main Model
const User = db.users
const Agent = db.agents

// Hash Password
var bcrypt = require('bcryptjs');
var salt =  bcrypt.genSaltSync(10);

// JWT Token
const jwt = require('jsonwebtoken');
var jwtSEC = 'ajflbsilfjmerfuuwrngwnrguywrghwgenrgojhrbgvwrgyrgurgfrfghuorigyh'
const Session =  db.sessions

// Nodemailer
const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // E.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'sushmanaalla@gmail.com',
    pass: 'lniwqflpacoyfnaj',
  },
});
// pass need to be generated for apps visit below link and follow
// https://support.google.com/accounts/answer/185833?visit_id=638294451618333600-1143280379&p=InvalidSecondFactor&rd=1


function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

const sendForgotPasswordEmail = (userEmail, otp) => {
  const mailOptions = {
    from: 'your-email@example.com',
    to: userEmail,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// SignUp User
const singUp = async (req, res) => {
  try {
    let { email, password, Cpassword, full_name, aadhar_number, mobile, user_type_id } = req.body;

    if (password !== Cpassword) {
      return res.status(400).send({ message: "Password not match." });
    }

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if the user already exists
    const isAvailable = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (isAvailable) {
      return res.status(400).send({ message: "User already exists." });
    }

    // Generate notification_id based on Admin+user_id
    const user = await User.create({
      email: email.toLowerCase(),
      password: passwordHash,
      full_name: full_name,
      aadhar_number: aadhar_number,
      mobile: mobile,
      user_type_id: user_type_id,
    });

    // Update the user with the generated notification_id
    if(user_type_id === 1){
      const notification_id = `Admin1`;
    await user.update({ notification_id });

    return res.status(200).json({ message: "User created successfully." });
    }
    else if(user_type_id === 2){
      const notification_id = `User${user.user_id}`;
    await user.update({ notification_id });

    return res.status(200).json({ message: "User created successfully." });
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// User Login
const login = async (req,res) => {
    let { email, password }= req.body;
    // check user exist for this email in the database.
    const isAvailable = await User.findOne({
    where: {
    email: email.toLowerCase()
    }
    });
      // Agent Login Check
  const isAvailableAgent = await Agent.findOne({
    where: {
    email: email.toLowerCase()
    }
    });


  //   // Provider Login
    
  //   const isAvailableProvider = await Provider.findOne({
  //     where: {
  //     email: email.toLowerCase()
  //     }
  //     });
    // if (!isAvailable || !isAvailableAgent) {
    // res.status (400).send({ message: "User not exist." })
    // }
    // check password.
    
      if(isAvailable){
console.log("user")
       let passMatch = await bcrypt.compare(password, isAvailable.password);
   
       if (!passMatch) return res.status(400).send({ message: "Password is incorrect." });
      
       // generate JWTToken
       let token = jwt.sign({...isAvailable},jwtSEC, { expiresIn: '365d'})
       
       await Session.create({
           userId:isAvailable.user_id,
           jwt:token,
           status:"Valid"
       })
        const data = {
           first_name: isAvailable.first_name,
           last_name: isAvailable.last_name,
           full_name: isAvailable.full_name,
           mobile: isAvailable.mobile,
           is_profile: isAvailable.is_profile,
           user_type_id: isAvailable.user_type_id,
           user_id: isAvailable.user_id,
           notification_id: isAvailable.notification_id
        }
        return res.status(200).send({token: token ,data:  data,
          message: 'User Successfully Loggedin.' })
     }
    
else if(isAvailableAgent){
  console.log("Agent")
  let passMatchAgent = await bcrypt.compare(password, isAvailableAgent.password);
  
  if (!passMatchAgent) return res.status(400).send({ message: "Password is incorrect." });
 
  // generate JWTToken
  const tokenAgent = jwt.sign({...isAvailableAgent},jwtSEC, { expiresIn: '365d'})
  
  await Session.create({
      userId:isAvailableAgent.agent_id,
      jwt:tokenAgent,
      status:"Valid"
  })
   const dataAgent = {
      full_name: isAvailableAgent.full_name,
      mobile: isAvailableAgent.mobile,
      user_type_id: isAvailableAgent.user_type_id,
      agent_id: isAvailableAgent.agent_id,
      agent_sector:isAvailableAgent.agent_sector
   }
   return res.status(200).send({token:tokenAgent,data:dataAgent,
    message: 'Agent Successfully Loggedin.' })
}

// else if(isAvailableProvider){
//   console.log("Provider")
//   let passMatchProvider = await bcrypt.compare(password, isAvailableProvider.password);
  
//   if (!passMatchProvider) return res.status(400).send({ message: "Password is incorrect." });
 
//   // generate JWTToken
//   const tokenProvider = jwt.sign({...isAvailableProvider},jwtSEC, { expiresIn: '365d'})
  
//   await Session.create({
//       userId:isAvailableProvider.provider_id,
//       jwt:tokenProvider,
//       status:"Valid"
//   })
//    const dataProvider = {
//       first_name: isAvailableProvider.first_name,
//       last_name: isAvailableProvider.last_name,
//       full_name: isAvailableProvider.full_name,
//       mobile: isAvailableProvider.mobile,
//       user_type_id: isAvailableProvider.user_type_id,
//       provider_id: isAvailableProvider.provider_id
//    }
//    return res.status(200).send({token:tokenProvider,data:dataProvider,
//     message: 'Provider Successfully Loggedin.' })
// }

// || !isAvailableAgent || !isAvailableProvider
else if(!isAvailable || !isAvailableAgent){
       res.status (400).send({ message: "User not exist." })
}

    // check password.
}

// Forgot Password
const ForgotPassword = async (req, res) => {
  const userEmail = req.body.email;
  const otp = generateOTP();
  let user = await User.findOne({
    where: { email: userEmail.toLowerCase() }
    });
    let agent = await Agent.findOne({
      where: { email: userEmail.toLowerCase() }
      });
 
    console.log(user)
if(user){
      user.otp = otp;
      user.otpExpiration = new Date();
      user.save();

  sendForgotPasswordEmail(userEmail.toLowerCase(), otp);

  res.json({user:user, message: 'Password reset OTP sent to your email.' });

}

if(agent){
  agent.otp = otp;
  agent.otpExpiration = new Date();
  agent.save();

sendForgotPasswordEmail(userEmail.toLowerCase(), otp);

res.json({agent:agent, message: 'Password reset OTP sent to your email.' });

}


};


// Verify Email-OTP
const verifyEmailOTP = async (req, res) => {
  const { email, otp, password,Cpassword } = req.body;
console.log(email, otp, password,Cpassword)
  let user = await User.findOne({
    where: { email: email.toLowerCase() }
    });


    let agent = await Agent.findOne({
      where: { email: email.toLowerCase() }
      });
  
    // Check if the OTP matches and if it's not expired
    // console.log(user,"userrrrrrrrrrrrrrrrrrr")
    if(user){
    if (user.otp === otp && user.otpExpiration <= new Date()) {
      console.log(user.otp,"oypppppppppp")
      // OTP is valid, you can allow the user to reset their password here
      if (password !== Cpassword) res.status (400).send({ message: "Password not match."})

      //encrypt the password
      var passwordHash = bcrypt.hashSync(password, salt);

      user.password = passwordHash;
      user.otp = null;
      user.otpExpiration = null;
      user.save();

      return res.json({ message: 'OTP is valid.' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
    }}

    if(agent){
      if (agent.otp === otp && agent.otpExpiration <= new Date()) {
        console.log(agent.otp,"oypppppppppp")
        // OTP is valid, you can allow the agent to reset their password here
        if (password !== Cpassword) res.status (400).send({ message: "Password not match."})
  
        //encrypt the password
        var passwordHash = bcrypt.hashSync(password, salt);
  
        agent.password = passwordHash;
        agent.otp = null;
        agent.otpExpiration = null;
        agent.save();
  
        return res.json({ message: 'OTP is valid.' });
      } else {
        return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
      }}



};





module.exports = {
    singUp,
    login,
    ForgotPassword,
    verifyEmailOTP
}