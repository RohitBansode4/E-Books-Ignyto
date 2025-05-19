import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import '../styles/globals.css'; // Import global styles
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Dynamically import Bootstrap JS on the client side only
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  return (
    <>
      <Component {...pageProps} />
      {/* Scroll to Top button visible across all pages */}      
    </>
  );
}

export default MyApp;

