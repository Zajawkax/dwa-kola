import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import './Styles/Header.css';

const options = [
    { key: 1, text: 'Gravelowe', value: 1 },
    { key: 2, text: 'Trekkingowe', value: 2 },
    { key: 3, text: 'Górskie', value: 3 },
    { key: 4, text: 'Szosowe', value: 4 },
    { key: 5, text: 'Wodne', value: 5 },
    { key: 6, text: 'Miejskie', value: 6 },
];

const Drop: React.FC = () => (
    <Menu.Item>
        <Dropdown text="Rodzaje rowerów" pointing="top left" className="custom-dropdown">
            <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/gravelowe">Gravelowe</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/trekkingowe">Trekkingowe</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/gorskie">Górskie</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/szosowe">Szosowe</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/wodne">Wodne</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/miejskie">Miejskie</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </Menu.Item>
);

export default Drop;