//export default FilterSort;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/FilterSort.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function FilterSort() {
    const [bikes, setBikes] = useState([]);
    const [filteredBikes, setFilteredBikes] = useState([]);
    const [filters, setFilters] = useState({
        bikeType: '',
        size: '',
        isElectric: false,
        availabilityStatus: true,
    });
    const [sortOption, setSortOption] = useState('');

    const navigate = useNavigate();

    // Fetch bikes from the API when the component mounts
    useEffect(() => {
        axios
            .get('https://localhost:7032/api/bikes')
            .then((response) => {
                setBikes(response.data);
                setFilteredBikes(response.data); // Initialize filtered bikes as the full list
            })
            .catch((error) => {
                console.error('Błąd podczas ładowania rowerów:', error);
            });
    }, []);

    // Filter bikes based on selected filters
    useEffect(() => {
        let filtered = [...bikes];

        if (filters.bikeType) {
            filtered = filtered.filter(bike => bike.bikeType === filters.bikeType);
        }
        if (filters.size) {
            filtered = filtered.filter(bike => bike.size === filters.size);
        }
        if (filters.isElectric) {
            filtered = filtered.filter(bike => bike.isElectric === filters.isElectric);
        }
        if (filters.availabilityStatus !== '') {
            filtered = filtered.filter(bike => bike.availabilityStatus === filters.availabilityStatus);
        }

        setFilteredBikes(filtered);
    }, [filters, bikes]);

    // Handle the filter change
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = value;

        if (type === 'checkbox') {
            newValue = checked;
        }

        setFilters({
            ...filters,
            [name]: newValue,
        });
    };

    // Handle the sort change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Sort bikes based on the selected sort option
    const handleSort = () => {
        let sortedBikes = [...filteredBikes];
        if (sortOption === 'hourlyRateAsc') {
            sortedBikes.sort((a, b) => a.hourlyRate - b.hourlyRate);
        } else if (sortOption === 'hourlyRateDesc') {
            sortedBikes.sort((a, b) => b.hourlyRate - a.hourlyRate);
        } else if (sortOption === 'dailyRateAsc') {
            sortedBikes.sort((a, b) => a.dailyRate - b.dailyRate);
        } else if (sortOption === 'dailyRateDesc') {
            sortedBikes.sort((a, b) => b.dailyRate - a.dailyRate);
        }
        setFilteredBikes(sortedBikes);
    };

    return (
        <div className="filter-sort">
           {/* <h3>Filtruj i Sortuj</h3>*/}

            <div className="filter-form">
                <form>
                    <div className="form-group">
                        <label>Typ roweru:</label>
                        <select name="bikeType" value={filters.bikeType} onChange={handleFilterChange}>
                            <option value="">Wszystkie</option>
                            <option value="Mountain">Górski</option>
                            <option value="Road">Szosowy</option>
                            <option value="Hybrid">Hybrida</option>
                            <option value="Electric">Elektryczny</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Rozmiar:</label>
                        <select name="size" value={filters.size} onChange={handleFilterChange}>
                            <option value="">Wszystkie</option>
                            <option value="Small">Mały</option>
                            <option value="Medium">Średni</option>
                            <option value="Large">Duży</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Czy elektryczny:</label>
                        <input
                            type="checkbox"
                            name="isElectric"
                            checked={filters.isElectric}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Dostępność:</label>
                        <input
                            type="checkbox"
                            name="availabilityStatus"
                            checked={filters.availabilityStatus}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="form-group">
                        <button type="button" onClick={handleSort} className="btn btn-primary">
                            Filtruj i Sortuj
                        </button>
                    </div>
                </form>
            </div>

            <div className="sort-form">
                
                <select value={sortOption} onChange={handleSortChange}>
                    <option value="">Wybierz opcję</option>
                    <option value="hourlyRateAsc">Stawka godzinowa rosnąco</option>
                    <option value="hourlyRateDesc">Stawka godzinowa malejąco</option>
                    <option value="dailyRateAsc">Stawka dzienna rosnąco</option>
                    <option value="dailyRateDesc">Stawka dzienna malejąco</option>
                </select>
                <button type="button" onClick={handleSort} className="btn btn-primary">
                    Sortuj
                </button>
            </div>

            <div className="bike-list">
                {filteredBikes.length === 0 ? (
                    <p className="brak">Brak rowerów spełniających wybrane kryteria.</p>
                ) : (
                    <ul>
                        {filteredBikes.map((bike) => (
                            <li key={bike.id}>
                                {bike.name} - {bike.bikeType} - {bike.size} - {bike.hourlyRate} zł/h - {bike.dailyRate} zł/dzień
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Link to="/bikes" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
            </Link>
        </div>
    );
}

export default FilterSort;
