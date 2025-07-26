"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
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
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, User, UserPlus, Check, X } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/chat");
      }
    }
  }, [isAuthenticated, role, loading, router]);

  // Password strength checker
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.match(/[a-z]/)) strength++;
    if (pwd.match(/[A-Z]/)) strength++;
    if (pwd.match(/[0-9]/)) strength++;
    if (pwd.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }
    
    if (passwordStrength < 3) {
      setError("Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.");
      return;
    }
    
    if (!acceptTerms) {
      setError("Harap menyetujui syarat dan ketentuan");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await api.post("/auth/register", { name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Pendaftaran gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-400";
    if (passwordStrength === 3) return "bg-yellow-400";
    if (passwordStrength === 4) return "bg-[#49cc90]";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Lemah";
    if (passwordStrength === 3) return "Cukup";
    if (passwordStrength === 4) return "Baik";
    return "Kuat";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#49cc90]/20 via-white to-emerald-400/10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#49cc90]/25 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-300/25 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-300/25 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-[#49cc90]/40 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/5 w-3 h-3 bg-emerald-400/40 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/3 right-2/3 w-2.5 h-2.5 bg-teal-400/30 rounded-full animate-float animation-delay-3000"></div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-lg relative z-10 backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-[#49cc90]/10 animate-slide-up">
        <CardHeader className="text-center pb-6">
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
            Daftar Akun
          </CardTitle>
          <p className="text-gray-600 mt-2 font-semibold">Fakultas Teknik Universitas Hamzanwadi</p>
          <CardDescription className="text-gray-600 mt-2">
            Buat akun untuk menggunakan chatbot kampus
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 block">
                Nama Lengkap
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#49cc90] transition-colors duration-200" />
                <Input
                  type="text"
                  id="name"
                  placeholder="Masukkan nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-11 border-gray-200 focus:border-[#49cc90] focus:ring-2 focus:ring-[#49cc90]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
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
                  className="pl-10 h-11 border-gray-200 focus:border-[#49cc90] focus:ring-2 focus:ring-[#49cc90]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                  placeholder="Buat kata sandi yang kuat"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#49cc90] focus:ring-2 focus:ring-[#49cc90]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#49cc90] transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Kekuatan kata sandi</span>
                    <span className={`font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength === 3 ? 'text-yellow-500' : 'text-[#49cc90]'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 block">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#49cc90] transition-colors duration-200" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Konfirmasi kata sandi Anda"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#49cc90] focus:ring-2 focus:ring-[#49cc90]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#49cc90] transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="flex items-center space-x-2 text-sm mt-1">
                  {passwordsMatch ? (
                    <>
                      <Check className="w-4 h-4 text-[#49cc90]" />
                      <span className="text-[#49cc90]">Kata sandi cocok</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Kata sandi tidak cocok</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-[#49cc90] focus:ring-[#49cc90] focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                Saya menyetujui{" "}
                <a href="/terms" className="text-[#49cc90] hover:text-emerald-600 font-medium transition-colors duration-200">
                  Syarat dan Ketentuan
                </a>{" "}
                serta{" "}
                <a href="/privacy" className="text-[#49cc90] hover:text-emerald-600 font-medium transition-colors duration-200">
                  Kebijakan Privasi
                </a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !acceptTerms}
              className="w-full h-12 bg-gradient-to-r from-[#49cc90] to-emerald-500 hover:from-[#3ba876] hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-[#49cc90]/25 hover:shadow-xl hover:shadow-[#49cc90]/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Membuat akun...</span>
                </div>
              ) : (
                "Buat Akun"
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="pt-4">
          <div className="w-full text-center">
            <p className="text-gray-600 text-sm">
              Sudah memiliki akun?{" "}
              <a 
                href="/login" 
                className="text-[#49cc90] hover:text-emerald-600 font-semibold transition-colors duration-200 hover:underline"
              >
                Masuk di sini
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
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}