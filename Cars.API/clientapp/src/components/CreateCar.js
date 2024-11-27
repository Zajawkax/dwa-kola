import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './CarForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

function CreateCar() {
    const [car, setCar] = useState({
        brand: '',
        model: '',
        doorsNumber: '',
        luggageCapacity: '',
        engineCapacity: '',
        fuelType: '',
        productionDate: '',
        carFuelConsumption: '',
        bodyType: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCar({
            ...car,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (car.doorsNumber < 2 || car.doorsNumber > 10) {
            alert('Liczba drzwi musi być między 2 a 10');
            return;
        }
        if (car.luggageCapacity <= 0) {
            alert('Pojemność bagażnika musi być większa niż 0');
            return;
        }
        if (car.engineCapacity <= 0) {
            alert('Pojemność silnika musi być większa niż 0');
            return;
        }
        if (car.carFuelConsumption <= 0) {
            alert('Spalanie musi być większe niż 0');
            return;
        }

        axios
            .post('/api/cars', car)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Błąd podczas tworzenia samochodu:', error.response.data);
            });
    };

    return (
        <div className="car-form">
            <h2>Dodaj nowy samochód</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Marka:</label>
                    <input type="text" name="brand" value={car.brand} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Model:</label>
                    <input type="text" name="model" value={car.model} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Liczba drzwi:</label>
                    <input type="number" name="doorsNumber" value={car.doorsNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Pojemność bagażnika (l):</label>
                    <input type="number" name="luggageCapacity" value={car.luggageCapacity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Pojemność silnika (cm³):</label>
                    <input type="number" name="engineCapacity" value={car.engineCapacity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Rodzaj paliwa:</label>
                    <select name="fuelType" value={car.fuelType} onChange={handleChange} required>
                        <option value="">Wybierz</option>
                        <option value="Petrol">Benzyna</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybryda</option>
                        <option value="LPG">LPG</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Data produkcji:</label>
                    <input type="date" name="productionDate" value={car.productionDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Spalanie (l/100km):</label>
                    <input
                        type="number"
                        step="0.1"
                        name="carFuelConsumption"
                        value={car.carFuelConsumption}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Typ nadwozia:</label>
                    <select name="bodyType" value={car.bodyType} onChange={handleChange} required>
                        <option value="">Wybierz</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Kombi">Kombi</option>
                        <option value="SUV">SUV</option>
                        <option value="Roadster">Roadster</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    <FontAwesomeIcon icon={faSave} /> Dodaj samochód
                </button>
                <Link to="/" className="btn btn-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy samochodów
                </Link>
            </form>
        </div>
    );
}

export default CreateCar;
