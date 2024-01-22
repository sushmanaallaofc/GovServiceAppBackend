const express = require('express')
const cors = require('cors')
const app = express()

const userRoutes = require('./routes/userRouter')
const complaintRoutes = require('./routes/complaintRouter')
const authRoutes = require('./routes/authRouter')
const notificationRoutes = require('./routes/notificationRouter')
const agentRoutes = require('./routes/agentRouter')
const db = require('./models')
const jwtMiddleWare = require('./middleWare/jwtMiddleWare')
const path = require('path')
//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// routes
// app.use('/api/users',jwtMiddleWare.checkLogin, userRoutes)
app.use('/auth', authRoutes)
app.use('/notification', notificationRoutes)
app.use('/complaint',complaintRoutes)
app.use('/user',userRoutes)
app.use('/agent',agentRoutes)

// static images folder
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/uploads', express.static('uploads'))

// app.use(express.static(__dirname));

// testing api
app.get('/', (req, res) => {
    res.json({ message: 'hello from api' })
    }) 


//port
const PORT = process.env.port || 5000


// Define a GET route to fetch all users
app.get('/api/usersss', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  });

//server

app.listen(PORT, () => {
    console.log(`Port running on ${PORT}`)
})


// var http = require('http');
// var formidable = require('formidable');
// var fs = require('fs');

// http.createServer(function (req, res) {
//   if (req.url == '/fileupload') {
//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
       
//       var oldpath = files.filetoupload[0].filepath;
//       console.log(files.filetoupload[0].originalFilename)
//       var newpath = 'C:/Sushma/Backend/node_express_sequelize_mysql_api/uploads/' + files.filetoupload[0].originalFilename;
//       console.log(newpath)
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         res.write('File uploaded and moved!');
//         res.end();
//       });
//  });
//   } else {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//     res.write('<input type="file" name="filetoupload"><br>');
//     res.write('<input type="submit">');
//     res.write('</form>');
//     return res.end();
//   }
// }).listen(8080);


// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'sushmanaalla@gmail.com',
//     pass: 'lniwqflpacoyfnaj'
//   }
// });

// var mailOptions = {
//   from: 'sushmanaalla@gmail.com',
//   to: 'barushivakumar2001@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'Love u Nanu!!!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


// const {Client} = require('pg')
// const client = new Client({
// host: "localhost",
// user: "postgres",
// port: 5432,
// password: "Sushma@1234",
// database: "postgres"
// })
// client.connect();
// client.query(`Select * from users`, (err, res) =>{
// if(!err){
// console.log(res.rows);
// } else {
// console.log(err.message);
// }
// client.end;
// })