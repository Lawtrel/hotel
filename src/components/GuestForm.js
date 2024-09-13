import React, { useState } from 'react';

const GuestForm = ({ addGuest }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addGuest(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Nome do Visitante" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Guest</button>
    </form>
  );
};

export default GuestForm;
