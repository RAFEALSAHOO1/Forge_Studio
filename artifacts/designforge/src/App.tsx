import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import Customize from "@/pages/Customize";
import Confirmation from "@/pages/Confirmation";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyEmail from "@/pages/VerifyEmail";
import RequestPasswordReset from "@/pages/RequestPasswordReset";
import ResetPassword from "@/pages/ResetPassword";
import AdminPanel from "@/pages/AdminPanel";
import OwnerPanel from "@/pages/OwnerPanel";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/request-password-reset" component={RequestPasswordReset} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/browse" component={Browse} />
      <Route path="/admin">
        {() => (
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        )}
      </Route>
      <Route path="/owner">
        {() => (
          <AdminRoute>
            <OwnerPanel />
          </AdminRoute>
        )}
      </Route>
      <Route path="/customize/:id">
        {() => (
          <ProtectedRoute>
            <Customize />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/confirmation">
        {() => (
          <ProtectedRoute>
            <Confirmation />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <Router />
          </div>
        </WouterRouter>
        <Toaster position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
