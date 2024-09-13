import React, {useState} from 'react';
import Header from './components/Header';
import Salas from './components/Salas';
import Reservados from './components/Reservados';
import GuestForm from './components/GuestForm';
import ReservadosForm from './components/ReservadosForm';

function App() {
  const [guest, setGuest] = useState([]);
  const [reservados,setReservados] = useState([]);
  const addGuest = (name) => {
    setGuest([...guest, { id: guest.length + 1, name }]);
  };

  const addReservado = (reservados) => {
    setReservados([...reservados, { id: reservados.length + 1, ...reservados}]);
  };

  return (
    <div className="App">
      <Header />
      <Salas />
      <Reservados />
      <GuestForm addGuest={addGuest}/>
      <ReservadosForm addReservation={addReservado} />
    </div>
  );
}

export default App;
