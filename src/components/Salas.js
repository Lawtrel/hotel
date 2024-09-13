import React, {useState, useEffect} from 'react';

const Salas = () => {
    const [salas, setSalas] = useState([]);
    useEffect(() =>{
        // possivel Api para carregar quartos
        setSalas([
            { id: 1, name: "Suite", preco: 500},
            { id: 2, name: "Padrao", preco: 150},
            { id: 3, name: "Luxo", preco: 900},
        ]);
    }, []);
    return (
        <div>
            <h2>Salas Disponivel</h2>
            <ul>
                {salas.map(salas => (
                    <li key={salas.id}>
                        {salas.name} - ${salas.preco} por noite
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Salas;