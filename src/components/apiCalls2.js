import axios from "../components/axios";

// get comments
export const getComments = (token, streamId) => {
    return axios({
      method: "GET",
      url: `/Addcomment/${streamId}`,
      headers: { Authorization: token },
    });
  };