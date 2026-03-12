import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Clock, ClipboardList, Briefcase, CreditCard } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useContext(AuthContext);

  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <Clock size={20} /> },
    { name: 'Leaves', path: '/leaves', icon: <Calendar size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Briefcase size={20} /> },
    { name: 'Timesheets', path: '/timesheets', icon: <ClipboardList size={20} /> },
    { name: 'Payroll', path: '/payroll', icon: <CreditCard size={20} /> },
  ];

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Attendance', path: '/my-attendance', icon: <Clock size={20} /> },
    { name: 'Leaves', path: '/my-leaves', icon: <Calendar size={20} /> },
    { name: 'Timesheets', path: '/my-timesheets', icon: <ClipboardList size={20} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 w-64 bg-white border-r border-gray-200 transition duration-200 ease-in-out`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">EMS Portal</h1>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => {
                if(window.innerWidth < 768) closeSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
