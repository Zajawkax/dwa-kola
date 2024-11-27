import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CarsList from './components/CarList';
import CarDetails from './components/CarDetails';
import CreateCar from './components/CreateCar';
import EditCar from './components/EditCar';
import './App.css';

function App() {
    return (
        <div className="App">
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<CarsList />} />
                    <Route path="/details/:id" element={<CarDetails />} />
                    <Route path="/create" element={<CreateCar />} />
                    <Route path="/edit/:id" element={<EditCar />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
