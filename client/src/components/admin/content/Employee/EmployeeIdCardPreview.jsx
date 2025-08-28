import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import EmployeeIdCard from "./EmployeeIdCard";
const EmployeeIdCardPreview = ({ employee, onClose }) => {
  if (!employee) return null;

  const [logoDataUrl, setLogoDataUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const toDataUrl = async (url) => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        const blob = await response.blob();
        const reader = new FileReader();
        return await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        return null;
      }
    };

    const logoUrl = "/images/jmd_logo.jpeg";
    toDataUrl(logoUrl).then((dataUrl) => {
      if (isMounted) setLogoDataUrl(dataUrl || null);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Employee ID Card Preview - {employee.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            showToolbar={true}
            showNavbar={false}
          >
            <EmployeeIdCard employee={employee} logoDataUrl={logoDataUrl} />
          </PDFViewer>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Employee ID: {employee.employeeId} | Role: {employee.role}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeIdCardPreview;
