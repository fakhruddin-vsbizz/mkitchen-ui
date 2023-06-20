import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import VsLogo from "../src/res/img/vslogo.png";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="">
        <div
          className="overlay"
          style={{
            position: 'fixed',
backgroundColor: 'white',
padding: '1rem',
display: 'flex',
inset: '94% 0px 0px 0%',
zIndex: '1',
justifyContent: 'center'
          }}
        >
          <span style={{ textAlign: "center", color: "gray" }}>
            Powered By <img src={VsLogo} style={{ width: 16, height: 16, margin: '2px, 10px' }} alt="logo" />
            <span
              style={{
                textAlign: "center",
                // color: "gray",
                color: "#24323E",
                fontSize: 16,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 'bolder'
              }}
            >
              Visionary Services
            </span>
          </span>
        </div>
        <div
          className="app"
          style={{ position: "relative", textAlign: "center" }}
        ></div>
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();