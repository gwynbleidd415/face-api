import React from "react";
import Tilt from "react-tilt";
// import "./Logo.css";
import brainLogo from "./brainLogo.png";

const Logo = () => {
  return (
    <div className="ma3 mt1 mb0-ns flex justify-center o-80 justify-start-ns">
      <Tilt
        className="Tilt ba br2 b--dark-red shadow-2 logoShadow"
        options={{ max: 35 }}
        style={{ height: 120, width: 120 }}
      >
        <div className="Tilt-inner">
          <img
            className="white pt3 pl3"
            width="90px"
            height="auto"
            alt="Brain"
            src={brainLogo}
          />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
