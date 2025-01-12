import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import BikeList from "../Components/BikeList";
import Logowanie from "../Logowanie";
import Main from "../Components/Main";
import Details from "../Components/BikeDetails";
import CreateBike from "../Components/CreateBike";
import Kontakt from "../Components/Kontakt";
import TermsOfService from "../Components/TermsOfService";
import FilterSort from "../Components/FilterSort";
import MyReservations from '../Components/MyReservations';
import AdminPanel from '../Components/AdminPanel';
import Dashboard from '../Dashboard';
import UserProfile from "../Components/UserProfile";
import KontaktAdmin from "../Components/KontaktAdmin";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: 'admin', element: <AdminPanel /> },
            { path: 'user/reservations', element: <MyReservations /> },
            { path: "/", element: <Main /> },
            { path: "bikes", element: <BikeList /> },
            { path: "login", element: <Logowanie /> },
            { path: "details/:id", element: <Details /> },
            { path: "bikes/create-bike", element: <CreateBike /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "contact", element: <Kontakt /> },
            { path: "regulamin", element: <TermsOfService /> },
            { path: "profile", element: <UserProfile /> }, // Nowa trasa
            { path: "admin/messages", element: <KontaktAdmin/> }, // Nowa trasa
            
            
        ]
    }
];


export const router = createBrowserRouter(routes);

