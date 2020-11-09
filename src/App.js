import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './map1.css';
import Navigation from './components/navigation';
import UsMap3 from './components/usmap3';
import Home from './components/home';
import Cases from './components/cases';
import Deaths from './components/deaths';
import Tests from './components/tests';
import Hospitalizations from './components/hosp';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <div className="content">
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/cases" component={Cases} />
          <Route path="/deaths" component={Deaths} />
          <Route path="/tests" component={Tests} />
          <Route path="/hosp" component={Hospitalizations} />
          <Route path="/map3" component={UsMap3} />
        
        </Switch>
        </div>
      </div>
    </BrowserRouter>
 
  );
}

export default App;
