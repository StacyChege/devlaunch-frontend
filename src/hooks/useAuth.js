import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextInstance';

export default function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be executed exclusively inside an AuthProvider element wrap.');
    }

    return context;
}