import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class LoginMenu extends Component {
  

  render() {

    return (
        <div style={{ marginTop: 0, marginRight: 10, top: 0, right: 0, position: "absolute", color: "white"}} >
     
      <Button href='#/login' style={{color: "#f5f5f5"}}>Login</Button>
      <Button href='#/submitAccount' style={{color: "#f5f5f5"}}>SUBMIT an ACCOUNT</Button>
      <Button href='#/resetPassword' style={{color: "#f5f5f5"}}>RESET PASSWORD</Button>
        </div>
        
    );
  }
}

export default LoginMenu;
