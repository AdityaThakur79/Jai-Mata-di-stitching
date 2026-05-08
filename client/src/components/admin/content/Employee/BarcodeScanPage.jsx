import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetEmployeeByIdMutation } from "@/features/api/employeeApi";
import toast from "react-hot-toast";
import { ScanBarcode, AlertCircle } from "lucide-react";

const BarcodeScanPage = () => {
  const [scannedCode, setScannedCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [getEmployeeById] = useGetEmployeeByIdMutation();

  // Auto-focus input on mount and keep it focused
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle barcode scanner input
  const handleScan = async (e) => {
    if (e.key === "Enter" && scannedCode.trim()) {
      e.preventDefault();
      setIsProcessing(true);

      try {
        // Try to find employee by employeeId first
        const { data } = await getEmployeeById(scannedCode.trim());
        
        if (data?.success && data?.employee) {
          const employee = data.employee;
          
          // Add to recent scans
          setRecentScans(prev => [
            {
              id: employee._id,
              name: employee.name,
              employeeId: employee.employeeId,
              time: new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 4) // Keep last 5 scans
          ]);

          // Show success message
          toast.success(`Employee found: ${employee.name}`);
          
          // Redirect to employee detail page
          setTimeout(() => {
            navigate("/employee/employee-detail", {
              state: { employeeId: employee.employeeId },
            });
          }, 500);
        } else {
          toast.error("Employee not found. Please check the barcode.");
          setScannedCode("");
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      } catch (error) {
        console.error("Error scanning barcode:", error);
        toast.error("Error processing scan. Please try again.");
        setScannedCode("");
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Refocus input when clicking anywhere on the page
  const handlePageClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-4"
      onClick={handlePageClick}
    >
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <ScanBarcode className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Employee Barcode Scanner
          </h1>
          <p className="text-gray-600">
            Scan employee ID card barcode to view profile
          </p>
        </div>

        {/* Scanning Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scan or Enter Employee ID
          </label>
          <input
            ref={inputRef}
            type="text"
            value={scannedCode}
            onChange={(e) => setScannedCode(e.target.value)}
            onKeyDown={handleScan}
            placeholder="Position cursor here and scan barcode..."
            disabled={isProcessing}
            className="w-full px-4 py-4 text-lg border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-2">
            <AlertCircle className="inline w-3 h-3 mr-1" />
            Input will auto-focus. Use your barcode scanner to scan employee ID cards.
          </p>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center mb-6 text-orange-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-3"></div>
            <span>Processing scan...</span>
          </div>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Scans</h3>
            <div className="space-y-2">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-800">{scan.name}</p>
                    <p className="text-sm text-gray-600">ID: {scan.employeeId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{scan.time}</p>
                    <button
                      onClick={() => navigate("/employee/employee-detail", {
                        state: { employeeId: scan.employeeId },
                      })}
                      className="text-xs text-orange-600 hover:text-orange-700 underline"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-800 mb-2">How to use:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Ensure the input field above has focus (click it if needed)</li>
            <li>Use your barcode scanner to scan the employee ID card</li>
            <li>The system will automatically redirect to the employee profile</li>
            <li>If scanning doesn't work, manually type the employee ID and press Enter</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanPage;
