//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, result) {
    if(!err) {
      res.render("home", {
        posts: result
        });
    }
  })
  
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:postID", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.findOne({_id: req.params.postID}, function(err, foundPost) {
    if(!err) {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
    }
  });

});

app.get("/posted", function(req, res) {
  res.render("posted");
})

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if(!err) {
      res.redirect("/posted");
    }
  });
});

app.post("/", function(req, res) {
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
