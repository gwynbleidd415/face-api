/*=====================Import Packages from npm=====================*/
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const knexStore = require("connect-session-knex")(session);

/*=====================Import local packages=====================*/
const db = require("./components/database");
const passport = require("./components/passport");
const routes = require("./components/routes");

/*=====================app and uses=====================*/
const app = express();
app.use(express.static("public"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*=====================SESSION and Passport integration=====================*/

const sesstore = new knexStore({
  knex: db,
  // tablename: "sessions",
  createtable: true,
  clearInterval: 30000,
});

app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      maxAge: 9000 * 1000,
    },
    store: sesstore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);
/*=====================Listening to port=====================*/
app.listen(3001, () => {
  console.log("server started on port 3001");
});
