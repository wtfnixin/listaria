import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  auth,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
  onAuthChange,
} from "@/lib/firebase";
import { userApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!isMounted) return;

      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        try {
          await userApi.createProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || undefined,
          });
        } catch (error) {
          console.log("User profile already exists or API not available");
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with email:", email);
      await loginWithEmail(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = getErrorMessage(error.code);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log("Attempting registration with email:", email);
      await registerWithEmail(email, password, name);
      toast({
        title: "Account created!",
        description: "Welcome to Listaria.",
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMessage = getErrorMessage(error.code);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginGoogleHandler = async () => {
    try {
      console.log("Attempting Google login...");
      await loginWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
    } catch (error: any) {
      console.error("Google login failed:", error);
      const errorMessage = getGoogleErrorMessage(error.code);
      toast({
        title: "Google Sign-In failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout");
      await firebaseLogout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginGoogle: loginGoogleHandler,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function getErrorMessage(code: string): string {
  const errorMap: Record<string, string> = {
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "User account has been disabled",
    "auth/user-not-found": "Email not found. Please register first.",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already in use",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/operation-not-allowed": "This operation is not allowed",
    "auth/too-many-requests": "Too many login attempts. Please try again later.",
    "auth/missing-email": "Email is required",
    "auth/missing-password": "Password is required",
  };
  return errorMap[code] || `Error: ${code || "An error occurred. Please try again."}`;
}

function getGoogleErrorMessage(code: string): string {
  const errorMap: Record<string, string> = {
    "auth/configuration-not-found": "Google Sign-In is not configured. Please enable it in Firebase Console and add this domain to authorized domains.",
    "auth/popup-blocked": "Sign-in popup was blocked. Please allow popups and try again.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
    "auth/operation-not-supported-in-this-environment": "Google Sign-In is not supported in this environment.",
  };
  return errorMap[code] || "Google Sign-In failed. Please try again.";
}
