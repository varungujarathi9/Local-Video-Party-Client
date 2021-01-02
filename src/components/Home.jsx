import { navigate } from '@reach/router'
import React from 'react'
import {setCookie, removeAllCookies} from './helper/CookieHelper'

export default class Home extends React.Component{

    componentDidMount(){
        // clear cookies on coming back to homepage
        removeAllCookies()
    }

    navigateToLogin = (userType) => (event) => {
        setCookie('user-type', userType)
        navigate('/login')
    }

    render(){

        return(
            <div>
                <h1>Lets Party!!</h1>
                <button  onClick={this.navigateToLogin('creator')}>Create Party</button>
                <button  onClick={this.navigateToLogin('joinee')}>Join Party</button>
            </div>
        )
    }
}