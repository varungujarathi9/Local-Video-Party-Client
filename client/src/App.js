
import './App.css';
import {navigate} from '@reach/router'
import Router from '../src/components/helper/router'
import ConfigData from './configs.json'
import VersionData from './version.json'

function App() {

  const showLog=()=>{
   navigate('/changelog')
  }

  return (
    <div className="App">
      <Router />
      <p style={{ position: "absolute", right: "15px", bottom: "0" }}>{ConfigData.ENVIRONMENT_TYPE !="Prod" && ConfigData.ENVIRONMENT_TYPE}</p>
      <span style={{ position: "absolute", right: "15px", bottom: "0",cursor:"pointer" }} onClick={showLog}>
        {VersionData.version}
      </span>
    </div>
  );
}




export default App;
