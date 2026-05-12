import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-brand">ShopCart</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {token ? (
            <>
              <Link to="/admin">Admin</Link>
              <span style={{ marginLeft: '1.5rem', fontWeight: 'bold' }}>Hi, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '1.5rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
