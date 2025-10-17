import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { logout as authLogout, getUser, type User } from "../services/storage/authStorage";

interface AuthContextType {
    readonly user: User | null;
    readonly isLoading: boolean;
    readonly isAuthenticated: boolean;
    readonly login: (user: User) => void;
    readonly logout: () => Promise<void>;
    readonly refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Vérifier si l'utilisateur est connecté au démarrage
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const currentUser = await getUser();
            setUser(currentUser);
        } catch (error) {
            console.error(error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback((newUser: User) => {
        setUser(newUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authLogout();
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        const currentUser = await getUser();
        setUser(currentUser);
    }, []);

    const value: AuthContextType = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
    }), [user, isLoading, login, logout, refreshUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook pour utiliser le contexte d'authentification
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Hook pour obtenir l'ID de l'utilisateur actuel (utilisé dans useEvents)
export function useCurrentUserId() {
    const { user } = useAuth();
    return user?.id || null;
}
