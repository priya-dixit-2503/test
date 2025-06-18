// src/pages/Home.jsx

import React from 'react';
import IPOCard from '../components/IPOCard';

const ipoData = [
  { company: "Company A", priceBand: "₹100–₹110" },
  { company: "Company B", priceBand: "₹150–₹160" },
  { company: "Company C", priceBand: "₹90–₹95" },
];

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming IPOs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ipoData.map((ipo, index) => (
          <IPOCard
            key={index}
            company={ipo.company}
            priceBand={ipo.priceBand}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
