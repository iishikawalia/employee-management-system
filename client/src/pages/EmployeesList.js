import React, { useEffect, useState } from 'react';
import api from '../services/api';

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees');
        setEmployees(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">A list of all employees in the system.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 font-medium transition-colors">
          Add Employee
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100 flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                 <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {loading ? (
                 <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
               ) : employees.length === 0 ? (
                 <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No employees found</td></tr>
               ) : employees.map(emp => (
                 <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                       <span className="text-sm text-gray-500">{emp.email}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department || '-'}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.position || '-'}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{emp.role}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <button className="text-indigo-600 hover:text-indigo-900 mx-3">Edit</button>
                     <button className="text-red-600 hover:text-red-900">Delete</button>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesList;
