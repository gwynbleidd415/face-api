import React from "react";

const Rank = (props) => {
  return (
    <div className="tc">
      <p className="f3 white pa0 ma0">
        <span className="i b">{props.username}</span>, your current rank is..
      </p>
      <p className="f1 white pa0 ma0"># {props.entries} </p>
    </div>
  );
};

export default Rank;
