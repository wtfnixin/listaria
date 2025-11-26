import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  auth,
  loginWithEmail,
  registerWithEmail,
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
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

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginWithEmail(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
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
      await registerWithEmail(email, password, name);
      toast({
        title: "Account created!",
        description: "Welcome to Listaria.",
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
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
  };
  return errorMap[code] || "An error occurred. Please try again.";
}
