import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import DeclareRouter from './route';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <div className='flex bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-repeat flex-col'>
        <React.StrictMode>
            <Router>
                {/* <App /> */} // Change from App to DeclareRouter
                <DeclareRouter />
                <ToastContainer />
            </Router>
        </React.StrictMode>
    </div>,
);
