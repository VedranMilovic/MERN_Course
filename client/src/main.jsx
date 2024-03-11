import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css"; // import librarya prije index.css, da se izbjegnu problemi kasnije
import "./index.css";
// import customFetch from "./utils/customFetch.js";
import axios from "axios";
import { ToastContainer } from "react-toastify";

// const response = await axios.get("/api/v1/test"); // get je default, tak da ga ni ne treba pisati.
// Kad bi importali customFetch, mogli bi njega zvati umjesto axios, i onda je part samo /test
// console.log(response);
// fetch("/api/v1/test") // ne trebamo puni path, imamo ga u vite.config
//   .then((res) => res.json())
//   .then((data) => console.log(data));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </React.StrictMode>
);
