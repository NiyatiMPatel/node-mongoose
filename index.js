import * as dotenv from "dotenv";

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from "mongoose";

import rootDir from './util/path';

import User from "./models/user.model";

import { get404 } from "./controllers/errors.controller";

import AdminRoute from './routes/admin.router'
import CustomerRoute from './routes/customer.router'

// =================================================== //
dotenv.config();

const app = express();

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// =================================================== //

// SERVING FILES STATICALLY FOR STATIC FILES ONLY HAS READ ACCESS
app.use(express.static(path.join(rootDir, 'public')))

// =================================================== //

// TEMPLATING ENGINE EJS FOR VIEWS
app.set('view engine', 'ejs');
app.set('views', 'views');

// ==================================================== //
// USER ASSOCIATION WITH EVERY REQUEST MIDDLEWARE
app.use((req, res, next) => {
 User.findById("64f76fe73893640698d5b1a1").then((user) => {
  // console.log("file: index.js:42 ~ User.findById ~ user:", user);
  req.user = user; // MONGOOSE PROVIDES ACCESS TO USER OBJECT AS WELL AS METHODS AVAILABLE ON USER OBJECT
  next();
 }).catch((error) => {
  console.log("file: index.js:45 ~ User.findById ~ error:", error);
 })
})

// ==================================================== //
// ROUTES
app.use(CustomerRoute);
app.use('/admin', AdminRoute);
// CATCH ALL ROUTES (404 ERROR)
app.use(get404);

// ================================================ //
// INITIAL CHECK
// app.listen(process.env.PORT, () => {
//  return console.log("🚀 ~ file: index.js:9 ~ App listening on port:", process.env.PORT)
// })
// app.get('/', (req, res) => res.send('Hello World!'))

// ================================================ //

// MONGODB CONNECTION USING MONGOOSE
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB}`).then((result) => {
 // console.log("file: index.js:50 ~ mongoose.connect ~ Connected:", process.env.DB);
 // console.log("file: index.js:51 ~ mongoose.connect ~ result:", result);

 // CREATE DUMMY USER
 User.findOne().then((user) => {
  // console.log("file: index.js:61 ~ User.findOne ~ user:", user);
  if (!user) {
   const user = new User({
    name: "Mohan",
    email: "mohan@test.com",
    cart: {
     items: [],
    }
   });
   user.save();
  }
 });
 app.listen(process.env.PORT)
}).catch((error) => {
 console.log("file: index.js:46 ~ mongoose.connect ~ error:", error);
})
