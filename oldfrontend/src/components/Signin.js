import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }
  onUserBlur = (e) => {
    this.setState({ username: e.target.value });
  };
  onPassBlur = (e) => {
    this.setState({ password: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
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
        if (err.response) {
          const wrongLogin = document.getElementById("wrongLogin");
          if (err.response.data === "noUser")
            wrongLogin.innerText = "User not found";
          else if (err.response.data === "noPass")
            wrongLogin.innerText = "Password incorrect";
          else if (err.response.data === "noData")
            wrongLogin.innerText = "Enter Something";
        }
      });
  };

  render() {
    return (
      <div
        id="signinoverlay"
        className="sans-serif w-90 white mw6 center relative cover bg-top ma2"
      >
        <div
          id="signoverlay"
          className="absolute absolute--fill bg-dark-red o-70 z-unset br4"
        ></div>

        <div className="relative pa4 pa5-m">
          <h1 className="serif tracked ma0 mb4 pv3">Sign In</h1>
          <p className="white f6 pt0" id="wrongLogin"></p>
          <form onSubmit={this.onSubmit} id="login">
            <div className="mb3">
              <label htmlFor="username" className="db f6 white-80 ttu ph2 mb2">
                Username
              </label>
              <input
                type="text"
                onBlur={this.onUserBlur}
                name="username"
                className="input-reset db w-100 mw-100 white b pv2 ph3 bg-white-30 hover-bg-white-70 hover-gray outline-0 bn br-pill"
              />
            </div>
            <div className="mb4">
              <label htmlFor="password" className="db f6 white-80 ttu ph2 mb2">
                Password
              </label>
              <input
                type="password"
                name="password"
                onBlur={this.onPassBlur}
                className="input-reset db w-100 mw-100 white b pv2 ph3 bg-white-30 hover-bg-white-70 hover-gray outline-0 bn br-pill"
              />
            </div>
            <div>
              <button className="input-reset db w-100 light-gray f6 b ttu tracked pv3 ph3 pointer bg-black hover-bg-dark-gray outline-0 bn br-pill">
                Sign In
              </button>
            </div>
          </form>

          <div className="tc b f6 mt4 o-70 glow pa2 i">
            New Member?{" "}
            <Link className="white" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;
