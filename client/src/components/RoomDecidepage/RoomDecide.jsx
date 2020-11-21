import { navigate } from '@reach/router'
import React from 'react'
// import {userContext} from '../helper/usercontext'
import {socket} from '../helper/socketfile'

import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'
import {   Button  } from 'react-bootstrap';
export default class DecideRoom extends React.Component{    
    
    constructor(props){
        super(props)
           
    }
    
    

    componentDidMount(){
       localStorage.removeItem('roomId')
    }
   

    navigateCreateRoom = ()=>{
            socket.emit('my_roomId')
            this.displayRoomId()
            navigate('/createroom')                    
    }
    

    displayRoomId =() =>{
        socket.on('emitRoomId',(roomId)=>{   
         
               localStorage.setItem('roomId',roomId.roomid)
               navigate('/createroom')    
            
        })
    }
    
   

        navigateOut =() =>{
            localStorage.removeItem('username')            
            navigate('/',{replace:true})
        }

   
        render(){
           
            
        return(
            <div>
                
                <h1>Hello {localStorage.getItem('username')}</h1>
                <Button variant="outline-info">Create Room</Button>
                <Button variant="outline-info">Join Room</Button>
                <Button variant="outline-info">Logout</Button>
                


                <button  onClick={this.navigateCreateRoom}>Create Room</button>
                <button  onClick={()=>navigate('/joinroom')}>Join Room</button>
                <button  onClick={this.navigateOut}>Logout</button>
            </div>
        )
            }
}