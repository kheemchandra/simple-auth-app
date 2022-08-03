import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  token: null,
  isLoggedIn: null,
  login: (expirationTime, tokenId) => {},
  logout: () => {},
});

let storedToken;

 
export const AuthContextProvider = (props) => {
  storedToken = localStorage.getItem('token');
  const [token, setToken] = useState(storedToken);
  const [isLoggedIn, setIsLoggedIn] = useState(storedToken ? true: false);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    setToken(null);
    setIsLoggedIn(false);
  };

  const remainingTime = () => {
    let expirationTime = localStorage.getItem('expiresIn');
    let deadline = new Date(expirationTime);
    let currentTime = new Date();
    return deadline - currentTime - 60000;
  };
  
  const loginHandler = (expiresIn, tokenId) => {
    localStorage.setItem('token', tokenId);
    setToken(tokenId);
    setIsLoggedIn(true);

    const expirationTime = new Date(new Date().getTime() + (+expiresIn)*1000);
    localStorage.setItem('expiresIn', expirationTime.toISOString());

    const rTime = remainingTime();
    setTimeout(() => {
      logoutHandler();
    }, rTime);    
     
  };

  useEffect(() => {
    const expirationTime = localStorage.getItem('expiresIn');
    
    if(expirationTime){ 
      const rTime = remainingTime();
      if(rTime > 0){
        setTimeout(() => {
          logoutHandler();
        }, rTime);
      }
    } 
  }, []);

  const authContext = {
    token: token,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  };

  return <AuthContext.Provider value={authContext}>
    {props.children}
  </AuthContext.Provider>
};

export default AuthContext;