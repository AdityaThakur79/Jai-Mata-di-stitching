import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Loader2 } from 'lucide-react';
import SalarySlip from './SalarySlip';

const SalarySlipPreview = ({ isOpen, onClose, employee, salarySlip }) => {
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert logo to base64
  useEffect(() => {
    let isMounted = true;

    const convertLogoToBase64 = async () => {
      try {
        setIsLoading(true);
        const logoUrl = "/images/jmd_logo.jpeg";
        const response = await fetch(logoUrl, { cache: "no-store" });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const reader = new FileReader();
        
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        
        if (isMounted) {
          setLogoDataUrl(dataUrl);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error converting logo to base64:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isOpen) {
      convertLogoToBase64();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Salary Slip Preview - {employee?.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-[70vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading salary slip...</p>
              </div>
            </div>
          ) : (
            <PDFViewer
              style={{
                width: '100%',
                height: '70vh',
                border: 'none',
              }}
            >
              <SalarySlip
                employee={employee}
                salarySlip={salarySlip}
                logoDataUrl={logoDataUrl}
              />
            </PDFViewer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalarySlipPreview;
