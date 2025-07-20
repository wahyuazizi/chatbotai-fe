"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { 
  Upload, 
  Link, 
  FileText, 
  Globe, 
  Shield, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Database,
  Activity,
  Users,
  BarChart3
} from "lucide-react";

export default function AdminPage() {
  const [fileToIngest, setFileToIngest] = useState<File | null>(null);
  const [urlToIngest, setUrlToIngest] = useState("");
  const [ingestMessage, setIngestMessage] = useState("");
  const [ingestError, setIngestError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState({
    totalDocuments: 127,
    totalUsers: 45,
    activeIngestions: 3,
    systemHealth: 98.5
  });
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else if (role !== "admin") {
      router.push("/chat");
    }
  }, [router, role]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToIngest(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === "application/pdf") {
      setFileToIngest(files[0]);
    }
  };

  const handleIngestPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngestMessage("");
    setIngestError("");
    setLoading(true);

    if (!fileToIngest) {
      setIngestError("Please select a PDF file to ingest.");
      setLoading(false);
      return;
    }

    try {
      const simulatedFilePath = `uploads/${fileToIngest.name}`;
      await api.post("/data/ingest", { filePath: simulatedFilePath });
      setIngestMessage(`PDF '${fileToIngest.name}' ingested successfully!`);
      setFileToIngest(null);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalDocuments: prev.totalDocuments + 1,
        activeIngestions: prev.activeIngestions + 1
      }));
    } catch (err: any) {
      setIngestError(err.response?.data?.message || "Failed to ingest PDF data");
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIngestUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngestMessage("");
    setIngestError("");
    setLoading(true);

    if (!urlToIngest.trim()) {
      setIngestError("Please enter a URL to ingest.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/data/ingest", { url: urlToIngest });
      setIngestMessage(`URL '${urlToIngest}' ingested successfully!`);
      setUrlToIngest("");
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalDocuments: prev.totalDocuments + 1,
        activeIngestions: prev.activeIngestions + 1
      }));
    } catch (err: any) {
      setIngestError(err.response?.data?.message || "Failed to ingest URL data");
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#49cc90]/10 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#49cc90]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#49cc90] to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#49cc90] to-emerald-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Data Management & Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#49cc90]" />
                  <span className="text-gray-600">System Health: {stats.systemHealth}%</span>
                </div>
              </div>
              
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Documents</p>
                  <p className="text-2xl font-bold text-[#49cc90]">{stats.totalDocuments}</p>
                </div>
                <Database className="w-8 h-8 text-[#49cc90]/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Users</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-emerald-600/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Ingestions</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeIngestions}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">System Health</p>
                  <p className="text-2xl font-bold text-green-600">{stats.systemHealth}%</p>
                </div>
                <Activity className="w-8 h-8 text-green-600/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        {ingestMessage && (
          <div className="mb-6 p-4 bg-[#49cc90]/10 border border-[#49cc90]/20 rounded-lg animate-slide-down">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-[#49cc90]" />
              <p className="text-[#49cc90] font-medium">{ingestMessage}</p>
            </div>
          </div>
        )}
        
        {ingestError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 font-medium">{ingestError}</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Ingest Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#49cc90] to-emerald-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">PDF Document Ingestion</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Upload PDF files for AI processing and analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleIngestPdf} className="space-y-6">
                <div>
                  <label htmlFor="pdf-file" className="block text-sm font-semibold text-gray-700 mb-3">
                    Select PDF Document
                  </label>
                  
                  {/* Drag & Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center ${
                      isDragging 
                        ? 'border-[#49cc90] bg-[#49cc90]/5' 
                        : 'border-gray-300 hover:border-[#49cc90]/50 hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-[#49cc90]' : 'text-gray-400'}`} />
                    
                    {fileToIngest ? (
                      <div className="space-y-2">
                        <p className="text-[#49cc90] font-medium">{fileToIngest.name}</p>
                        <p className="text-sm text-gray-500">
                          {(fileToIngest.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-gray-600 font-medium">
                          Drag & drop your PDF here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF files up to 50MB
                        </p>
                      </div>
                    )}
                    
                    <Input
                      id="pdf-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[#49cc90] to-emerald-500 hover:from-[#3ba876] hover:to-emerald-600 text-white font-semibold shadow-lg shadow-[#49cc90]/25 hover:shadow-xl hover:shadow-[#49cc90]/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={loading || !fileToIngest}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Document...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Ingest PDF Document</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* URL Ingest Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">Web URL Ingestion</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Extract and process content from web URLs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleIngestUrl} className="space-y-6">
                <div>
                  <label htmlFor="url-input" className="block text-sm font-semibold text-gray-700 mb-3">
                    Website URL
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com/article"
                      value={urlToIngest}
                      onChange={(e) => setUrlToIngest(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter a valid URL to extract and process web content
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={loading || !urlToIngest.trim()}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing URL...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5" />
                      <span>Ingest Web Content</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-[#49cc90] transition-colors duration-200" />
              <h3 className="font-semibold text-gray-800 mb-2">System Settings</h3>
              <p className="text-sm text-gray-600">Configure ingestion parameters and system preferences</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <h3 className="font-semibold text-gray-800 mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-gray-600">View detailed analytics and usage statistics</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
              <h3 className="font-semibold text-gray-800 mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and access permissions</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}