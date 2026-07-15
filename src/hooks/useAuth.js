import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Use this hook in any component that needs the logged-in user or
// auth functions. Never import AuthContext directly in components
export default function useAuth() {
  const context = useContext(AuthContext);

  // This only throws if a component is used outside of AuthProvider —
  // helps catch setup mistakes early during development
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}