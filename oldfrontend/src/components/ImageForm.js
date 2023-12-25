import React from "react";

class ImageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      api: 0,
    };
  }

  setAPI = (e) => {
    if (e.target.value === "Find_Celebrities") this.setState({ api: 1 });
    if (e.target.value === "Demographics") this.setState({ api: 2 });
    if (e.target.value === "Count_Face") this.setState({ api: 0 });
  };
  onImageInput = (event) => {
    this.setState({ imageUrl: event.target.value });
  };
  onImageSubmit = (e) => {
    e.preventDefault();
    // this.setState({ imageUrl: "" });
    this.props.onImageSubmit(this.state);
  };

  render() {
    return (
      <div className="tc mt2 pt2">
        <p className="white">
          This website uses API to detect faces in images... paste image url in
          search bar to upload image
        </p>
        <form>
          {/* <div class="fl w-75 block"> */}
          <div className="mb2 db tc">
            <label className="pr3 dib">
              <input
                checked={this.state.api === 0}
                onClick={(e) => this.setAPI(e)}
                type="radio"
                name="api"
                value="Count_Face"
              />
              <span className="white">Count Faces</span>
            </label>
            {/* </div>
            <div class="mb2"> */}
            <label className="pr3 dib">
              <input
                checked={this.state.api === 1}
                onClick={(e) => this.setAPI(e)}
                type="radio"
                name="api"
                value="Find_Celebrities"
              />
              <span className="white">Find Celebrities</span>
            </label>
            <label className="pr3 dib">
              <input
                checked={this.state.api === 2}
                onClick={(e) => this.setAPI(e)}
                type="radio"
                name="api"
                value="Demographics"
              />
              <span className="white">Demographics</span>
            </label>
          </div>
          {/* </div> */}
          <input
            type="search"
            className=" pa3 ma2 ma0-ns bw0 f4 br3 br--left-ns bg-white-40 hover-bg-white-70 outline-0"
            placeholder="Image URL"
            onBlur={this.onImageInput}
          />
          <button
            className="pa3 f4 bw0 br3 grow dib br--right-ns pointer bg-dark-red o-80 glow outline-0"
            type="submit"
            onClick={this.onImageSubmit}
          >
            Submit
          </button>
        </form>
        <p className="white f3" id="clarifaiError"></p>
      </div>
    );
  }
}

export default ImageForm;
