import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Eye, EyeOff, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { useEmployeeLoginMutation } from "@/features/api/employeeApi.js";

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [employeeLogin, { isLoading, isSuccess, isError, error, data }] = useEmployeeLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrMobile || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    await employeeLogin(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Login successful");
      navigate("/employee/dashboard");
    } else if (isError) {
      toast.error(error?.data?.message || "Login failed");
    }
  }, [isSuccess, isError, navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#fdfbff] via-[#f8e1d9] to-[#fef9f9] dark:from-gray-900 dark:to-[#7d3c3c] flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#f77f2f]/20 to-[#fca16a]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#f8a977]/20 to-[#f77f2f]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-[#f77f2f] to-[#fca16a] rounded-full p-3 shadow-lg mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f77f2f] to-[#fca16a] tracking-wide">
              Employee Portal
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emailOrMobile" className="text-sm font-medium">
                Email or Mobile Number
              </Label>
              <div className="relative">
                <Input
                  id="emailOrMobile"
                  name="emailOrMobile"
                  type="text"
                  value={formData.emailOrMobile}
                  onChange={handleChange}
                  placeholder="Enter your email or mobile"
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 focus:border-[#f77f2f] focus:ring-2 focus:ring-[#f8a977]/20 transition-all duration-200"
                  required
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 focus:border-[#f77f2f] focus:ring-2 focus:ring-[#f8a977]/20 transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg rounded-xl bg-gradient-to-r from-[#f77f2f] to-[#fca16a] hover:from-[#e96b12] hover:to-[#f98c3f] text-white font-bold shadow-xl transition-all duration-200 focus:ring-4 focus:ring-[#f8a977]/40 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Having trouble? Contact your administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin; 