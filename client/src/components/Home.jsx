import { navigate } from '@reach/router'
import React from 'react'
import { Button} from 'react-bootstrap'
import style from './Home.module.css'
import MovieLogo from '../images/movielogo.png'
export default class Home extends React.Component{    
    
    componentDidMount(){
        // clear localStorage on coming back to homepage
        sessionStorage.clear()
    }

    navigateToLogin = (userType) => (event) => {
        sessionStorage.setItem('user-type', userType)
        navigate('/login')
    }
   
    render(){
        
        return(
            <div className={style.home}>
                <div className={style.title}><img src={MovieLogo} alt="movieLogo" className={style.movieLogo}/></div>
                          
                <Button  onClick={this.navigateToLogin('creator')} style={{position:"relative",right:"10px"}}>Create Party</Button>
                <Button  onClick={this.navigateToLogin('joinee')}>Join Party</Button>   
                
            </div>
        )
    }
}