//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt=require("bcrypt");
const date = require(__dirname + "/date.js");
const saltRounds=10;

mongoose.connect("mongodb+srv://admin-Shayantan:Test123@cluster0.fb0pm.mongodb.net/Blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



const privateSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  date: String,
  post: String
});

const private = new mongoose.model("private", privateSchema);

const publicSchema= new mongoose.Schema({
  username: String,
  content:String,
  date: String,
  title: String
});

const public = new mongoose.model("public", publicSchema);

const privateExtendedSchema= new mongoose.Schema({
  username: String,
  content:String,
  date: String,
  title:String
});

const privateExtended = new mongoose.model("privateExtended", privateExtendedSchema);

var day = date.getDateAndTime();

app.get("/", function(req,res){
  res.render("index");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/logout", function(req,res){
  res.render("logout");
});

app.get("/create", function(req,res){

 day = date.getDateAndTime();
  res.render('create',{
    day: day
  });
});

app.get("/personal", function(req,res){
  privateExtended.find({}, function(err, privates){
      res.render('personal', {
        privates: privates
       });
    });
});

app.get("/home", function(req,res){
  public.find({}, function(err, publics){
      res.render('home', {
        publics: publics
       });
    });
});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser= new private({
      username: req.body.username,
      password: hash,
      email: req.body.email,
      date: "",
      post: ""
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("login");
      }
    });
  });
});

app.post("/login", function(req,res){
  const Email=req.body.email;
  const password=req.body.password;

  private.findOne({email:Email}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result===true){
              res.redirect('/home');
          }
        });
      }
    }
  });
});

app.post("/home",function(req,res){
day = date.getDateAndTime();
  const pub = new public ({
    username: req.body.username,
    content: req.body.publicPost,
    date: day,
    title: req.body.headPublic
    });
    pub.save(function(err){
      if(!err){
        res.redirect('/home');
      }
      else{
        console.log(err);
      }
    });
});

app.post("/personal",function(req,res){
   day = date.getDateAndTime();
  const pri = new privateExtended ({
    username: req.body.username,
    content: req.body.privatePost,
    date: day,
    title: req.body.headPrivate
    });
    pri.save(function(err){
      if(!err){
        res.redirect('/personal');
      }
      else{
        console.log(err);
      }
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server has started successfully.");
});
