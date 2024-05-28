import ReactDOM from 'react-dom/client';
import * as utils from "./Utils/utils";
import Router from './Utils/Router'
import React from 'react';
import './index.css';

//utils.checkAuthentication();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router />
);
