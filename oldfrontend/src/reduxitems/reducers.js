import { LOGOUT, IMAGE_SUBMIT, IMAGE_LOAD, IMAGE_LOAD_FAIL } from "./constants";

const imageSubmitState = {
  imageUrl: "",
  api: 0,
  regions: [],
  names: [],
  nautres: [],
};

export const onImageSubmit = (state = { imageSubmitState }, action = {}) => {
  switch (action.type) {
    case IMAGE_SUBMIT:
      return { ...imageSubmitState, ...action.payload };
    case IMAGE_LOAD:
      return { ...state, ...action.payload };
    case IMAGE_LOAD_FAIL:
      return { ...state };
    case LOGOUT:
    default:
      return { ...imageSubmitState };
  }
};
