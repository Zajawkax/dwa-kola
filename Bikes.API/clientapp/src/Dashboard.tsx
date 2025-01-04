import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const username = localStorage.getItem('displayName');
    const role = localStorage.getItem('role');

    return (
        <div className="dashboard-container">
            
            
            <div className="username">Witaj, {username}!</div>

            <div className="tile-container">
                <div className="tile">
                    <Link to="/user/reservations" className="tile-link">Moje Rezerwacje</Link>
                </div>
                <div className="tile">
                    <Link to="/pricing" className="tile-link">Aktualny Cennik</Link>
                </div>
                <div className="tile">
                    <Link to="/profile" className="tile-link">Zarządzaj Profilem</Link>
                </div>
            </div>
            
            <div className="bikes2-info-container">
                <div className="bike2">Dowiedz się więcej o naszych rowerach</div>
                <div className="bike2-cards-container">
                    <div className="bike2-card">
                        <div className="bike2-title">Rower Miejski</div>
                        <p>Idealny do codziennych dojazdów po mieście. Wygodny, z prostą konstrukcją i biegami, świetny na płaskie nawierzchnie.</p>
                    </div>
                    <div className="bike2-card">
                        <div className="bike2-title">Rower Górski</div>
                        <p>Stworzony z myślą o jeździe po nierównych nawierzchniach. Doskonały do off-roadu i trudniejszych warunków terenowych.</p>
                    </div>
                    <div className="bike2-card">
                        <div className="bike2-title">Rower Szosowy</div>
                        <p>Wysokiej jakości rower zaprojektowany do szybkiej jazdy po asfalcie. Lekki, aerodynamiczny i wygodny na długie trasy.</p>
                    </div>
                    <div className="bike2-card">
                        <div className="bike2-title">Rower Elektryczny</div>
                        <p>Nowoczesne rozwiązanie dla osób szukających wygody i wsparcia podczas jazdy. Wyposażony w silnik elektryczny, ułatwia pokonywanie długich tras, stromych wzniesień i miejskich korków. Doskonały zarówno do codziennych dojazdów, jak i rekreacyjnych wypraw, pozwalając na oszczędność energii i czerpanie przyjemności z jazdy. Idealny dla tych, którzy chcą połączyć aktywność fizyczną z nowoczesnymi technologiami.</p>
                    </div>
                    <div className="bike2-card">
                        <div className="bike2-title">Rower Gravelowy</div>
                        <p>Rower gravelowy to doskonałe połączenie roweru szosowego i górskiego, stworzony z myślą o jeździe po różnych nawierzchniach. Dzięki szerokim oponom, stabilnej ramie i wytrzymałości na nierówności, gravel jest świetnym wyborem na długie trasy po nieutwardzonych drogach, leśnych ścieżkach czy górskich szlakach. Idealny zarówno do jazdy po szosach, jak i na bardziej wymagających terenach, łącząc prędkość z wygodą.</p>
                    </div>
                    <div className="bike2-card">
                        <div className="bike2-title">Rower Hybrydowy</div>
                        <p>Rower hybrydowy łączy cechy roweru górskiego, miejskiego i szosowego, oferując wszechstronność i wygodę na każdej nawierzchni. Lekki i wytrzymały, sprawdzi się zarówno na asfalcie, jak i na utwardzonych ścieżkach. Dzięki ergonomicznej konstrukcji jest idealnym wyborem dla osób szukających uniwersalnego roweru do codziennego użytku, rekreacji oraz dłuższych wycieczek.</p>
                    </div>
                </div>
            </div>


           
            {role === 'Admin' && (
                <div style={{ marginTop: '15px' }}>
                    <h4>Panel Admina:</h4>
                    <Link to="/admin">Zarządzaj rowerami i rezerwacjami</Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
