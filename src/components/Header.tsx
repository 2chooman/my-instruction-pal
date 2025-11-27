import { Link, useLocation } from 'react-router-dom';
import { Camera, User, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName?: string;
}

export const Header = ({ userName }: HeaderProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <header className="w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-medium text-foreground">
          <Camera className="h-5 w-5 text-primary" />
          <span>КреативикФото</span>
        </Link>

        {!isLoginPage && (
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/profile"
              className={`flex items-center gap-1 text-sm ${
                location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <User className="h-4 w-4" />
              Профиль
            </Link>
          </nav>
        )}

        {!isLoginPage && userName && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {userName}
            </span>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
