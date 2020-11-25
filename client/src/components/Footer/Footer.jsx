import React, { Component } from 'react';
import { FaBeer } from 'react-icons/fa';
import style from './Footer.module.css'

class Footer extends Component {
  render() {
    return <div className={style.footer}> @Copyright Video Party 2020 <FaBeer /></div>;
  }
} 

export default Footer;





