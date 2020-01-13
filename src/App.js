import React from 'react';
import MenuDetails from './component/MenuDetails.jsx' ;
import Listrest from './component/Listrest';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Register from './component/Register';
import Login from './component/Login';
import OrderHistory from './component/OrderHistory';



/**
 * 1. history.push(/:id) -> fetch data from location.
 * 2. history.push(/:id,state:{secretKey:"kjfhkjh"}) -> fetch data from location.
 * 3.In route path if we start the path with '/' then it appends the path after the port number. 
 */

function App() {
 
  return (
   
    <div>
     {/* <Listrest/> */}
      <Router>
        <Switch>
         <Route path="/orderhistory" exact component={OrderHistory}/>
          <Route path="/register" exact component ={Register}/>
          <Route path='/:id/items' exact component={MenuDetails}/>
          <Route path='/LogedIn' exact component={Listrest}/>
          <Route path="/" exact component={Login}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
