import React from 'react';
import logo from './logo.svg';
import './App.css';
import MenuDetails from './component/MenuDetails.jsx' ;
import Listrest from './component/Listrest';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


/**
 * 1. history.push(/:id) -> fetch data from location.
 * 2. history.push(/:id,state:{secretKey:"kjfhkjh"}) -> fetch data from location.
 */

function App() {
 
  return (
   
    <div>
     {/* <Listrest/> */}
      <Router>
        <Switch>
          <Route path='/' exact component={Listrest}/>
          <Route path='/:id/items' exact component={MenuDetails}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
