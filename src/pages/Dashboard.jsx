import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user.service';
import { ipoService } from '../services/ipo.service';
import ConnectionTest from '../components/ConnectionTest';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [ipos, setIpos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [ipoLoading, setIpoLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ipoList, userApplications] = await Promise.all([
          ipoService.getIpoList(),
          ipoService.getUserApplications()
        ]);
        setIpos(ipoList);
        setApplications(userApplications);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setIpoLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || ipoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Welcome, {user?.email}</h1>
            </div>
          </div>

          {/* Connection Test Section */}
          <ConnectionTest />

          {/* IPO Applications Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your IPO Applications</h2>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border p-4 rounded">
                    <h3 className="font-medium">{application.ipo_name}</h3>
                    <p className="text-sm text-gray-600">Status: {application.status}</p>
                    <p className="text-sm text-gray-600">Applied on: {new Date(application.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No applications yet.</p>
            )}
          </div>

          {/* Available IPOs Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Available IPOs</h2>
            {ipos.length > 0 ? (
              <div className="space-y-4">
                {ipos.map((ipo) => (
                  <div key={ipo.id} className="border p-4 rounded">
                    <h3 className="font-medium">{ipo.company_name}</h3>
                    <p className="text-sm text-gray-600">Price Range: ₹{ipo.price_range}</p>
                    <p className="text-sm text-gray-600">Open Date: {new Date(ipo.open_date).toLocaleDateString()}</p>
                    <button
                      onClick={() => navigate(`/ipo/${ipo.id}`)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No IPOs currently available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
