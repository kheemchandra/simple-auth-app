import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const ctx = useContext(AuthContext);
  
  const history = useHistory();
  
  const enteredNewPasswordRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = enteredNewPasswordRef.current.value; 

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDTeCpbDY-iZ_79nuf3wp31d1vTg7Su3vA`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/type'
      },
      body: JSON.stringify({
        idToken: ctx.token,
        password: enteredNewPassword,
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
      ctx.login(expiresIn, idToken)
      history.replace('/');
    }).catch(err => {
      alert(err.message);
    }); 
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" required ref={enteredNewPasswordRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
