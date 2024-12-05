import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import BikeList from "../Components/BikeList";
import Logowanie from "../Components/Logowanie";
import Main from "../Components/Main";
import Details from "../Components/BikeDetails";
import CreateBike from "../Components/CreateBike";
import Kontakt from "../Components/Kontakt";
import TermsOfService from "../Components/TermsOfService";
import FilterSort from "../Components/FilterSort";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Main /> },
            { path: "bikes", element: <BikeList /> },
            { path: "login", element: <Logowanie /> }, 
            { path: "details/:id", element: <Details /> },
            { path: "bikes/create-bike", element: <CreateBike /> },
            { path: "bikes/filtersort", element: <FilterSort /> },

            { path: "contact", element: <Kontakt /> },
            { path: "regulamin", element: <TermsOfService /> },

            /*{
                path: "add-car", element: <CarCreate onAddCar={function (car: Car):
                    void {
                throw new Error("Function not implemented.");
           }} />*/

           

            
        ]
            
    }
];

export const router = createBrowserRouter(routes);

