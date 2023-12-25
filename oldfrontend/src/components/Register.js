import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      invalidUser: true,
      invalidPass: true,
      invalidEmail: true,
    };
  }

  usernameChange = (event) => {
    if (
      (event.target.value.length && event.target.value.length < 6) ||
      event.target.value.length > 35
    ) {
      document.getElementById("userNameChange").innerText =
        "***UserName must be 6-35 characters long";
      this.setState({ invalidUser: true });
    } else if (event.target.value.length >= 6) {
      const reUser = /^\w{6,35}$/;
      if (!reUser.test(event.target.value)) {
        document.getElementById("userNameChange").innerText =
          "Username can only contain alphanumeric characters and underscore";
        this.setState({ invalidUser: true });
      } else {
        document.getElementById("userNameChange").innerText = "";
        this.setState({ invalidUser: false, username: event.target.value });
      }
    } else {
      document.getElementById("userNameChange").innerText = "";
      this.setState({ invalidUser: true });
    }
  };

  emailChange = (event) => {
    const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reEmail.test(event.target.value)) {
      document.getElementById("emailChange").innerText =
        "***Please enter valid email";
      this.setState({ invalidEmail: true });
    } else {
      document.getElementById("emailChange").innerText = "";
      this.setState({ invalidEmail: false, email: event.target.value });
    }
  };

  passwordChange = (event) => {
    if (
      (event.target.value.length && event.target.value.length < 6) ||
      event.target.value.length > 25
    ) {
      document.getElementById("changePassword").innerText =
        "Password must be 6-25 characters long";
      this.setState({ invalidPass: true });
    } else if (event.target.value.length >= 6) {
      const rePass = /^(?=.*[a-z])(?=.*[A-z])(?=.*[0-9])(?!\s)(?=.{6,25})/;
      if (!rePass.test(event.target.value)) {
        document.getElementById("changePassword").innerText =
          "***Password must have atleast one uppercase, lowercase and digit character";
        this.setState({ invalidPass: true });
      } else {
        document.getElementById("changePassword").innerText = "";
        this.setState({ invalidPass: false, password: event.target.value });
      }
    } else {
      document.getElementById("changePassword").innerText = "";
      this.setState({ invalidPass: true });
    }
  };

  uidcheck = (e) => {
    let usr = e.target.value;
    const usrid = document.getElementById("userNameChange");
    const self = this;
    if (usr.length && usrid.innerText === "") {
      fetch("http://127.0.0.1:3001/regcreval", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: usr, email: "" }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res !== "success") {
            usrid.innerText = "***Username already exists";
            self.setState({ invalidUser: true });
          }
        })
        .catch(console.log);
    }
  };

  emailcheck = (e) => {
    let email = e.target.value;
    const usremail = document.getElementById("emailChange");
    const self = this;
    if (email.length && usremail.innerText === "") {
      fetch("http://127.0.0.1:3001/regcreval", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "", email: email }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res !== "success") {
            usremail.innerText = "***Email already registered";
            self.setState({ invalidEmail: true });
          }
        })
        .catch(console.log);
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:3001/register", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          document.getElementById("registerError").innerText =
            "Inputs not valid";
        } else if (res === "success") {
          // alert("Registration Successful");
          // this.props.history.push("/");
          axios
            .post(
              "http://127.0.0.1:3001/signin",
              {
                username: this.state.username,
                password: this.state.password,
              },
              { withCredentials: true }
            )
            .then((res) => {
              if (res.status === 200) this.props.successLogin(res.data);
            })
            .catch((err) => {
              document.getElementById("registerError").innerText = err;
            });
        }
      })
      .catch((err) => {
        document.getElementById("registerError").innerText = err;
      });
  };

  render() {
    let { invalidUser, invalidPass, invalidEmail } = this.state;
    return (
      <div
        id="regisoverlay"
        className="sans-serif w-90 white mw6 center relative cover bg-top ma2"
      >
        <div
          id="regoverlay"
          className="absolute absolute--fill bg-dark-red o-70 z-unset br4"
        ></div>
        <div className="relative pa4 pa5-m">
          <Link
            className="white outline-0 hover-dark-gray f4 link pointer"
            style={{ float: "right" }}
            href="#"
            to="/"
          >
            X
          </Link>
          <h1 className="serif tracked ma0 mb4 pv3">Register</h1>
          <p className="white f6 pt0" id="registerError"></p>
          <form id="register" onSubmit={this.onSubmit}>
            <div className="mb3">
              <label htmlFor="username" className="db f6 white-80 ttu ph2 mb2">
                UserName
              </label>
              <input
                type="text"
                name="username"
                onBlur={this.uidcheck}
                className="input-reset db w-100 mw-100 white b pv2 ph3 bg-white-30 hover-bg-white-70 hover-gray outline-0 bn br-pill"
                onChange={this.usernameChange}
              />
              <p className="f6" id="userNameChange"></p>
            </div>
            <div className="mb3">
              <label htmlFor="email" className="db f6 white-80 ttu ph2 mb2">
                Email
              </label>
              <input
                type="email"
                name="email"
                onBlur={this.emailcheck}
                onChange={this.emailChange}
                className="input-reset db w-100 mw-100 white b pv2 ph3 bg-white-30 hover-bg-white-70 hover-gray outline-0 bn br-pill"
              />
              <p className="f6" id="emailChange"></p>
            </div>
            <div className="mb4">
              <label htmlFor="password" className="db f6 white-80 ttu ph2 mb2">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={this.passwordChange}
                className="input-reset db w-100 mw-100 white b pv2 ph3 bg-white-30 hover-bg-white-70 hover-gray outline-0 bn br-pill"
              />
              <p className="f6" id="changePassword"></p>
            </div>
            <div>
              <button
                type="submit"
                disabled={invalidEmail || invalidPass || invalidUser}
                className="input-reset db w-100 light-gray f6 b ttu tracked pv3 ph3 pointer bg-black outline-0 hover-bg-dark-gray bn br-pill"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
