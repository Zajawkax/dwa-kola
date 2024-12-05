import React, { useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';


function App() {
   


    return (
        <>
            <NavBar /> {}
            <div style={{ marginTop: "10px"}}> {}
                <Outlet /> {}
            </div>
        </>
    );


   
           
   
}

export default App;
