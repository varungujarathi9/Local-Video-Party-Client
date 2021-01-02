import Cookies from 'universal-cookie';
import ConfigData from '../../configs.json'

const cookies = new Cookies();
let cookieConfig

if(ConfigData.ENVIRONMENT_TYPE === 'Prod' || ConfigData.ENVIRONMENT_TYPE === "UAT"){
  cookieConfig = {path: "/", secure: true}
}
else{
  cookieConfig = {path: "/"}
}

function setCookie(key, value){
  console.log(value)
  cookies.set(key, unescape(JSON.stringify(value)), cookieConfig);
}

function getCookie(key){
    return unescape(cookies.get(key))
}

function removeAllCookies(){
  Object.keys(cookies.getAll()).map((key) => {
    cookies.remove(key)
    return (null)
  })
}

export {setCookie, getCookie, removeAllCookies}