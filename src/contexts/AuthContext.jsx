import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export function AuthProvider({ children }) {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    
    const login = async (userEmail, password) => {
        try {
            const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail,
                password,
            }),
            credentials: 'include',
            };

            const res = await fetch('/api/users/logon', options);
            const data = await res.json();

            if (res.status === 200 && data.name && data.csrfToken) {
            setEmail(data.name);
            setToken(data.csrfToken);

            return {
                success: true,
            };
            }

            return {
            success: false,
            error: `Authentication failed: ${data?.message}`,
            };
        } catch {
            return {
            success: false,
            error: 'Network error during login',
            };
        }
    };

    const logout = async () => {
        let result = {
            success: true,
        };
        
        if (token) {
            try {
                const response = await fetch('/api/user/logoff', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to log out');
                }
            } catch (error) {
                result = {
                    success: false,
                    error: `Logout failed: ${error.message}`,
                };
            }
        }

        setEmail('');
        setToken('');
        return result;
    };
    
    return (
        <AuthContext.Provider
            value={{
                email,
                token,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}