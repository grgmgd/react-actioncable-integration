import axios from "axios";

export default (request) => {
  const token = localStorage.getItem("token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  return axios({
    headers: {
      token,
      client,
      uid,
    },
    ...request,
  });
};
