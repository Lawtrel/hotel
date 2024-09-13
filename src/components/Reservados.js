import React, {useState} from 'react';
const Reservados = () => {
    //possivel api
    const [reservados, setReservados] = useState([
    { id: 1, visitante: 'James Frutas', sala: 'suite', date: '2024-09-13'},
    { id: 2, visitante: 'Elon Musk', sala: 'luxo', date: '2024-09-01'}
    ]);

    return (
        <div>
            <h2>Reservados</h2>
            <ul>
                {reservados.map(reservados => {
                    <li key={reservados.id}>
                        {reservados.visitante} - {reservados.sala} on {reservados.date}
                    </li>
                })}
            </ul>
        </div>
    );
};

export default Reservados;