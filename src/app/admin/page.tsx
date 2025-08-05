"use client";

import { useState } from "react";
import { api, upload } from "@/lib/api";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Upload, Link, LogOut, FileText, Globe, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

export default function AdminPage() {
  const [fileToIngest, setFileToIngest] = useState<File | null>(null);
  const [urlToIngest, setUrlToIngest] = useState("");
  const [ingestMessage, setIngestMessage] = useState("");
  const [ingestError, setIngestError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const { logout, authToken } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToIngest(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setFileToIngest(file);
      }
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
      const response = await upload([fileToIngest], authToken);
      setIngestMessage(response.message || `PDF '${fileToIngest.name}' uploaded and ingestion started!`);
      setFileToIngest(null);
    } catch (err) {
      if (isAxiosError(err)) {
        setIngestError(err.response?.data?.message || "Failed to ingest PDF data");
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } else {
        setIngestError("An unexpected error occurred.");
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
      await api.post("/data/ingest", { urls: [urlToIngest] });
      setIngestMessage(`URL '${urlToIngest}' ingested successfully!`);
      setUrlToIngest("");
    } catch (err) {
      if (isAxiosError(err)) {
        setIngestError(err.response?.data?.message || "Failed to ingest URL data");
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } else {
        setIngestError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-emerald-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-500">Data Management Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => router.push('/chat')}
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Chat
              </Button>
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
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Status Messages */}
        {(ingestMessage || ingestError) && (
          <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
            {ingestMessage && (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>{ingestMessage}</span>
              </div>
            )}
            {ingestError && (
              <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>{ingestError}</span>
              </div>
            )}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* PDF Upload Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">PDF Upload</CardTitle>
                  <CardDescription className="text-gray-600">
                    Upload PDF documents for processing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleIngestPdf} className="space-y-6">
                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                    dragActive
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <Upload className={`mx-auto h-12 w-12 transition-colors duration-300 ${
                      dragActive ? "text-emerald-500" : "text-gray-400"
                    }`} />
                    <div className="mt-4">
                      <label htmlFor="pdf-file" className="cursor-pointer">
                        <span className="text-lg font-medium text-emerald-600 hover:text-emerald-500">
                          Choose a PDF file
                        </span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <Input
                        id="pdf-file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={loading}
                        className="sr-only"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">PDF files only</p>
                  </div>
                  
                  {fileToIngest && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {fileToIngest.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(fileToIngest.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !fileToIngest}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload PDF</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* URL Input Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">URL Ingestion</CardTitle>
                  <CardDescription className="text-gray-600">
                    Process content from web URLs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleIngestUrl} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="url-input" className="text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com/document"
                      value={urlToIngest}
                      onChange={(e) => setUrlToIngest(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 border-gray-300 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl transition-all duration-200"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !urlToIngest.trim()}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Process URL</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
