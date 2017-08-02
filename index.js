const express = require("express");
const mustacheExpress = require("mustache-express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");

const users = {
  jonathanSchultz: "password",
  benjaminSchultz: "ke3om",
  josephSchultz: "porkafuco74"
};

// defines app as a constant assigned to express()
const app = express();

// necessary to link styles.css which lives in the public folder
app.use(express.static("public"));

// this will attach the bodyParser to the pipeline and attach
// the data to the req as JSON
app.use(bodyParser.json());
// this will take the url encoded data and
//only accept the primitive types of data (strings, numbers, NOT arrays, NOT objects)
app.use(bodyParser.urlencoded({ extended: false }));

// these three lines are necessary for mustache-express to work
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(
  expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

const authenticate = (request, response, next) => {
  if (users[request.body.username] === request.body.password) {
    next();
  } else {
    response.redirect("/login");
  }
};

// Define a home page
app.get("/", function(request, response) {
  response.render("main");
});

// Define a login page
app.get("/login", function(request, response) {
  response.render("login");
});

app.use(authenticate);
app.post("/login", function(request, response) {
  request.session.username = request.body.username;

  response.redirect("/welcome");
});

// When a valid username/password pair is entered, the page is redirected to /welcome
app.get("/welcome", function(request, response) {
  response.render("welcome", { username: request.session.username });
});

// Instructs index.js to listen to web page in the browser on localport 3000
app.listen(3000, function() {
  console.log("Successfully accessed login session program on port 3000!");
});
