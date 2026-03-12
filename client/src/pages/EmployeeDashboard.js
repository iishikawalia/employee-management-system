import React, { useEffect, useState, useContext } from 'react';
import DashboardCard from '../components/DashboardCard';
import { Clock, Calendar, ClipboardList } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { AuthContext } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ attendances: 0, leaves: 0, timesheets: 0 });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [attRes, leavesRes, timeRes] = await Promise.all([
          api.get('/attendance'),
          api.get('/leaves'),
          api.get('/timesheets')
        ]);
        
        setStats({
          attendances: attRes.data.total || 0,
          leaves: leavesRes.data.total || 0,
          timesheets: timeRes.data.total || 0
        });

        const attData = attRes.data.data || [];
        setRecentAttendance(attData.slice(0, 5));
        
        const today = new Date().toDateString();
        const todayAtt = attData.find(a => new Date(a.date).toDateString() === today);
        if (todayAtt && todayAtt.checkIn && !todayAtt.checkOut) {
          setIsCheckedIn(true);
        }

      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/check-in');
      setIsCheckedIn(true);
      window.location.reload();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleCheckOut = async () => {
    try {
      await api.put('/attendance/check-out');
      setIsCheckedIn(false);
      window.location.reload();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Here's your personal employment summary.</p>
        </div>
        <div className="flex space-x-3">
          {!isCheckedIn ? (
            <button onClick={handleCheckIn} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 font-medium">
              Check In
            </button>
          ) : (
            <button onClick={handleCheckOut} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 font-medium">
              Check Out
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <DashboardCard title="Total Attendances" value={stats.attendances} icon={<Clock size={24} />} color="blue" />
        <DashboardCard title="Leaves Applied" value={stats.leaves} icon={<Calendar size={24} />} color="purple" />
        <DashboardCard title="Timesheets Logged" value={stats.timesheets} icon={<ClipboardList size={24} />} color="indigo" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Attendance</h2>
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {recentAttendance.length === 0 ? (
               <li className="px-6 py-4 text-sm text-gray-500 text-center">No recent records found.</li>
            ) : recentAttendance.map(record => (
              <li key={record._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{new Date(record.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">
                    In: {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '--:--'} 
                    {` | `}
                    Out: {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '--:--'}
                  </p>
                </div>
                <div>
                  <StatusBadge status={record.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
