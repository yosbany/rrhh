import { NavLink } from 'react-router-dom';
import { Home, Users, DollarSign } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen px-4 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center">PayrollApp</h2>
      </div>
      
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <Home className="w-5 h-5" />
          Dashboard
        </NavLink>
        
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <Users className="w-5 h-5" />
          Empleados
        </NavLink>
        
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <DollarSign className="w-5 h-5" />
          Informes
        </NavLink>
      </nav>
    </aside>
  );
}