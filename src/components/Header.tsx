import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  userName?: string;
}

export const Header = ({ userName }: HeaderProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return null;

  return (
    <header style={{ 
      borderBottom: '1px solid #ccc', 
      padding: '10px 20px', 
      fontFamily: 'Times New Roman, serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold' }}>
          КреативикФото
        </Link>

        {!isLoginPage && (
          <nav>
            <Link
              to="/profile"
              style={{ 
                textDecoration: location.pathname === '/profile' ? 'underline' : 'none',
                color: '#000',
                marginRight: '20px'
              }}
            >
              Профиль
            </Link>
            {userName && <span>{userName}</span>}
          </nav>
        )}
      </div>
    </header>
  );
};