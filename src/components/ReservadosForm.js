import React, { useState } from 'react';

const ReservadosForm = ({ addReservation }) => {
  const [guest, setGuest] = useState('');
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addReservation({ guest, room, date });
    setGuest('');
    setRoom('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Guest Name" 
        value={guest}
        onChange={(e) => setGuest(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Room" 
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <input 
        type="date" 
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Add Reservation</button>
    </form>
  );
};

export default ReservadosForm;
