import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import EmployeeIdCard from "./EmployeeIdCard";
const EmployeeIdCardPreview = ({ employee, onClose }) => {
  if (!employee) return null;

  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [profileImageDataUrl, setProfileImageDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const toDataUrl = async (url) => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const reader = new FileReader();
        return await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error('Error converting image to base64:', e);
        return null;
      }
    };

    const logoUrl = "/images/jmd_logo.jpeg";
    toDataUrl(logoUrl).then((dataUrl) => {
      if (isMounted) setLogoDataUrl(dataUrl || null);
    });

    // Convert profile image to base64 if it exists
    if (employee.profileImage && employee.profileImage.startsWith('http')) {
      toDataUrl(employee.profileImage).then((dataUrl) => {
        if (isMounted) setProfileImageDataUrl(dataUrl || null);
      });
    }

    // Set loading to false after a short delay to ensure images are processed
    setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 1000);

    return () => {
      isMounted = false;
    };
  }, [employee.profileImage]);

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
        <div className="flex-1 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Converting images to base64...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
              </div>
            </div>
          )}
          <PDFViewer
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            showToolbar={true}
            showNavbar={false}
          >
            <EmployeeIdCard 
              employee={employee} 
              logoDataUrl={logoDataUrl} 
              profileImageDataUrl={profileImageDataUrl}
            />
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
