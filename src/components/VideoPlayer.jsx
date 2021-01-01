// TODO: got back to lobby when creator goes back--DONE
// TODO: leave room
// TODO: check file duration of all members
// TODO: create a ready button for joinee
import { navigate } from '@reach/router'
import React from 'react'
import ReactPlayer from 'react-player'
import { serverSocket } from './helper/connection'
import {startStreaming} from './helper/SimplePeerVideoPlayer.js'

export default class VideoPlayer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            playing: false,
            secondsPlayed: 0,
            lastUpdatedBy: sessionStorage.getItem('username'),
            videoPlayer: null,
        }
        this.videoPlayerRef = React.createRef()
    }

    componentDidMount(){
        if(sessionStorage.getItem('video-stream-flag') === '' || sessionStorage.getItem('video-stream-flag') === null || sessionStorage.getItem('video-stream-flag') === undefined){
            navigate('/lobby')
        }
        this.setState({
            videoStreamFlag: sessionStorage.getItem('video-stream-flag')
        })
        serverSocket.on('updated-video', (data) =>{
            if(data['pauseDetails']['username'] !== sessionStorage.getItem('username')){
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

        if(sessionStorage.getItem('user-type') === "creator"){
            console.log(1)
            setTimeout(() => {startStreaming(JSON.parse(sessionStorage.getItem('room-details')).members);}, 3000)
        }
        else{
            console.log(2)
            startStreaming(JSON.parse(sessionStorage.getItem('room-details')).members)
        }
    }

    componentWillUnmount(){
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails = {'roomID':sessionStorage.getItem('room-id'),'playing':false,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username'), 'exited':true}
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
            sessionStorage.removeItem('video_file')
        }
    }

    vidOnPause=()=>{
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails;
            if(sessionStorage.getItem("user-type") === "creator"){
                pauseDetails = {'roomID':sessionStorage.getItem('room-id'), 'playing':false,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username'), 'exited':false}
            }
            else{
                pauseDetails = {'roomID':sessionStorage.getItem('room-id'), 'playing':false,'progressTime':null, 'username':sessionStorage.getItem('username'), 'exited':false}
            }
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
        }

        this.setState({
            lastUpdatedBy: sessionStorage.getItem('username'),
            playing: false,
            secondsPlayed: this.state.videoPlayer.getCurrentTime()
        })

    }

    vidOnPlay = () => {
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails;
            if(sessionStorage.getItem("user-type") === "creator"){
                pauseDetails = {'roomID':sessionStorage.getItem('room-id'), 'playing':true,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username'), 'exited':false}
            }
            else{
                pauseDetails = {'roomID':sessionStorage.getItem('room-id'), 'playing':true,'progressTime':null, 'username':sessionStorage.getItem('username'), 'exited':false}
            }
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
        }

        this.setState({
            lastUpdatedBy: sessionStorage.getItem('username'),
            playing: true,
            secondsPlayed: this.state.videoPlayer.getCurrentTime()
        })
    }

    handleRef = (player) =>{
        this.setState({videoPlayer:player})
    }
    render(){
        const videoFileUrl = sessionStorage.getItem('video_file')
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