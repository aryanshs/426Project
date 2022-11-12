var express = require("express");
var app = express();
// const Web3 = require("web3");
app.use(express.static("src"));
app.use(express.static("../DrivetoPay-contracts/build/contracts"));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("index.html");
});

//businesscreate page get req
app.get("/BusinessCreate", function (req, res) {
  //alert("here");
  //res.send("you whats good");
  res.render("BusinessCreate");
});

//userpage get rep
app.get("/UserPage", function (req, res) {
  res.render("UserPage");
});

app.listen(3001, function () {
  console.log("app listening on port 3001!");
});
