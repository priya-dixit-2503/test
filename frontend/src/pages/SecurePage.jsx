import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function SecurePage() {
  const [ipos, setIpos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    company_logo: '',
    ipos: [
      {
        price_band: '',
        open_date: '',
        close_date: '',
        issue_size: '',
        issue_type: '',
        listing_date: '',
        status: 'Pending',
        ipo_price: '',
        listing_price: '',
        listing_gain: '',
        current_market_price: '',
        current_return: '',
        documents: [{ rhp_pdf: '', drhp_pdf: '' }]
      }
    ]
  });

  const token = localStorage.getItem('access_token');

  const fetchIPOs = useCallback(() => {
    axios.get('http://127.0.0.1:8000/api/ipo/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setIpos(res.data));
  }, [token]);

  useEffect(() => {
    if (token) fetchIPOs();
  }, [fetchIPOs]);

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/ipo/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(fetchIPOs);
  };

  const handleUpdate = (id) => {
    axios.put(`http://127.0.0.1:8000/api/ipo/${id}/`, editData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then(() => {
      setEditingId(null);
      fetchIPOs();
    }).catch((err) => {
      console.error("Update error:", err);
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    axios.post(`http://127.0.0.1:8000/api/ipo/`, newCompany, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }).then(() => {
      setShowForm(false);
      setNewCompany({
        company_name: '',
        company_logo: '',
        ipos: [
          {
            price_band: '',
            open_date: '',
            close_date: '',
            issue_size: '',
            issue_type: '',
            listing_date: '',
            status: 'Pending',
            ipo_price: '',
            listing_price: '',
            listing_gain: '',
            current_market_price: '',
            current_return: '',
            documents: [{ rhp_pdf: '', drhp_pdf: '' }]
          }
        ]
      });
      fetchIPOs();
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">IPO Dashboard</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? 'Close Form' : 'Register IPO'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-2 mb-6 border p-4 rounded shadow">
          <input
            type="text"
            placeholder="Company Name"
            className="border p-2 w-full"
            value={newCompany.company_name}
            onChange={e => setNewCompany({ ...newCompany, company_name: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Company Logo URL"
            className="border p-2 w-full"
            value={newCompany.company_logo}
            onChange={e => setNewCompany({ ...newCompany, company_logo: e.target.value })}
            required
          />
          {Object.entries(newCompany.ipos[0]).map(([key, value]) => {
            if (key === 'documents') {
              return (
                <div key="documents" className="space-y-2">
                  <input
                    type="url"
                    placeholder="RHP PDF"
                    className="border p-2 w-full"
                    value={value[0].rhp_pdf}
                    onChange={e => {
                      const updated = { ...newCompany };
                      updated.ipos[0].documents[0].rhp_pdf = e.target.value;
                      setNewCompany(updated);
                    }}
                    required
                  />
                  <input
                    type="url"
                    placeholder="DRHP PDF"
                    className="border p-2 w-full"
                    value={value[0].drhp_pdf}
                    onChange={e => {
                      const updated = { ...newCompany };
                      updated.ipos[0].documents[0].drhp_pdf = e.target.value;
                      setNewCompany(updated);
                    }}
                    required
                  />
                </div>
              );
            }
            return (
              <input
                key={key}
                type={key.includes("date") ? "date" : "text"}
                placeholder={key.replaceAll('_', ' ')}
                className="border p-2 w-full"
                value={value}
                onChange={e => {
                  const updated = { ...newCompany };
                  updated.ipos[0][key] = e.target.value;
                  setNewCompany(updated);
                }}
                required
              />
            );
          })}
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Submit IPO
          </button>
        </form>
      )}

      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Price Band</th>
            <th className="border p-2">Open</th>
            <th className="border p-2">Close</th>
            <th className="border p-2">IPO Price</th>
            <th className="border p-2">Current Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ipos.map(ipo => (
            <tr key={ipo.id}>
              <td className="border p-2">{ipo.id}</td>
              <td className="border p-2">{ipo.company_name}</td>
              <td className="border p-2">{ipo.ipos[0]?.price_band}</td>
              <td className="border p-2">{ipo.ipos[0]?.open_date}</td>
              <td className="border p-2">{ipo.ipos[0]?.close_date}</td>
              <td className="border p-2">{ipo.ipos[0]?.ipo_price}</td>
              <td className="border p-2">{ipo.ipos[0]?.current_market_price}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  onClick={() => {
                    setEditData(ipo.ipos[0]);
                    setEditingId(ipo.ipos[0]?.id);
                    //handleUpdate(ipo.ipos[0]?.id)
                  }}
                >Edit</button>
                <button
                  className="bg-red-600 text-white px-2 py-1"
                  onClick={() => handleDelete(ipo.ipos[0]?.id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SecurePage;
