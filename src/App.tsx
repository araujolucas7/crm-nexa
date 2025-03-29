
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Conversations from "./pages/Conversations";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ConversationProvider } from "./contexts/ConversationContext";
import { TaskProvider } from "./contexts/TaskContext";
import { DealProvider } from "./contexts/DealContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ConversationProvider>
          <TaskProvider>
            <DealProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/conversations" element={<Conversations />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </DealProvider>
          </TaskProvider>
        </ConversationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
