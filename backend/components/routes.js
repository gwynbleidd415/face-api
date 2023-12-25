const express = require("express");
const bcrypt = require("bcrypt");
const Clarifai = require("clarifai");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./database");
const passport = require("./passport");

const route = express.Router();

const clarifaiapp = new Clarifai.App({
	apiKey: "YourAPIKey",
});
const saltRounds = 7;
const cModels = {
	0: Clarifai.FACE_DETECT_MODEL,
	1: Clarifai.CELEBRITY_MODEL,
	2: Clarifai.DEMOGRAPHICS_MODEL,
};

const getUser = (uid) => {
	return new Promise((resolve, reject) => {
		db("data")
			.where("uid", "=", uid)
			.select("username", "entries")
			.then((res) => resolve(res[0]))
			.catch((err) => reject(err));
	});
};

route.get("/", async (req, res) => {
	if (req.isAuthenticated()) {
		const uData = await getUser(req.user.uid);
		// console.log(uData);
		res.status(200).json(uData);
	} else res.status(404).json("So Sorry");
});

route.post("/signin", function (req, res, next) {
	if (req.isAuthenticated()) res.status(200).json(getUser(req.user.uid));
	if (req.body.username === "" || req.body.password === "")
		res.status(401).json("noData");
	passport.authenticate("local", function (err, user, info) {
		if (err) return res.status(400).json("There was an error");
		if (!user) return res.status(401).json(info.message);
		req.logIn(user, async function (err) {
			if (err) return next(err);
			const uData = await getUser(req.user.uid);
			return res.status(200).json(uData);
		});
		// .catch((err) => {
		//   return res.status(400).json("There was an error");
		// });
	})(req, res, next);
});

route.post("/user/clarifai", (req, res) => {
	if (req.isAuthenticated()) {
		clarifaiapp.models
			.predict(cModels[req.body.api], req.body.url)
			.then(async (resp) => {
				try {
					// console.log(req.isAuthenticated());
					dbres = await db("data")
						.where("uid", "=", req.user.uid)
						.increment("entries", 1);
					// console.log(resp.outputs[0].data.regions);
					res.status(200).json(resp.outputs[0].data.regions);
				} catch (e) {
					res.status(400).json("There was some error in database");
				}
			})
			.catch((err) => {
				res.status(400).json(`Sorry there was some error = ${err}`);
			});
	}
});

route.get("/logout", (req, res) => {
	req.logout();
	res.status(200).json("success");
});

route.post("/register", (req, res) => {
	const { username, email, password } = req.body;
	let reUser, reEmail, rePass;
	reUser = /^\w{6,35}$/;
	reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!\s)(?=.{6,25})/;
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
route.post("/regcreval", (req, res) => {
	const { username, email } = req.body;
	if (username.length >= 6) {
		db.select("username")
			.from("users")
			.where("username", "=", username)
			.then((resp) => {
				if (resp.length === 0) res.json("success");
				else res.json("no");
			});
	} else if (email.length !== 0) {
		db.select("email")
			.from("users")
			.where("email", "=", email)
			.then((resp) => {
				if (resp.length === 0) res.json("success");
				else res.json("no");
			});
	}
});

module.exports = route;
