import React from "react";

const Navigation = (props) => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <p
        onClick={props.successLogout}
        className="f3 link dim underline pa3 pointer white"
        id="logout"
      >
        Sign Out
      </p>
    </nav>
  );
};

export default Navigation;
