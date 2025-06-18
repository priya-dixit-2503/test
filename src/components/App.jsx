import React from 'react';
import IPOList from './components/IPOList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Upcoming IPOs</h1>
      <IPOList />
    </div>
  );
}

export default App;
