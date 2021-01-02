// TODO: got back to lobby when creator goes back--DONE
// TODO: leave room
// TODO: check file duration of all members
// TODO: create a ready button for joinee
import { navigate } from '@reach/router'
import React from 'react'
import ReactPlayer from 'react-player'
import { serverSocket } from './helper/Connection'
import {startStreaming} from './helper/SimplePeerVideoPlayer.js'
import {getCookie} from './helper/CookieHelper'

export default class VideoPlayer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            playing: false,
            secondsPlayed: 0,
            lastUpdatedBy: getCookie('username'),
            videoPlayer: null,
        }
        this.videoPlayerRef = React.createRef()
    }

    componentDidMount(){
        serverSocket.on('updated-video', (data) =>{
            if(data['pauseDetails']['username'] !== getCookie('username')){
                this.setState({
                    playing: data['pauseDetails']['playing'],
                    secondsPlayed: data['pauseDetails']['progressTime'],
                    lastUpdatedBy: data['pauseDetails']['username']
                })
                if(data['pauseDetails']['progressTime'] !== null){
                    this.state.videoPlayer.seekTo(data['pauseDetails']['progressTime'], 'seconds')
                }
                if(data['pauseDetails']['exited'] === true){
                    navigate('/lobby')
                }
            }
        })

        if(getCookie('user-type') === "creator"){
            setTimeout(() => {startStreaming(JSON.parse(getCookie('room-details')).members);}, 3000)
        }
        else{
            startStreaming(JSON.parse(getCookie('room-details')).members)
        }
    }

    componentWillUnmount(){
        if (this.state.lastUpdatedBy === getCookie('username')){
            let pauseDetails = {'roomID':getCookie('room-id'),'playing':false,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':getCookie('username'), 'exited':true}
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
            sessionStorage.removeItem('video_file')
        }
    }

    vidOnPause=()=>{
        if (this.state.lastUpdatedBy === getCookie('username')){
            let pauseDetails;
            if(getCookie("user-type") === "creator"){
                pauseDetails = {'roomID':getCookie('room-id'), 'playing':false,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':getCookie('username'), 'exited':false}
            }
            else{
                pauseDetails = {'roomID':getCookie('room-id'), 'playing':false,'progressTime':null, 'username':getCookie('username'), 'exited':false}
            }
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
        }

        this.setState({
            lastUpdatedBy: getCookie('username'),
            playing: false,
            secondsPlayed: this.state.videoPlayer.getCurrentTime()
        })

    }

    vidOnPlay = () => {
        if (this.state.lastUpdatedBy === getCookie('username')){
            let pauseDetails;
            if(getCookie("user-type") === "creator"){
                pauseDetails = {'roomID':getCookie('room-id'), 'playing':true,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':getCookie('username'), 'exited':false}
            }
            else{
                pauseDetails = {'roomID':getCookie('room-id'), 'playing':true,'progressTime':null, 'username':getCookie('username'), 'exited':false}
            }
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
        }

        this.setState({
            lastUpdatedBy: getCookie('username'),
            playing: true,
            secondsPlayed: this.state.videoPlayer.getCurrentTime()
        })
    }

    handleRef = (player) =>{
        this.setState({videoPlayer:player})
    }
    render(){
        const videoFileUrl = getCookie('video_file')
        const {playing} = this.state

        return(

            <div>
                <div className='player-wrapper' style={{backgroundColor:'black'}}>
                <ReactPlayer
                id="video-player"
                ref ={this.handleRef}
                playing={playing}
                className='react-player fixed-bottom'
                url= {videoFileUrl}
                width='100%'
                height='100vh'
                controls = {true}
                onPause ={this.vidOnPause}
                onPlay={this.vidOnPlay}
                onReady={this.ready}
                />
                </div>
            </div>
        )
    }
}