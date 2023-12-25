const express = require("express");
const bodyParser = require("body-parser");
const knex = require("knex");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Clarifai = require("clarifai");

const clarifaiapp = new Clarifai.App({
  apiKey: "YourAPIKey",
});

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "USER",
    password: "PASSWORD",
    database: "ClarifaiAPI",
  },
});
const saltRounds = 7;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "SECRET",
    resave: false,
    // unset: "destroy",
    saveUninitialized: false,
    // rolling: true,
    cookie: {
      // domain: "http://localhost:3000",
      // secure: false,
      // httpOnly: true,
      sameSite: "none",
      maxAge: 1800 * 1000,
      // expires: new Date(Date.now + 3600000),
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new localStrategy(function (username, password, done) {
    db.raw(
      `SELECT users.username, users.password, data.uid, data.entries FROM users INNER JOIN data ON users.username=data.username where users.username=?;`,
      [username]
    ).then((resp) => {
      resp = resp.rows;
      // console.log(resp);
      if (resp.length === 0) return done(null, false, { message: "noUser" });
      else {
        bcrypt.compare(password, resp[0].password).then((res) => {
          if (res) {
            // console.log("bcryptsuc");
            return done(null, {
              uid: resp[0].uid,
              username: resp[0].username,
              entries: resp[0].entries,
            });
          } else {
            // console.log("bcryptpassnot");
            return done(null, false, { message: "noPass" });
          }
        });
      }
      // User.findOne({ username: username }, function (err, user) {
      //   if (err) {
      //     return done(err);
      //   }
      //   if (!user) {
      //     return done(null, false, { message: "Incorrect username." });
      //   }
      //   if (!user.validPassword(password)) {
      //     return done(null, false, { message: "Incorrect password." });
      //   }
      //   return done(null, user);
      // });
    });
  })
);

passport.serializeUser(function (user, cb) {
  console.log("Serializeuser==>", user);
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  // console.log("Deserialize");
  db("data")
    .select("uid")
    .where("uid", "=", user.uid)
    .then((res) => {
      // console.log("deserialize", res);
      if (res.length === 0) return cb("Cant verify");
      else return cb(null, user);
    })
    .catch((err) => res.status(400).send("Error"));
  // db.users.findById(id, function (err, user) {
  //   if (err) {
  //     return cb(err);
  //   }
  //   cb(null, user);
  // });
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    // console.log("get.req.user=====>", req.user);
    res
      .status(200)
      .json({ username: req.user.username, entries: req.user.entries });
  } else res.status(404).json("So Sorry");
});

// app.post("/signin", passport.authenticate("local"), (req, res) => {
//   console.log(req.user);
//   //console.log("<==========Res========>\n", res);
// });

app.post("/signin", function (req, res, next) {
  console.log("Inside server login");
  if (req.isAuthenticated())
    res
      .status(200)
      .json({ username: req.user.username, entries: req.user.entries });
  if (req.body.username === "" || req.body.password === "")
    res.status(401).json("noData");
  passport.authenticate("local", function (err, user, info) {
    if (err) return res.status(400).json("There was an error");
    if (!user) return res.status(401).json(info.message);
    req
      .logIn(user, function (err) {
        if (err) return next(err);
        // console.log(req.user);
        return res
          .status(200)
          .json({ username: req.user.username, entries: req.user.entries });
      })
      .then((err) => {
        return res.status(400).json("There was an error");
      });
  })(req, res, next);
});

app.post("/user/countface", (req, res) => {
  clarifaiapp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.url)
    // .then((resp) => resp.json())
    .then(async (resp) => {
      try {
        dbres = await db("data")
          .where("uid", "=", req.user.uid)
          .increment("entries", 1)
          .returning("entries");
        req.user.entries = dbres[0];
        res.status(200).json(resp);
      } catch (e) {
        res.status(400).json("There was some error in database");
      }
    })
    .catch((err) => {
      // console.log("clarifai", err);
      res.status(400).json(`Sorry there was some error = ${err}`);
    });
});

app.get("/logout", (req, res) => {
  // console.log("Server logout===========>", req.user);
  // console.log(req.session);
  req.logout();
  // console.log(req.session);
  res.status(200).json("success");
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  // console.log(req.body);
  let reUser, reEmail, rePass;
  reUser = /^\w{6,35}$/;
  reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  rePass = /^(?=.*[a-z])(?=.*[A-z])(?=.*[0-9])(?!\s)(?=.{6,25})/;
  let reErrors = [];
  if (!reUser.test(username))
    reErrors.push(
      "The username must contain only alphanumeric characters and of length 6-35"
    );
  if (!reEmail.test(email)) reErrors.push("Please enter valid email.");
  if (!rePass.test(password))
    reErrors.push(
      "Password must have atleast one uppercase, lowercase and digit character and length must be between 6-25"
    );
  if (reErrors.length === 0) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) res.send(err);
      else
        db.transaction((trx) => {
          trx
            .insert({
              email: email,
              password: hash,
              username: username,
            })
            .into("users")
            .returning("username")
            .then((user) => {
              return trx("data")
                .returning("uid")
                .insert({ username: user[0] })
                .then((resp) => res.json("success"));
            })
            .then(trx.commit)
            .catch(trx.rollback);
        }).catch((err) => res.send(err));
    });
  } else res.status(400).json(reErrors);
});
app.post("/regcreval", (req, res) => {
  // console.log(req.body.username);
  const { username, email } = req.body;
  if (username.length >= 6) {
    // db("users")
    //   .join("data", "users.username", "=", "data.username")
    //   .select("users.username", "users.password", "data.uid")
    //   //.where("username", "=", username)
    //   .then(console.log);

    // db.raw(
    //   `SELECT users.username, users.password, data.uid FROM users INNER JOIN data ON users.username=data.username where users.username=?;`,
    //   [username]
    // ).then((res) => console.log(res.rows[0]));

    db.select("username")
      .from("users")
      .where("username", "=", username)
      .then((resp) => {
        // console.log(resp);
        if (resp.length === 0) res.json("success");
        else res.json("no");
      });
  } else if (email.length !== 0) {
    db.select("email")
      .from("users")
      .where("email", "=", email)
      .then((resp) => {
        // console.log(resp);
        if (resp.length === 0) res.json("success");
        else res.json("no");
      });
  }
});

app.listen(3001, () => {
  // db.select("username")
  //   .from("users")
  //   .where("username", "=", "mankubhau")
  //   .then(console.log);
  console.log("server started on port 3001");
});
