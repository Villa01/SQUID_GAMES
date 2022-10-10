import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Routes } from "react-router-dom";

import './index.css';

import App from './App';
import { HomePage } from './routes/HomePage';
import { Redis } from './routes/Redis';
import { Tidb } from './routes/Tidb';
import { Mongodb } from './routes/Mongodb';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<HomePage />}></Route>
        <Route path='/redis' element={<Redis />}></Route>
        <Route path='/tidb' element={<Tidb />}></Route>
        <Route path='/mongodb' element={<Mongodb />}></Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Oops! Wrong address.</p>
            </main>
          }
        />
      </Route>

    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
