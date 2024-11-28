import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BikesList from './components/BikeList';
import BikeDetails from './components/BikeDetails';
import CreateBike from './components/CreateBike';
import EditBike from './components/EditBike';
import './App.css';

function App() {
    return (
        <div className="App">
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<BikesList />} />
                    <Route path="/details/:id" element={<BikeDetails />} />
                    <Route path="/create" element={<CreateBike />} />
                    <Route path="/edit/:id" element={<EditBike />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
