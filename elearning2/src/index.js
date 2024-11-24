import React from "react";
import ReactDOM from "react-dom/client"; // Import `createRoot` from React 18
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // Use `createRoot`
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
