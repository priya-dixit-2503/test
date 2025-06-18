import React from 'react';

const IPOCard = ({ ipo }) => {
  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold">{ipo.company}</h2>
      <p><strong>Price:</strong> ₹{ipo.price}</p>
      <p><strong>Date:</strong> {ipo.date}</p>
    </div>
  );
};

export default IPOCard;
