import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/FilterSort.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Bike {
    bikeId: number;
    name: string;
    size: string; // Small, Medium, Large
    bikeType: string; // Mountain, Road, Hybrid, Electric
    isElectric: boolean;
    availabilityStatus: boolean;
    hourlyRate: number;
    dailyRate: number;
}

interface FilterSortProps {
    bikes: Bike[];
    onFilteredBikes: (filtered: Bike[]) => void;
}

const FilterSort: React.FC<FilterSortProps> = ({ bikes, onFilteredBikes }) => {
    const [filters, setFilters] = useState({
        bikeType: '',
        size: '',
        isElectric: false,
        availabilityStatus: true,
    });
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        applyFiltersAndSort();
    }, [filters, sortOption]);

    /**
     * Aktualizacja filtrów
     * Obsługuje zarówno checkboxy, jak i selecty
     */
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        let newValue: string | boolean = e.target.value;

        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            newValue = e.target.checked;
        }

        setFilters((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    /**
     * Zmiana opcji sortowania
     */
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    /**
     * Zastosowanie filtrów i sortowania
     */
    const applyFiltersAndSort = () => {
        let filteredBikes = [...bikes];

        // Filtrowanie
        if (filters.bikeType) {
            filteredBikes = filteredBikes.filter((bike) => bike.bikeType === filters.bikeType);
        }
        if (filters.size) {
            filteredBikes = filteredBikes.filter((bike) => bike.size === filters.size);
        }
        if (filters.isElectric) {
            filteredBikes = filteredBikes.filter((bike) => bike.isElectric === filters.isElectric);
        }
        if (filters.availabilityStatus !== null) {
            filteredBikes = filteredBikes.filter((bike) => bike.availabilityStatus === filters.availabilityStatus);
        }

        // Sortowanie
        if (sortOption === 'hourlyRateAsc') {
            filteredBikes.sort((a, b) => a.hourlyRate - b.hourlyRate);
        } else if (sortOption === 'hourlyRateDesc') {
            filteredBikes.sort((a, b) => b.hourlyRate - a.hourlyRate);
        } else if (sortOption === 'dailyRateAsc') {
            filteredBikes.sort((a, b) => a.dailyRate - b.dailyRate);
        } else if (sortOption === 'dailyRateDesc') {
            filteredBikes.sort((a, b) => b.dailyRate - a.dailyRate);
        }

        onFilteredBikes(filteredBikes);
    };

    return (
        <div className="filter-sort">
            <h3>Filtrowanie i sortowanie</h3>

            {/* Formularz filtrowania */}
            <div className="filter-form">
                <form>
                    <div className="form-group">
                        <label>Typ roweru:</label>
                        <select name="bikeType" value={filters.bikeType} onChange={handleFilterChange}>
                            <option value="">Wszystkie</option>
                            <option value="Mountain">Górski</option>
                            <option value="Road">Szosowy</option>
                            <option value="Hybrid">Hybrydowy</option>
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
                </form>
            </div>

            {/* Formularz sortowania */}
            <div className="sort-form">
                <label>Sortowanie:</label>
                <select value={sortOption} onChange={handleSortChange}>
                    <option value="">Wybierz opcję</option>
                    <option value="hourlyRateAsc">Stawka godzinowa rosnąco</option>
                    <option value="hourlyRateDesc">Stawka godzinowa malejąco</option>
                    <option value="dailyRateAsc">Stawka dzienna rosnąco</option>
                    <option value="dailyRateDesc">Stawka dzienna malejąco</option>
                </select>
            </div>

            {/* Powrót do listy rowerów */}
            <Link to="/bikes" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
            </Link>
        </div>
    );
};

export default FilterSort;
