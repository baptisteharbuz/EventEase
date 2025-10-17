import SplashScreen from "../components/SplashScreen";
import { useAuth } from "../contexts/AuthContext";
import AuthFlow from "./flows/AuthFlow";
import MainAppFlow from "./flows/MainAppFlow";
import { useAppNavigation } from "./hooks/useAppNavigation";

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();
    const { handleLoginSuccess, handleSignupSuccess } = useAppNavigation();

    if (isLoading) {
        return <SplashScreen />;
    }

    if (!isAuthenticated) {
        return (
            <AuthFlow
                onLoginSuccess={handleLoginSuccess}
                onSignupSuccess={handleSignupSuccess}
            />
        );
    }

    return <MainAppFlow />;
}
