import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeesList from './pages/EmployeesList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route element={<DashboardLayout requiredRole="admin" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/employees" element={<EmployeesList />} />
            {/* Fallbacks given time constraints, reuse lists etc. */}
            <Route path="/attendance" element={<div className="p-4">Admin Attendance View</div>} />
            <Route path="/leaves" element={<div className="p-4">Admin Leaves View</div>} />
            <Route path="/projects" element={<div className="p-4">Projects View</div>} />
            <Route path="/timesheets" element={<div className="p-4">Timesheets View</div>} />
            <Route path="/payroll" element={<div className="p-4">Payroll System View</div>} />
          </Route>

          {/* Employee Routes */}
          <Route element={<DashboardLayout requiredRole="employee" />}>
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            {/* Fallbacks */}
            <Route path="/my-attendance" element={<div className="p-4">My Attendance</div>} />
            <Route path="/my-leaves" element={<div className="p-4">My Leaves</div>} />
            <Route path="/my-timesheets" element={<div className="p-4">My Timesheets</div>} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
