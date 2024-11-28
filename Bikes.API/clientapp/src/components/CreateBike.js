import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './BikeForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

function CreateBike() {
    const [bike, setBike] = useState({
        brand: '',
        model: '',
        doorsNumber: '',
        luggageCapacity: '',
        engineCapacity: '',
        fuelType: '',
        productionDate: '',
        bikeFuelConsumption: '',
        bodyType: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setBike({
            ...bike,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (bike.doorsNumber < 2 || bike.doorsNumber > 10) {
            alert('Liczba drzwi musi być między 2 a 10');
            return;
        }
        if (bike.luggageCapacity <= 0) {
            alert('Pojemność bagażnika musi być większa niż 0');
            return;
        }
        if (bike.engineCapacity <= 0) {
            alert('Pojemność silnika musi być większa niż 0');
            return;
        }
        if (bike.bikeFuelConsumption <= 0) {
            alert('Spalanie musi być większe niż 0');
            return;
        }

        axios
            .post('/api/bikes', bike)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Błąd podczas tworzenia samochodu:', error.response.data);
            });
    };

    return (
        <div className="bike-form">
            <h2>Dodaj nowy samochód</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Marka:</label>
                    <input type="text" name="brand" value={bike.brand} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Model:</label>
                    <input type="text" name="model" value={bike.model} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Liczba drzwi:</label>
                    <input type="number" name="doorsNumber" value={bike.doorsNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Pojemność bagażnika (l):</label>
                    <input type="number" name="luggageCapacity" value={bike.luggageCapacity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Pojemność silnika (cm³):</label>
                    <input type="number" name="engineCapacity" value={bike.engineCapacity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Rodzaj paliwa:</label>
                    <select name="fuelType" value={bike.fuelType} onChange={handleChange} required>
                        <option value="">Wybierz</option>
                        <option value="Petrol">Benzyna</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybryda</option>
                        <option value="LPG">LPG</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Data produkcji:</label>
                    <input type="date" name="productionDate" value={bike.productionDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Spalanie (l/100km):</label>
                    <input
                        type="number"
                        step="0.1"
                        name="bikeFuelConsumption"
                        value={bike.bikeFuelConsumption}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Typ nadwozia:</label>
                    <select name="bodyType" value={bike.bodyType} onChange={handleChange} required>
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

export default CreateBike;
