import React from 'react'
import {Router} from '@reach/router'
import Home from '../Home'
import Login from '../Login'
import Lobby from '../Lobby'
import VideoPlayer from '../VideoPlayer'
import ChangeLog from '../changelog'

export default class RouterPage extends React.Component{
    render(){
        return(
            <Router>
                <Home exact path="/" />
                <Login exact path="/login" />
                <Lobby exact path="/lobby" />
                <VideoPlayer exact path="/video-player" /> 
                <ChangeLog path="/changelog"/>    
            </Router>
        )
    }
}