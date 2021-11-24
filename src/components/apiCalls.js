import axios from "../components/axios";

//get user data
export const user = (token) => {
  return axios({
    method: "GET",
    url: "/getUser",
    headers: { Authorization: token },
  });
};

//upload profie image
export const uploadImg = (formData, token) => {
  return axios({
    method: "POST",
    url: "/uploadImg",
    data: formData,
    headers: { Authorization: token },
  });
};

// update user profile
export const updateUser = (userData, token) => {
  return axios({
    method: "PUT",
    url: "updateUser",
    data: userData,
    headers: { Authorization: token },
  });
};

// get all streams
export const getAllStream = (token) => {
  return axios({
    method: "GET",
    url: "/getAllStream",
    headers: { Authorization: token },
  });
};

//like streams
export const likeStream = (token, streamId) => {
  return axios({
    method: "GET",
    url: `/likes/${streamId}`,
    headers: { Authorization: token },
  });
};

//get likes
export const getlikeStream = (token) => {
  return axios({
    method: "GET",
    url: `/getlikes`,
    headers: { Authorization: token },
  });
};

//unLike stream
export const unLikeStream = (token, streamId) => {
  return axios({
    method: "GET",
    url: `/unlikes/${streamId}`,
    headers: { Authorization: token },
  });
};

//post a stream
export const postStream = (token, _data) => {
  return axios({
    method: "POST",
    url: "/postStreams",
    data: { body: _data },
    headers: { Authorization: token },
  });
};

//get notifications
export const getNotification = (token) => {
  return axios({
    method: "GET",
    headers: { Authorization: token },
  });
};

// get comments
export const getComments = (token, streamId) => {
  return axios({
    method: "GET",
    url: `/getComments/${streamId}`,
    headers: { Authorization: token },
  });
};

// post comment
export const postComment = (token, _data, id) => {
  return axios({
    method: "POST",
    url: `/Addcomment/${id}`,
    data: { body: _data },
    headers: { Authorization: token },
  });
};

// remove stream
export const _removeStream = (token, streamId) => {
  return axios({
    method: "DELETE",
    url: `/removeStream/${streamId}`,
    headers: { Authorization: token },
  });
};
