import React from "react";
import Tilt from "react-tilt";
// import "./Logo.css";
import brainLogo from "./brainLogo.png";

const Logo = () => {
  return (
    <div className="ma4 mt2 flex justify-center o-80 justify-start-ns">
      <Tilt
        className="Tilt ba br2 b--dark-red shadow-2 logoShadow"
        options={{ max: 35 }}
        style={{ height: 100, width: 100 }}
      >
        <div className="Tilt-inner">
          <img className="white pt3 pl3" alt="Brain" src={brainLogo} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
