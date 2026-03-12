import React, { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { Users, Clock, Calendar, AlertCircle } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ employees: 0, leaves: 0, pendingLeaves: 0, projects: 0 });
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, leavesRes, projRes] = await Promise.all([
          api.get('/employees'),
          api.get('/leaves'),
          api.get('/projects')
        ]);
        
        const leavesData = leavesRes.data.data;
        const pending = leavesData.filter(l => l.status === 'pending').length;
        
        setStats({
          employees: empRes.data.total || 0,
          leaves: leavesRes.data.total || 0,
          pendingLeaves: pending,
          projects: projRes.data.total || 0
        });

        setRecentLeaves(leavesData.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const approveLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}/approve`);
      window.location.reload();
    } catch(e) {}
  };

  const rejectLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}/reject`);
      window.location.reload();
    } catch(e) {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your organization's statistics.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Employees" value={stats.employees} icon={<Users size={24} />} color="indigo" />
        <DashboardCard title="Pending Leaves" value={stats.pendingLeaves} icon={<AlertCircle size={24} />} color="yellow" />
        <DashboardCard title="Active Projects" value={stats.projects} icon={<Clock size={24} />} color="blue" />
        <DashboardCard title="Total Leaves" value={stats.leaves} icon={<Calendar size={24} />} color="purple" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Leave Requests</h2>
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {recentLeaves.length === 0 ? (
               <li className="px-6 py-4 text-sm text-gray-500 text-center">No recent leaves found.</li>
            ) : recentLeaves.map(leave => (
              <li key={leave._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{leave.userId?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{leave.leaveType} leave - {leave.reason}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <StatusBadge status={leave.status} />
                  {leave.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button onClick={() => approveLeave(leave._id)} className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 font-medium">Approve</button>
                      <button onClick={() => rejectLeave(leave._id)} className="text-xs px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100 font-medium">Reject</button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
