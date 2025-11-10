import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Logo from '@/shared/components/Logo';
import './Layout.css';

function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          {/* Menu hambúrguer */}
          <button 
            className="menu-icon" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo Teddy Open Finance */}
          <Logo height={40} />

          {/* Navegação central */}
          <nav className="layout-nav">
            <Link 
              to="/clients" 
              className={`nav-link ${isActive('/clients')}`}
            >
              Clientes
            </Link>
            <Link 
              to="/clients/selected" 
              className={`nav-link ${isActive('/clients/selected')}`}
            >
              Clientes selecionados
            </Link>
            <button 
              onClick={handleLogout} 
              className="nav-link logout-link"
            >
              Sair
            </button>
          </nav>

          {/* Saudação do usuário */}
          <div className="user-greeting">
            Olá, <strong>{user?.email?.split('@')[0] || 'Usuário'}!</strong>
          </div>
        </div>
      </header>

      {/* Sidebar/Drawer */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <Logo height={35} />
            <button className="sidebar-close" onClick={toggleSidebar}>×</button>
          </div>
          <nav className="sidebar-nav">
            <Link 
              to="/clients" 
              className={`sidebar-link ${isActive('/clients')}`}
              onClick={() => setSidebarOpen(false)}
            >
              Clientes
            </Link>
            <Link 
              to="/clients/selected" 
              className={`sidebar-link ${isActive('/clients/selected')}`}
              onClick={() => setSidebarOpen(false)}
            >
              Clientes selecionados
            </Link>
            <button 
              onClick={handleLogout} 
              className="sidebar-link logout-link"
            >
              Sair
            </button>
          </nav>
        </div>
      </div>

      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

