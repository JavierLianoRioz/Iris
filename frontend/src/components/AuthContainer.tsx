import { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import type { GoogleCredentialResponse, GoogleJwtPayload } from '../types/auth';
import type { User } from '../types/user';
import LoginCard from './ui/LoginCard';
import LoadingSpinner from './ui/LoadingSpinner';

const CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID";

const ALLOWED_DOMAIN = 'alumnos.uneatlantico.es';
const ALLOWED_EMAIL_SUFFIX = '@' + ALLOWED_DOMAIN;

function isAllowedDomain(payload: GoogleJwtPayload): boolean {
    return payload.hd === ALLOWED_DOMAIN || payload.email.endsWith(ALLOWED_EMAIL_SUFFIX);
}

export default function AuthContainer() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('irisUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('irisUser', JSON.stringify(user));
      if (window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    } else {
      localStorage.removeItem('irisUser');
      if (window.location.pathname === '/dashboard') {
        window.location.href = '/';
      }
    }
  }, [user]);

  const handleLoginSuccess = (credentialResponse: GoogleCredentialResponse) => {
    setIsLoading(true);
    try {
      if (!credentialResponse.credential) {
          throw new Error("No credential received");
      }
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
      
      if (!isAllowedDomain(decoded)) {
        setError(`El acceso está restringido exclusivamente a cuentas ${ALLOWED_DOMAIN}`);
        googleLogout();
        setUser(null);
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        subjects: []
      };
      setUser(newUser);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al procesar la autenticación.');
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    setError('Falló el inicio de sesión con Google. Inténtalo de nuevo.');
    setIsLoading(false);
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user && window.location.pathname === '/') {
    return (
        <LoginCard 
            error={error} 
            clientId={CLIENT_ID} 
            onSuccess={handleLoginSuccess} 
            onError={handleLoginError}
            hostedDomain="alumnos.uneatlantico.es"
        />
    );
  }
  
  return null;
}