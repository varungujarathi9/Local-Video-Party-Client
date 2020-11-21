import React, { Component } from 'react';
// import ReactDOM from "react-dom";
import { Navbar, Form, Button, Nav, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class NavBar_Comp extends Component {
  render() {
    return <div><Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#features">Features</Nav.Link>
      <Nav.Link href="#pricing">About</Nav.Link>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-info">Search</Button>
    </Form>
  </Navbar>
  <br />
   </div>;
  }
}

export default NavBar_Comp;
