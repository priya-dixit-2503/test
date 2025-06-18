import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IpoList = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/ipo/')
      .then(response => {
        setIpos(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load IPOs');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-blue-600">Loading IPOs...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {ipos.map((ipo) => (
        <div key={ipo.id} className="p-4 bg-white rounded-2xl shadow">
          <img src={ipo.logo_url} alt={ipo.company_name} className="w-24 h-24 object-contain mb-2" />
          <h2 className="text-xl font-bold">{ipo.company_name}</h2>
          <p><strong>Price Band:</strong> {ipo.price_band}</p>
          <p><strong>Open Date:</strong> {ipo.open_date}</p>
          <p><strong>Close Date:</strong> {ipo.close_date}</p>
          <p><strong>Issue Size:</strong> {ipo.issue_size}</p>
          <p><strong>Issue Type:</strong> {ipo.issue_type}</p>
          <p><strong>Listing Date:</strong> {ipo.listing_date}</p>
        </div>
      ))}
    </div>
  );
};

export default IpoList;
