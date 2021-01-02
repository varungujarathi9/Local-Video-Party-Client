/**
 * TODO: Dont show next for joinees
 * TODO: socket listen to new-joinee, if joinee listen to video-started
 */

import { navigate } from '@reach/router'
import React from 'react'
import { serverSocket } from './helper/Connection'
import {setCookie, getCookie} from './helper/CookieHelper'

export default class Lobby extends React.Component {
    state = {
        userType: '',
        username: '',
        roomDetails: '',
        fileName: '',
        extension: ["mp4", "mkv", "x-msvideo", "x-matroska"],
        extensionValid: false,
        fileError: '',
        messages: [],
        message: '',
    }

    componentDidMount(){

        if (getCookie('user-type') === 'creator' || getCookie('user-type') === 'joinee' ){
            this.setState({userType: getCookie('user-type')})
        }
        else{
            navigate('/')
        }

        if (getCookie('room-details') !== null || getCookie('room-details') !== '' ){
            this.setState({roomDetails: JSON.parse(getCookie('room-details'))})
        }
        else{
            navigate('/')
        }

        if (getCookie('username') !== null || getCookie('username') !== '' ){
            this.setState({username: getCookie('username')})
        }
        else{
            navigate('/')
        }

        if (getCookie('room-id') !== null || getCookie('room-id') !== '' ){
            this.setState({roomID: getCookie('room-id')})
        }
        else{
            navigate('/')
        }

        serverSocket.on('update-room-details', async (data)=>{
            // console.log(data)
            setCookie('room-details', (data))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
        })

        serverSocket.on('video-started', async (data) =>{
            navigate('/video-player')
        })

        serverSocket.on('left_room',data=>{
            setCookie('room-details', data)
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
            navigate('/')
        })

        serverSocket.on('all_left',data=>{
            setCookie('room-details', data)
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
            navigate('/')
        })

        serverSocket.on('receive_message',data=>{
            setCookie('messages', data)
            this.setState({
                messages: data,
            })
        })
        serverSocket.emit('get-all-messages',{roomID:getCookie('room-id')})
    }

    handleFile = (e) => {
        this.setState({
            videoStartError:''
        })
        e.preventDefault()

        var fileList = document.getElementById('videofile').files[0]
        if (fileList !== undefined){
            var typeOfFile = fileList.type
            var file = e.target.value.replace(/^.*[\\]/, '')

            this.setState({
                fileName: file,
            })

            var extensionVal = typeOfFile.split('/')

            if (this.state.extension.includes(extensionVal[1])) {
                this.setState({
                    extensionCheck: true,
                    errorMsg: '',
                })
            }
            else {
                this.setState({
                    errorMsg: "Please provide valid file",
                    extensionCheck: false,
                })
            }
            var fileUrl = URL.createObjectURL(fileList).split()
            setCookie('video_file', fileUrl)
        }
        else {
            this.setState({
                errorMsg: "",
                extensionCheck: false,
            })
        }
    }

    startVideo = async () =>{
        if(this.state.userType === 'creator'){
            serverSocket.emit('start-video', {room_id:getCookie('room-id')})
        }
    }

    leaveRoom =() =>{
        if(getCookie('user-type') === 'joinee'){
            serverSocket.emit('remove-member',{username:this.state.username, roomID:this.state.roomID})
        }
        else{
            serverSocket.emit('remove-all-member',{username:this.state.username, roomID:this.state.roomID})
        }
    }

    handleMessageChange = (event) => {
        event.preventDefault()
        this.setState({
            message: event.target.value
        })
    }

    sendMsg = (event) =>{
        event.preventDefault()
        if(this.state.message !== ''){
            serverSocket.emit('send-message',{senderName:this.state.username, roomID:this.state.roomID, message:this.state.message})
        }
        document.getElementById("chat").value = ""
    }

    render() {
        var {roomDetails} = this.state
        var {messages} = this.state

        return (
            <div>

                <label>Browse file</label><br/>
                <input type="file" id="videofile" onChange={this.handleFile} />
                <div style={{ fontSize: '16px', margin: '5px' }}>
                    {this.state.extensionCheck ?
                        <div>
                            <h5 style={{ color: 'green' }}>{this.state.fileName}</h5>
                            {getCookie('user-type') === 'creator' && <button onClick={this.startVideo}>Start partying</button>}
                        </div>

                        : <h6 style={{ color: 'red' }}>{this.state.errorMsg}</h6>}
                </div>
                <h4>Room I.D.</h4>
                {this.state.roomID}
                <h4>Room Members</h4>
                {roomDetails !== '' && Object.keys(roomDetails.members).length > 0 && Object.keys(roomDetails.members).map((username)=>{
                    return (
                        <p key={username}>{username}</p>
                    )
                })}
                <h4>Text Channel</h4>
                {messages.length > 0 && messages.map((message)=>{
                    return(
                    <p key={message["messageNumber"]}>{message["senderName"]}:{message["message"]}</p>
                    )
                })}
                <input type="text" name='chat' id='chat' onChange={this.handleMessageChange}></input>
                <button onClick={this.sendMsg}>Send</button>
                <br/>
                <button onClick={this.leaveRoom}>Leave Room</button>
            </div>
        )
    }
}