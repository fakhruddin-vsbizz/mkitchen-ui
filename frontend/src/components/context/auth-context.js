import React, { useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  userEmail: "",
  userType: "",
  userId: "",

  setUserType: (type) => {},
  setUserRoleType: (type, email, id) => {},
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
  const [userId, setUserId] = useState("");

  let initialToken;

  useEffect(() => {
    // Perform localStorage action
    initialToken = localStorage.getItem("token");
    setToken(initialToken);
  }, []);

  let localType;
  let localEmail;
  let localId;

  useEffect(() => {
    // Perform localStorage action
    localType = localStorage.getItem("type");
    localEmail = localStorage.getItem("email");
    localId = localStorage.getItem("user_id");

    setUserType(localType);
    setUserEmail(localEmail);
    setUserId(localId);
  }, [localType, localEmail, localId]);

  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    console.log("In auth Logout");
    setToken(null);
    localStorage.removeItem("token");

    localStorage.removeItem("type");
    localStorage.removeItem("email");
    localStorage.removeItem("expirationTime");

    localStorage.removeItem("user_id");

    // if the timer was saved thenwe are clearing the timer
    if (logoutHandler) {
      clearTimeout(logoutTimer);
    }
    window.location.href = "/login";

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

  const setUserRoleType = (type, email, userId) => {
    console.log("inside setting data");

    localStorage.setItem("type", type);
    localStorage.setItem("email", email);
    localStorage.setItem("user_id", userId);

    const localType = localStorage.getItem("type");
    const localEmail = localStorage.getItem("email");

    const localId = localStorage.getItem("user_id");

    setUserType(localType);
    setUserEmail(localEmail);
    setUserId(localId);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    setUserRoleType: setUserRoleType,
    userType: userType,
    userEmail: userEmail,
    userId: userId,
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
