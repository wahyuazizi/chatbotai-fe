"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Simulate a guest session
      const guestUser = {
        id: "guest-" + new Date().getTime(),
        email: "guest@example.com",
        role: "guest",
      };
      // Store guest session in your auth context
      login(guestUser.id, guestUser.role);
      // Redirect to chat page
      router.push("/chat");
    } catch (err) {
      console.error("Guest login failed:", err);
      setError("Gagal masuk sebagai tamu.");
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      console.log("Login successful with Supabase:", data);
      // AuthContext will now listen to Supabase's auth state changes
      // No need to call login(access_token, role) here directly,
      // as AuthContext will handle it via onAuthStateChange.
      // The redirect will also be handled by AuthContext.

    } catch (err: unknown) {
      console.error("Login failed, error:", err);
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#49cc90]/20 via-white to-[#49cc90]/10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#49cc90]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#49cc90]/40 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-400/40 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-float animation-delay-2000"></div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-[#49cc90]/10 animate-slide-up">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-24 h-24 mb-6">
            <Image
              src="/logo_fakultas.png"
              alt="Logo Fakultas"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#49cc90] to-emerald-600 bg-clip-text text-transparent">
            Selamat Datang
          </CardTitle>
          <p className="text-gray-600 mt-2 font-semibold">Fakultas Teknik Universitas Hamzanwadi</p>
          <CardDescription className="text-gray-600 mt-2">
            Masuk untuk menggunakan chatbot kampus
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                Alamat Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#49cc90] transition-colors duration-200" />
                <Input
                  type="email"
                  id="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 border-gray-200 focus:border-[#49cc90] focus:ring-2 focus:ring-[#49cc90]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                Kata Sandi
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#49cc90] transition-colors duration-200" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Masukkan kata sandi Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-[#49cc90] focus:ring-2 focus:ring-[#49cc90]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#49cc90] transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#49cc90] focus:ring-[#49cc90]" />
                <span className="text-gray-600">Ingat saya</span>
              </label>
              {/* <a href="/forgot-password" className="text-[#49cc90] hover:text-emerald-600 font-medium transition-colors duration-200">
                Lupa kata sandi?
              </a> */}
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#49cc90] to-emerald-500 hover:from-[#3ba876] hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-[#49cc90]/25 hover:shadow-xl hover:shadow-[#49cc90]/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Masuk...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/80 px-2 text-gray-500">Atau</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full h-12 bg-white/80 border-gray-300 hover:bg-gray-100/80 text-gray-700 font-semibold rounded-lg transition-all duration-300"
          >
            Masuk sebagai Tamu
          </Button>
        </CardContent>
        
        <CardFooter className="pt-6">
          <div className="w-full text-center">
            <p className="text-gray-600 text-sm">
              Belum memiliki akun?{" "}
              <a 
                href="/register" 
                className="text-[#49cc90] hover:text-emerald-600 font-semibold transition-colors duration-200 hover:underline"
              >
                Daftar sekarang
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}