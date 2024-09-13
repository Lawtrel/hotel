import React from 'react';

const Header = () => {
    return (
        <header>
            <h1>Hotel Gabiru</h1>
            <nav>
                <ul>
                    <li><a href="/salas">Salas</a></li>
                    <li><a href="/reservados">Reservados</a></li>
                    <li><a href="/visitantes">Visitantes</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;