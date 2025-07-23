import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useEmployeeLoginMutation } from "@/features/api/employeeApi.js";
import Waves from "./user/UIComponents/Waves";

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
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Animated Waves Background */}
      <div className="absolute inset-0 z-0">
        <Waves
          lineColor="#EB811F"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
      {/* Login Content */}
      <section className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EB811F]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#EB811F]/5 rounded-full blur-3xl"></div>
      </div>

        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/images/jmd_logo.jpeg"
                alt="JMD Logo"
                className="w-32 h-32 object-contain rounded-full shadow-lg border-4 border-amber-100 bg-white"
              />
            </div>
            {/* <h1 className="text-2xl font-bold text-gray-800 tracking-wide mb-2">JAI MATA DI STITCHING</h1> */}
            {/* <p className="text-gray-600 text-base font-light">Tailoring Excellence Since 2017</p> */}
          </div>

          {/* Login Card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.35)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1.5px solid rgba(235, 129, 31, 0.18)",
            }}
          >
            <div className="pb-6 pt-8 px-8">
              <h2 className="text-xl font-semibold text-[#202020] text-center mb-2">
            Login
              </h2>
              <p className="text-center text-[#828083] mb-6">
                {/* Enter your credentials to access the Employee Portal */}
              </p>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                  <Label htmlFor="emailOrMobile" className="text-sm font-medium text-[#202020]">
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
                      className="pl-10 h-12 border-[#EB811F]/20 focus:border-[#EB811F] focus:ring-[#EB811F]/20 transition-all duration-200 bg-white/50"
                  required
                />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828083] w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-[#202020]">
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
                      className="pl-10 pr-10 h-12 border-[#EB811F]/20 focus:border-[#EB811F] focus:ring-[#EB811F]/20 transition-all duration-200 bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#828083] hover:text-[#202020] transition-colors"
                >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
                  className="w-full h-12 bg-[#EB811F] hover:bg-[#202020] text-[#202020] hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-[#828083]">
              Need help? Contact {" "}
              <a 
                href="mailto:info@jmdtailors.com" 
                className="text-[#EB811F] hover:text-[#202020] transition-colors font-medium"
              >
                info@jmdtailors.com
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-2">&copy; 2025 JAI MATA DI STITCHING. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeLogin; 