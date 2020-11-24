import React, { Component } from 'react';
// import ReactDOM from "react-dom";
import { Navbar} from 'react-bootstrap';


export default class NavBar_Comp extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark" style={{justifyContent:"center",marginTop:"5px"}}>
          <Navbar.Brand>Video Party</Navbar.Brand>
        </Navbar>
        <br />
      </div>
    )
  }
}


