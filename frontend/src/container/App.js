import React, { Component } from "react";
import Particles from "react-particles-js";
import axios from "axios";
import { Route, Redirect } from "react-router-dom";
import Navigation from "../components/Navigation";
import Logo from "../components/Logo";
import Signin from "../components/Signin";
import Register from "../components/Register";
import ImageForm from "../components/ImageForm";
import Rank from "../components/Rank";
import ImageUrl from "../components/ImageUrl";

const backAnim = {
  particles: {
    number: {
      value: 85,
    },
    size: {
      value: 2,
    },
  },
  // interactivity: {
  //   events: {
  //     onhover: {
  //       enable: true,
  //       mode: "repulse",
  //     },
  //   },
  // },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      imageUrl: "",
      regions: [],
      names: [],
      nautres: [],
      api: 0,
      entries: -1,
      user: "",
      logged: false,
    };
    axios
      .get("http://127.0.0.1:3001/", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          this.successLogin(res.data);
        }
      });
  }

  getRegions = (res, regions) => {
    // const regionss = [];
    const image = document.getElementById("searchedImage");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(res);
    res.forEach((region) => {
      const box = region.region_info.bounding_box;
      box.top_row *= height;
      box.left_col *= width;
      box.bottom_row = (1 - box.bottom_row) * height;
      box.right_col = (1 - box.right_col) * width;
      // box.top_row *= 100;
      // box.left_col *= 100;
      // box.bottom_row = (1 - box.bottom_row) * 100;
      // box.right_col = (1 - box.right_col) * 100;
      regions.push(box);
    });
    // this.setState({ regions: [...regionss], entries: this.state.entries + 1 });
    // console.log(this.state.regions);
  };

  getNames = (res, names) => {
    // const names = [];
    res.forEach((region) => {
      names.push(region.data.concepts[0].name);
    });
    // this.setState({ names: [...names] });
  };

  getNature = (res, natures) => {
    // const natures = [];
    res.forEach((region) => {
      let age, gender, culture;
      region.data.concepts.forEach((concept) => {
        if (!age && concept.vocab_id === "age_appearance") age = concept.name;
        else if (!gender && concept.vocab_id === "gender_appearance")
          gender = concept.name;
        else if (!culture && concept.vocab_id === "multicultural_appearance")
          culture = concept.name;
      });
      // natures.push({ age: age, gender: gender, culture: culture });
      natures.push([age, gender, culture]);
    });
    // console.log(natures);
    // this.setState({ natures: [...natures] });
  };

  onImageSubmit = (searchInfo) => {
    const { imageUrl, api } = searchInfo;
    document.getElementById("clarifaiError").innerText = "";
    this.setState({
      imageUrl: imageUrl,
      regions: [],
      names: [],
      natures: [],
      api: api,
    });
    axios
      .post(
        "http://127.0.0.1:3001/user/clarifai",
        { url: imageUrl, api: api },
        { withCredentials: true }
      )
      .then((res) => {
        const natures = [],
          names = [],
          regions = [];
        if (res.status === 200) {
          if (api === 2) this.getNature(res.data, natures);
          else if (api === 1) this.getNames(res.data, names);
          this.getRegions(res.data, regions);
          this.setState({
            // imageUrl: imageUrl,
            // api: api,
            regions: [...regions],
            natures: [...natures],
            names: [...names],
            entries: this.state.entries + 1,
          });
        } else
          document.getElementById("clarifaiError").innerText =
            "Error getting data!!!";
      })
      .catch((err) => {
        document.getElementById("clarifaiError").innerText =
          "Error getting data!!!";
      });
  };

  successLogin = (user) => {
    this.setState({
      user: user.username,
      entries: user.entries,
      logged: true,
    });
  };
  successLogout = (e) => {
    // alert("logoutCalled");
    this.setState({
      imageUrl: "",
      regions: [],
      names: [],
      natures: [],
      user: "",
      entries: -1,
      logged: false,
    });
    axios.get("http://127.0.0.1:3001/logout", { withCredentials: true });
  };

  render() {
    return (
      <div className="backgroundMain">
        <Particles className="backgroundAnimation" params={backAnim} />
        <Route path="/user">
          {!this.state.logged && <Redirect to="/" />}
          <Navigation successLogout={this.successLogout} />
        </Route>
        <Logo />
        <Route exact path="/">
          {this.state.logged && <Redirect to="/user" />}
          <Signin successLogin={this.successLogin} />
        </Route>
        <Route path="/register">
          {this.state.logged && <Redirect to="/user" />}
          <Register successLogin={this.successLogin} />
        </Route>
        <Route path="/user">
          {!this.state.logged && <Redirect to="/" />}
          <div>
            <Rank username={this.state.user} entries={this.state.entries} />
            <ImageForm
              onInputChange={this.onInputChange}
              onImageSubmit={this.onImageSubmit}
            />
            <ImageUrl
              regions={this.state.regions}
              imageUrl={this.state.imageUrl}
              names={this.state.names}
              natures={this.state.natures}
              api={this.state.api}
            />
          </div>
        </Route>
      </div>
    );
  }
}

export default App;
