import React from 'react';
import { NavLink } from 'react-router-dom';


const Navigation = () => {
   
   return (
      <div className="nav-container">
         
         <NavLink className="nav-link"  to="/">Home</NavLink>
         <NavLink className="nav-link" activeClassName="nav-link-active" to="/cases">Cases Maps</NavLink>
         <NavLink className="nav-link" activeClassName="nav-link-active" to="/deaths">Deaths Maps</NavLink>
         <NavLink className="nav-link" activeClassName="nav-link-active" to="/tests">Tests Maps</NavLink>
         <NavLink className="nav-link" activeClassName="nav-link-active" to="/hosp">Hospitalizations Maps</NavLink>
         
         <NavLink className="nav-link" activeClassName="nav-link-active" to="/map3">Timeline Animations</NavLink>
         <NavLink className="nav-link" activeClassName="nav-link-active" to="/charts">Charts</NavLink>
      </div>
   );
}

export default Navigation;