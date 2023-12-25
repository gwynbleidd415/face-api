const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const db = require("./database");

passport.use(
  new localStrategy(function (username, password, done) {
    // console.log("=====================PASS Local=====================");
    db.raw(
      `SELECT users.username, users.password, data.uid, data.entries FROM users INNER JOIN data ON users.username=data.username where users.username=?;`,
      [username]
    )
      .then((resp) => {
        resp = resp.rows;
        if (resp.length === 0) return done(null, false, { message: "noUser" });
        else {
          bcrypt.compare(password, resp[0].password).then((res) => {
            if (res) {
              return done(null, {
                uid: resp[0].uid,
                // username: resp[0].username,
                // entries: resp[0].entries,
              });
            } else {
              return done(null, false, { message: "noPass" });
            }
          });
        }
      })
      .catch((err) => res.status(400).json("Error in authentication!!!"));
  })
);

passport.serializeUser(function (user, cb) {
  // console.log("=================Serialize=================");
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  // console.log("=================Deserialize=================");
  db("data")
    .select("uid")
    .where("uid", "=", user.uid)
    .then((res) => {
      if (res.length === 0) return cb("Cant verify");
      else return cb(null, user);
    })
    .catch((err) => res.status(400).json("Error in Database Server"));
});

module.exports = passport;
