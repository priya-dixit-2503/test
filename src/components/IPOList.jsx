import React from 'react';
import IPOCard from './IPOCard';

const IPOList = () => {
  const ipoData = [
    { company: 'ABC Ltd', price: 400, date: '2025-06-12' },
    { company: 'XYZ Pvt', price: 650, date: '2025-06-20' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {ipoData.map((ipo, index) => (
        <IPOCard key={index} ipo={ipo} />
      ))}
    </div>
  );
};

export default IPOList;
