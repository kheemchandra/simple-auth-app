import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import classes from './AuthForm.module.css';

const API_KEY = 'AIzaSyDTeCpbDY-iZ_79nuf3wp31d1vTg7Su3vA';


const AuthForm = () => {
  const history = useHistory();
  const ctx = useContext(AuthContext);

  const enteredEmailRef = useRef();
  const enteredPasswordRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = event => {
    event.preventDefault();

    const enteredEmail = enteredEmailRef.current.value;
    const enteredPassword = enteredPasswordRef.current.value;

    let url;
    if(isLogin){
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    }else{
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;      
    }

    setSendingRequest(true);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/type'
      },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      })      
    }).then(res => {
      if(res.ok){
        return res.json()
      }else{
        // res.json().then(err => {
          let errorMessage = 'Authentication Error!';
          // if(err.message){console.log("Error is ",err.message)
          //   errorMessage = err.message;
          // }
          throw new Error(errorMessage);
        // });
      }
    }).then(res => { 
      const { expiresIn, idToken } = res; 
      ctx.login(expiresIn, idToken);
      setSendingRequest(false);
      history.replace('/');
    }).catch(err => {
      alert(err.message);
    }) 
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={enteredEmailRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required  ref={enteredPasswordRef}/>
        </div>
        <div className={classes.actions}>
          {!sendingRequest && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {sendingRequest && <p>Sending request....</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
