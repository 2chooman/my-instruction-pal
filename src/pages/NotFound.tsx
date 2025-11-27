import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Oops! Page not found</p>
      <a href="/">Return to Home</a>
    </div>
  );
};

export default NotFound;