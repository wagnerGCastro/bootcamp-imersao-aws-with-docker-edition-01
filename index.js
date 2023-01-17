var express = require("express");
var logger = require("morgan");
var path = require("path");
var session = require("express-session");
var methodOverride = require("method-override");

var app = express();

// define a custom res.message() method
// which stores messages in the session
app.response.message = function (msg) {
  // reference `req.session` via the `this.req` reference
  var sess = this.req.session;
  // simply add the msg to an array for later
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};

// log
app.use(logger("dev"));

// serve static files
app.use(express.static(path.join(__dirname, "app", "public")));
app.use(express.static(path.join(__dirname, "client", "build")));

// session support
app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "some secret here",
  })
);

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }));

// allow overriding methods in query (?_method=put)
app.use(methodOverride("_method"));

// expose the "messages" local variable when views are rendered
app.use(function (req, res, next) {
  var msgs = req.session.messages || [];

  // expose "messages" local variable
  res.locals.messages = msgs;

  // expose "hasMessages"
  res.locals.hasMessages = !!msgs.length;

  /* This is equivalent:
    res.locals({
      messages: msgs,
      hasMessages: !! msgs.length
    });
   */

  next();
  // empty or "flush" the messages so they
  // don't build up
  req.session.messages = [];
});

// load controllers
require("./lib/boot")(app, { verbose: false });

app.use(function (err, req, res, next) {
  // log it
  console.error(err.stack);

  // error page
  res.status(500).render("5xx");
});

// assume 404 since no middleware responded
app.use(function (req, res, next) {
  res.status(404).render("404", { url: req.originalUrl });
});

app.listen(3000);
console.log("Express started on port 3000");
