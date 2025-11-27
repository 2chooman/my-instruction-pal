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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary transition-colors">
          <Camera className="h-6 w-6 text-primary" />
          <span>КреативикФото</span>
        </Link>

        {!isLoginPage && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/profile"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <User className="h-4 w-4" />
              Профиль
            </Link>
            <Link
              to="/deals"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith('/deals') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Image className="h-4 w-4" />
              Фотосессии
            </Link>
          </nav>
        )}

        {!isLoginPage && userName && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {userName}
            </span>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
