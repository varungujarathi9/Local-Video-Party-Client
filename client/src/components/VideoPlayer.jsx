import React from 'react'
import ReactPlayer from 'react-player'
import {serverSocket} from './helper/connection'

export default class VideoPlayer extends React.Component{
    state={
        playing: false,
        controls: false,
        light: false,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        onPauseTime:0.0,
        onProgressTime:0.0
    }
    
    
    vidOnPause=()=>{
        this.setState({
            playing:false
        })
        if(this.state.playing === false){
            this.setState({
                onPauseTime:this.player.getCurrentTime()
            })
        }
        console.log(this.player.getCurrentTime())
        console.log("video paused")
    }

    vidOnProgress=()=>{
        this.setState({
            onProgressTime:this.player.getCurrentTime()
        })
        console.log(this.player.getCurrentTime())
        console.log("vid on progreess")
    }


    vidOnPlay =()=>{
        this.setState({
            playing:true
        })

    }

    ref =(player) =>{
        this.player = player
    }
    render(){
        const videoFileUrl = localStorage.getItem('video_file')
        const {playing} =this.state
        return(
            <div className='player-wrapper'>
            <ReactPlayer
            ref ={this.ref}
            playing={playing}
            className='react-player fixed-bottom'
            url= {videoFileUrl}
            width='100%'
            height='100%'
            controls = {true}
            onPause ={this.vidOnPause}
            onProgress={this.vidOnProgress}
            onPlay={this.vidOnPlay}
            />
        </div>
        )
    }
}