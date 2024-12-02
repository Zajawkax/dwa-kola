import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './BikeForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

function EditBike() {
    const [bike, setBike] = useState({
        name: '',
        size: '',
        bikeType: '',
        isElectric: false,
        hourlyRate: '',
        dailyRate: '',
        availabilityStatus: true,
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/bikes/${id}`)
            .then((response) => {
                setBike(response.data);
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania danych roweru:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBike({
            ...bike,
            [name]: type === 'checkbox' ? checked : value,
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

        axios
            .put(`/api/bikes/${id}`, bike)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Błąd podczas aktualizacji roweru:', error.response.data);
            });
    };

    return (
        <div className="bike-form">
            <h2>Edytuj rower</h2>
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
                    <FontAwesomeIcon icon={faSave} /> Zapisz zmiany
                </button>
                <Link to="/" className="btn btn-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
                </Link>
            </form>
        </div>
    );
}

export default EditBike;
