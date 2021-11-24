exports.reduceUserDetails = (data) => {
  let userDetails = {};
  if (data.bio !== "") userDetails.bio = data.bio;
  if (data.website.substring(0, 4) !== "http") {
    userDetails.website = `http://${data.website}`;
  } else userDetails.website = data.website;
  if (data.location !== "") userDetails.location = data.location;
  return userDetails;
};

exports.isEmpty = (string) => {
  if (string === "") {
    return true;
  } else {
    return false;
  }
};
