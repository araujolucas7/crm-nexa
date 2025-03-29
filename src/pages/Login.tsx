
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDemoLogin = async (demoEmail: string) => {
    setIsSubmitting(true);
    
    try {
      const success = await login(demoEmail, "senha123");
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                N
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Nexa Automations</CardTitle>
            <CardDescription>CRM Conversacional</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou entre como</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => handleDemoLogin("admin@nexaautomations.com")}
                disabled={isSubmitting}
              >
                Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoLogin("maria@nexaautomations.com")}
                disabled={isSubmitting}
              >
                Atendente
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
