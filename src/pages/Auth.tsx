import { useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowRight, Shield } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Bitte gültige E-Mail-Adresse eingeben").max(255),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
  email: z.string().email("Bitte gültige E-Mail-Adresse eingeben").max(255),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, signIn, signUp, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if redirected from admin login
  const isAdminLogin = searchParams.get("admin") === "true";

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect logged-in users appropriately
  // IMPORTANT: Admin users should only be redirected to /admin when they explicitly came from the admin login.
  if (user) {
    if (isAdminLogin) {
      return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const { error, data } = await signIn(values.email, values.password);

    if (error) {
      toast({
        title: "Anmeldefehler",
        description: error.message === "Invalid login credentials" 
          ? "Ungültige E-Mail oder Passwort" 
          : error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Check if user has admin role
    if (data?.user) {
      const { data: hasAdminRole } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });

      if (isAdminLogin) {
        // User came from /admin/login, so enforce admin-only access
        if (hasAdminRole) {
          toast({
            title: "Admin Login erfolgreich!",
            description: "Willkommen im Admin-Dashboard",
          });
          navigate("/admin");
        } else {
          toast({
            title: "Zugriff verweigert",
            description: "Sie haben keine Admin-Berechtigung.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      } else {
        // Normal login always goes to the main site (even for admins)
        toast({
          title: "Erfolgreich angemeldet!",
          description: "Willkommen zurück",
        });
        navigate("/");
      }
    }
    setIsLoading(false);
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    const { error } = await signUp(values.email, values.password, values.fullName);

    if (error) {
      toast({
        title: "Registrierungsfehler",
        description: error.message === "User already registered" 
          ? "Diese E-Mail-Adresse ist bereits registriert" 
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erfolgreich registriert!",
        description: "Sie können sich jetzt anmelden",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-light p-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 ${isAdminLogin ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-gradient-hero'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isAdminLogin ? (
              <Shield className="w-8 h-8 text-white" />
            ) : (
              <span className="text-white font-bold text-2xl">U</span>
            )}
          </div>
          <CardTitle className="text-2xl">
            {isAdminLogin ? "Admin Login" : "Umzugscheck.ch"}
          </CardTitle>
          <CardDescription>
            {isAdminLogin 
              ? "Zugang zum Admin-Dashboard" 
              : "Melden Sie sich an oder erstellen Sie ein Konto"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Anmelden</TabsTrigger>
              <TabsTrigger value="signup">Registrieren</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail-Adresse</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="email" 
                              placeholder="max@beispiel.ch" 
                              {...field} 
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Wird angemeldet..." : "Anmelden"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vor- und Nachname</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="Max Mustermann" 
                              {...field} 
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail-Adresse</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="email" 
                              placeholder="max@beispiel.ch" 
                              {...field} 
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passwort bestätigen</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Wird registriert..." : "Konto erstellen"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
