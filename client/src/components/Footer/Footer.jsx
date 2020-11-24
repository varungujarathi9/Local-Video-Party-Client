import React, { Component } from 'react';
import { FaBeer } from 'react-icons/fa';
import style from './Footer.module.css'

class Footer extends Component {
  render() {
    return <div className={style.footer}> @Copyright  Local Video Party <FaBeer /></div>;
  }
} 

export default Footer;





