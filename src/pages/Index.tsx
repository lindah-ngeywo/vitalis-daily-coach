import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { Activity } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Activity className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <Dashboard />;
};

export default Index;
