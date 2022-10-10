import React from "react";
import { Outlet, NavLink } from "react-router-dom";

import './App.css';

function App() {
  return (
    <div className="d-flex flex-column justify-content-evenly">
      <nav className="nav nav-pills">
        <li className="nav-item">
          <NavLink className="nav-link" to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/redis">Redis</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/tidb">Tidb</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/mongodb">Reportes</NavLink>
        </li>
      </nav>
      <Outlet />
    </div>
  )
}

export default App;
