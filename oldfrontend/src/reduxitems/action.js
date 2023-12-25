import { LOGOUT, IMAGE_SUBMIT, IMAGE_LOAD, IMAGE_LOAD_FAIL } from "./constants";

export const onLogout = () => ({ type: LOGOUT });

getRegions = (res, regions) => {
  const image = document.getElementById("searchedImage");
  const width = Number(image.width);
  const height = Number(image.height);
  res.forEach((region) => {
    const box = region.region_info.bounding_box;
    box.top_row *= height;
    box.left_col *= width;
    box.bottom_row = (1 - box.bottom_row) * height;
    box.right_col = (1 - box.right_col) * width;
    regions.push(box);
  });
};
getNames = (res, names) => {
  res.forEach((region) => {
    names.push(region.data.concepts[0].name);
  });
};
getNature = (res, natures) => {
  res.forEach((region) => {
    let age, gender, culture;
    region.data.concepts.forEach((concept) => {
      if (!age && concept.vocab_id === "age_appearance") age = concept.name;
      else if (!gender && concept.vocab_id === "gender_appearance")
        gender = concept.name;
      else if (!culture && concept.vocab_id === "multicultural_appearance")
        culture = concept.name;
    });
    natures.push({ age: age, gender: gender, culture: culture });
    // natures.push([age, gender, culture]);
  });
};

export const onImageSearch = (searchDetails) => (dispatch) => {
  dispatch({ type: IMAGE_SUBMIT, payload: { ...searchDetails } });
  const { imageUrl, api } = searchDetails;
  const regions = [];
  const names = [];
  const natures = [];
  axios
    .post(
      "http://127.0.0.1:3001/user/clarifai",
      { url: imageUrl, api: api },
      { withCredentials: true }
    )
    .then((res) => {
      if (res.status === 200) {
        getRegions(res.data, regions);
        if (api === 1) getNames(res.data, names);
        else if (api === 2) getNature(res.data, natures);
        dispatch({
          type: IMAGE_LOAD,
          payload: {
            regions: regions,
            names: names,
            natures: natures,
          },
        });
      }
    })
    .catch((err) => {
      dispatch({ type: IMAGE_LOAD_FAIL });
    });
};
