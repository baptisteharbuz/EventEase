import { useState } from "react";
import LoginScreen from "../../features/auth/LoginScreen";
import SignupScreen from "../../features/auth/SignupScreen";

interface AuthFlowProps {
  readonly onLoginSuccess: () => void;
  readonly onSignupSuccess: () => void;
}

export default function AuthFlow({ onLoginSuccess, onSignupSuccess }: AuthFlowProps) {
  const [currentAuthScreen, setCurrentAuthScreen] = useState<"login" | "signup">("login");

  if (currentAuthScreen === "signup") {
    return (
      <SignupScreen
        onSignupSuccess={onSignupSuccess}
        onNavigateToLogin={() => setCurrentAuthScreen("login")}
      />
    );
  }

  return (
    <LoginScreen
      onLoginSuccess={onLoginSuccess}
      onNavigateToSignup={() => setCurrentAuthScreen("signup")}
    />
  );
}