import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/CreateBike.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';


function CreateBike() {
    const [bike, setBike] = useState({
        name: '',
        size: '',
        bikeType: '',
        isElectric: false,
        hourlyRate: '',
        dailyRate: '',
        availabilityStatus: true,
    });

  


    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = value;
        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'number') {
            newValue = value === '' ? '' : parseFloat(value);
        }

        setBike({
            ...bike,
            [name]: newValue,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!bike.name) {
            alert('Nazwa jest wymagana');
            return;
        }
        if (!bike.size) {
            alert('Rozmiar jest wymagany');
            return;
        }
        if (!bike.bikeType) {
            alert('Typ roweru jest wymagany');
            return;
        }
        if (bike.hourlyRate <= 0) {
            alert('Stawka godzinowa musi być większa niż 0');
            return;
        }
        if (bike.dailyRate <= 0) {
            alert('Stawka dzienna musi być większa niż 0');
            return;
        }

        const bikeToSend = {
            ...bike,
            hourlyRate: parseFloat(bike.hourlyRate),
            dailyRate: parseFloat(bike.dailyRate),
            isElectric: bike.isElectric,
            availabilityStatus: bike.availabilityStatus,
        };

        console.log('Wysyłane dane roweru:', bikeToSend);
        
        const token = localStorage.getItem('authToken'); // Assuming you store the token in local storage

        axios
            .post('https://localhost:7032/api/bikes', bikeToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Błąd podczas tworzenia roweru:', error);
                if (error.response && error.response.data) {
                    alert(`Błąd: ${error.response.data}`);
                } else {
                    alert('Wystąpił błąd podczas tworzenia roweru.');
                }
            });

    };

    return (
        <div className="bike-form">
            <h16>Dodaj nowy rower</h16>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nazwa:</label>
                    <input type="text" name="name" value={bike.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Rozmiar:</label>
                    <select name="size" value={bike.size} onChange={handleChange} required>
                        <option value="">Wybierz</option>
                        <option value="Small">Mały</option>
                        <option value="Medium">Średni</option>
                        <option value="Large">Duży</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Typ roweru:</label>
                    <select name="bikeType" value={bike.bikeType} onChange={handleChange} required>
                        <option value="">Wybierz</option>
                        <option value="Mountain">Górski</option>
                        <option value="Road">Szosowy</option>
                        <option value="Hybrid">Hybrida</option>
                        <option value="Electric">Elektryczny</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Czy elektryczny:</label>
                    <input
                        type="checkbox"
                        name="isElectric"
                        checked={bike.isElectric}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Stawka godzinowa (zł):</label>
                    <input type="number" name="hourlyRate" value={bike.hourlyRate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Stawka dzienna (zł):</label>
                    <input type="number" name="dailyRate" value={bike.dailyRate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Dostępność:</label>
                    <input
                        type="checkbox"
                        name="availabilityStatus"
                        checked={bike.availabilityStatus}
                        onChange={handleChange}
                    />
                </div>
                
                <button type="submit" className="btn btn-primary">
                    <FontAwesomeIcon icon={faSave} /> Dodaj rower
                </button>
                <Link to="/bikes" className="btn btn-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
                </Link>
            </form>
        </div>
    );
}

export default CreateBike;
