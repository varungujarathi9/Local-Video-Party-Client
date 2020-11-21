import React from 'react'
import { navigate} from '@reach/router'
// import {userContext} from '../helper/usercontext'

import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'
import {socket} from '../helper/socketfile'
import { Form, Button , FormControl } from 'react-bootstrap';
export default class LandingPage extends React.Component {
    // const user = useContext(userContext) 
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            errormsg: '',
           
        }
    }

    onSubmitForm = (e) => {
        var usernameValid = this.state.username
        console.log(Boolean(usernameValid === ''))
        if (usernameValid !== '') {
            console.log("check here")           
            socket.emit('message', {data:usernameValid});
            this.displayUsername()
            // navigate("decideroom", {replace: true} )
            e.preventDefault()


        }
        else {
            e.preventDefault()
            //    user.setErrorMsg("please provide username")   
            this.setState({
                errormsg: "Please provide username"
            })

        }

    }

    displayUsername = ()=>{
        socket.on('outgoingdata',(username)=>{
            console.log(username)            
            localStorage.setItem('username',username.data)
            navigate("decideroom", {replace: true} )
        })
       
        
    }

    handleInput = (e) => {
        e.preventDefault()
        // user.setUsername(e.target.value.trim())
        this.setState({
            username: e.target.value.trim()
        })


    }

    render() {
        const { errormsg } = this.state
        
        return (
            <div>
                <NavBar/>

                <Form inline>
                    <FormControl type="text" placeholder="Enter Username" className="mr-sm-2" />
                    <Button variant="outline-info">Submit</Button>
                 </Form>
                <form >
                    <label>Username</label>
                    <input type="text" onChange={this.handleInput} ></input>
                    <button onClick={this.onSubmitForm}>submit</button>
                </form>
                <h6 style={{ color: 'red', fontSize: '16px', margin: '5px' }}>
                    {errormsg}
                </h6>


            <Footer />
            </div>
        )
    }
}



