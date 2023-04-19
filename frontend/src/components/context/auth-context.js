import React, { useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  userEmail: "",
  userType: "",
  setUserType: (type) => {},
  setUserRoleType: (type, email) => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const addExpirationTime = new Date(expirationTime).getTime();

  const remianingDuration = addExpirationTime - currentTime;

  return remianingDuration;
};

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [userEmail, setUserEmail] = useState("");

  let initialToken;
  
  useEffect(() => {
    // Perform localStorage action
    initialToken = localStorage.getItem("token");
    setToken(initialToken);
  }, []);

  let localType;
  let localEmail;

  useEffect(() => {
    // Perform localStorage action
    localType = localStorage.getItem("type");
    localEmail = localStorage.getItem("email");

    setUserType(localType);
    setUserEmail(localEmail);
  }, [localType, localEmail]);

  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    console.log("In auth Logout");
    setToken(null);
    localStorage.removeItem("token");

    localStorage.removeItem("type");
    localStorage.removeItem("email");

    // if the timer was saved thenwe are clearing the timer
    if (logoutHandler) {
      clearTimeout(logoutTimer);
    }
    // window.location.href = "/";

    console.log("In auth Logout");
  };

  const loginHandler = (token, expirationTime) => {
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remianingTime = calculateRemainingTime(expirationTime);

    //this function (logoutHandler) will be called in the given time
    logoutTimer = setTimeout(logoutHandler, remianingTime);
  };

  const setUserRoleType = (type, email) => {
    console.log("inside setting data");

    localStorage.setItem("type", type);
    localStorage.setItem("email", email);

    const localType = localStorage.getItem("type");
    const localEmail = localStorage.getItem("email");

    setUserType(localType);
    setUserEmail(localEmail);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    setUserRoleType: setUserRoleType,
    userType: userType,
    userEmail: userEmail,
  };

  return (
    <>
      <AuthContext.Provider value={contextValue}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
};
export default AuthContext;
