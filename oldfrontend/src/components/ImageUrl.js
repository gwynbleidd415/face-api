import React from "react";
// import "./ImageUrl.css";

// const regionMarkers = (regions) => {
//   regions.map((region) => {
//     return (
//       <div
//         className="bounding-regions"
//         style={{
//           inset: `${region.top_row}% ${region.right_col}% ${region.bottom_row}% ${region.left_col}%`,
//         }}
//       ></div>
//     );
//   });
//   return regions[0];
// };

class ImageUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = { api: 0 };
  }

  onHover = (i) => {
    if (this.props.api === 1) {
      // console.log(i);
      // const classfield = ".bounding-container .a";
      const el = document.querySelector(".bounding-container.t100.a" + i);
      el.style.display === "none"
        ? (el.style.display = "")
        : (el.style.display = "none");
    } else if (this.props.api === 2) {
      const el1 = document.querySelector(".bounding-container.t200.b" + i);
      const el = document.querySelector(".bounding-container.t100.b" + i);
      el.style.display === "none"
        ? (el.style.display = "")
        : (el.style.display = "none");
      el1.style.display === "none"
        ? (el1.style.display = "")
        : (el1.style.display = "none");
    }
  };

  testfunc = (region, i) => {
    return (
      <div
        className="bounding-regions"
        key={i}
        onMouseEnter={() => this.onHover(i)}
        onMouseLeave={() => this.onHover(i)}
        onTouchStart={() => this.onHover(i)}
        onTouchEnd={() => this.onHover(i)}
        style={{
          top: region.top_row,
          right: region.right_col,
          bottom: region.bottom_row,
          left: region.left_col,
        }}
      >
        {this.props.api === 1 && (
          <div
            className={"bounding-container t100 a" + i}
            style={{ display: "none" }}
          >
            <span>{this.props.names[i]}</span>
          </div>
        )}
        {this.props.api === 2 && (
          <>
            <div
              className={"bounding-container t200 b" + i}
              style={{ display: "none" }}
            >
              {/* <span>{this.props.natures[i].culture}</span> */}
              <span>{this.props.natures[i][2]}</span>
            </div>
            <div
              className={"bounding-container t100 b" + i}
              style={{ display: "none" }}
            >
              {/* <span>{this.props.natures[i].age}</span>
              <span>{this.props.natures[i].gender}</span> */}
              <span className="pr2">{this.props.natures[i][0]}</span>
              <span>{this.props.natures[i][1]}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  render() {
    const { imageUrl, regions } = this.props;
    return (
      <div className="tc ma1" id="imageUrlRes">
        <div className="dib relative">
          <img
            id="searchedImage"
            src={imageUrl}
            alt=""
            width="450px"
            height="auto"
            decoding="sync"
          />
          {regions.map((region, i) => this.testfunc(region, i))}
        </div>
        {regions.length ? (
          <div className="db relative">
            <p className="white">Total of {regions.length} faces were found</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

// const testfunc = (region, i) => {
//   return (
//     <div
//       className="bounding-regions"
//       key={i}
//       style={{
//         top: region.top_row,
//         right: region.right_col,
//         bottom: region.bottom_row,
//         left: region.left_col,
//       }}
//     ></div>
//   );
// };

// const ImageUrl = (props) => {
//   const { imageUrl, regions } = props;
//   return (
//     <div className="tc ma1" id="imageUrlRes">
//       <div className="dib relative">
//         <img
//           id="searchedImage"
//           src={imageUrl}
//           alt=""
//           width="450px"
//           height="auto"
//           decoding="sync"
//         />
//         {regions.map((region, i) => testfunc(region, i))}
//       </div>
//       {regions.length ? (
//         <div className="db relative">
//           <p className="white">Total of {regions.length} faces were found</p>
//         </div>
//       ) : (
//         <div></div>
//       )}
//     </div>
//   );
// };

export default ImageUrl;
