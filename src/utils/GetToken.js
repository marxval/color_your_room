import axios from "axios";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";

export const getToken = async () => {
  // If we are redirected from the authentication page we set the token to lccal storage
  if (hash.access_token) {
    localStorage.setItem("token", hash.access_token);
    return hash.access_token;
  }
  let _localToken = localStorage.getItem("token");

  const req_conf = {
    method: "get",
    url: "https://api.spotify.com/v1/recommendations",
    params: { seed_tracks: "0uLI1jac8ZJSSRG4QJDo3J", limit: 20 },
    headers: {
      Authorization: "Bearer " + _localToken,
    },
  };

  try {
    await axios(req_conf);
    return _localToken;
  } catch (error) {
    // if the request does not work you are redirected to the spotify auth url.
    window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`;
  }
};
