import { Link, useLocation } from 'react-router-dom';
import { FileText, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-primary" />
              <FileText className="absolute -bottom-1 -right-1 h-4 w-4 text-accent" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Resume Screener
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};