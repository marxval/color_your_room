import React, { useState } from "react";
import { useInterval } from "../utils/customHooks";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getToken } from "../utils/GetToken";
const DELAY = 1000; // number of miliseconds that will delay an api petition
const NUMBER_OF_QUERYES = 2;
import "./index.css";

const App = () => {
  const [token, setToken] = useState("");
  // Get a valid token to make petitions
  useState(async () => {
    console.log("entre", token);
    setToken(await getToken());
  }, []);
  return     <div>
    
  
</div>;
};

export default App;



const InputBox = ({ setSeeds, seeds, setToken, token }) => {
  const [lastQuery, setLastQuery] = useState("");
  const [querys, setQuerys] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [queryType, setQueryType] = useState("track");
  const { handleSubmit, register, watch } = useForm();

  // Get a valid token to make petitions
  useState(async () => {
    console.log("entre", token);
    setToken(await getToken());
  }, []);

  const onSubmit = (values) => {
    if (querys.length > 0) {
      console.log(querys[cursor]);
      setSeeds((seeds) => [...seeds, querys[cursor]]);
    }
  };

  // Set a list of query results by making a GET request to the spotify search API
  async function getResults(token, query) {
    let req_conf = {};
    if (queryType === "genre")
      req_conf = {
        method: "get",
        url: "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
    else
      req_conf = {
        method: "get",
        url: "https://api.spotify.com/v1/search",
        params: { q: query, type: queryType, limit: NUMBER_OF_QUERYES },
        headers: {
          Authorization: "Bearer " + token,
        },
      };
    try {
      const req = await axios(req_conf);
      let items;
      if (queryType === "genre") items = req.data.genres;
      else items = req.data[queryType + "s"].items;
      const queries = items.map((item) => {
        switch (queryType) {
          case "track":
            return {
              title: item.name,
              subtitle: item.artists[0].name,
              image: item.album.images[0].url,
              type: queryType,
              obj: item,
            };
          case "artist":
            return {
              title: item.name,
              subtitle: item.followers.total,
              image: item.images[0].url,
              type: queryType,
              obj: item,
            };
          default:
            // genre
            return {
              title: item,
              type: queryType,
              subtitle: "",
              image: "",
            };
        }
      });
      setQuerys(queries);
    } catch (error) {
      console.log(error);
    }
  }
  // Search for the query written by the user
  const requestQuery = () => {
    const query = watch("query").trim();
    if (query && query !== lastQuery) {
      getResults(token, query);
      setLastQuery(query);
    }
  };

  // Make the request to the spotify search API every DELAY.
  useInterval(requestQuery, DELAY);

  // Handling arrow navigation keyboard keys
  function handleKeyDown(e) {
    if (e.keyCode === 40) {
      // KEY UP
      e.preventDefault();
      if (cursor === querys.length - 1) setCursor(0);
      else setCursor(cursor + 1);
    }
    if (e.keyCode === 38) {
      // KEY DOWN
      e.preventDefault();
      if (cursor === 0) setCursor(querys.length - 1);
      else setCursor(cursor - 1);
    }
  }

  // Handling hovering over a query.
  function handleHover(e) {
    e.preventDefault();
    setCursor(parseInt(e.target.id));
  }
  function handleRadio(e) {
    setQueryType(e.target.value);
  }
  console.log(seeds);
  return (

  );
};
