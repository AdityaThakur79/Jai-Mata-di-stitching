import React, { useEffect, useRef } from "react";

const EmployeeIdCard = ({ employee }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (employee?.employeeId && barcodeRef.current) {
      // Create barcode using HTML5 Canvas
      const canvas = barcodeRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = 132; // 35mm at 96dpi
      canvas.height = 34;  // 9mm at 96dpi
      
      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw simple barcode representation
      ctx.fillStyle = '#000000';
      const barWidth = 2;
      const barHeight = 30;
      const startX = 10;
      const startY = 2;
      
      // Generate simple barcode pattern
      for (let i = 0; i < 50; i++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(startX + i * barWidth, startY, barWidth, barHeight);
        }
      }
    }
  }, [employee]);

  // Default employee data for demo
  const defaultEmployee = {
    name: "John Doe",
    role: "Software Engineer",
    employeeId: "EMP001",
    mobile: "+91 9876543210",
    email: "john.doe@company.com",
    joiningDate: "2024-01-15",
    address: "123 Main St, City, State 12345",
    gender: "Male",
    emergencyName: "Jane Doe",
    emergencyMobile: "+91 9876543211",
    profileImage: null
  };

  const emp = employee || defaultEmployee;
  const joinDate = emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "—";

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className="relative overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          width: '85mm',
          height: '125mm',
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
          // border: '2px solid #ff6f00',
          borderRadius: '15px',
          boxShadow: '0 4mm 8mm rgba(255,111,0,0.15), 0 2mm 4mm rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0'
        }}
      >
        {/* Enhanced Polygon Accent Top */}
        <div 
          style={{
            width: '100%',
            height: '25mm',
            background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #ffb74d 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
            position: 'absolute',
            top: '0',
            left: '0',
            boxShadow: '0 1mm 2mm rgba(255,111,0,0.2)',
            zIndex: 1
          }}
        />

        {/* Decorative Elements */}
        <div 
          style={{
            position: 'absolute',
            top: '4mm',
            right: '4mm',
            width: '8mm',
            height: '8mm',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '7mm',
            right: '7mm',
            width: '4mm',
            height: '4mm',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            zIndex: 2
          }}
        />

        {/* Header Section */}
        <div 
          style={{
            textAlign: 'center',
            zIndex: 3,
            marginTop: '5mm',
            padding: '0 4mm'
          }}
        >
          {/* Company Logo */}
          <div 
            style={{
              background: 'white',
              borderRadius: '3mm',
              padding: '1mm',
              display: 'inline-block',
              boxShadow: '0 1mm 3mm rgba(255,111,0,0.2)',
              marginBottom: '2mm'
            }}
          >
            <div 
              style={{
                width: '12mm',
                height: '12mm',
                borderRadius: '2mm',
                background: 'linear-gradient(135deg, #ff6f00, #ff8f00)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                fontWeight: '700',
                color: 'white'
              }}
            >
              <img src="/images/jmd_logo.jpeg" alt="Logo" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Employee Photo */}
          <div 
            style={{
              background: 'white',
              borderRadius: '50%',
              padding: '1mm',
              display: 'inline-block',
              boxShadow: '0 2mm 4mm rgba(255,111,0,0.25)',
              marginBottom: '3mm'
            }}
          >
            {emp.profileImage ? (
              <img 
                src={emp.profileImage} 
                style={{
                  width: '22mm',
                  height: '22mm',
                  borderRadius: '50%',
                  border: '1mm solid #ff6f00',
                  objectFit: 'cover'
                }}
                alt="Employee"
              />
            ) : (
              <div 
                style={{
                  width: '22mm',
                  height: '22mm',
                  borderRadius: '50%',
                  border: '1mm solid #ff6f00',
                  background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: '#666'
                }}
              >
                PHOTO
              </div>
            )}
          </div>

          {/* Employee Name */}
          <div 
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '1mm',
              letterSpacing: '-0.3px'
            }}
          >
            {emp.name}
          </div>

          {/* Employee Role */}
          <div 
            style={{
              fontSize: '10px',
              color: '#ff6f00',
              fontWeight: '600',
              marginBottom: '4mm',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}
          >
            {emp.role}
          </div>
        </div>

        {/* Employee Details */}
        <div 
          style={{
            fontSize: '10px',
            color: '#333',
            marginTop: '2mm',
            padding: '0 4mm',
            zIndex: 3,
            flexGrow: 1
          }}
        >
          {/* ID */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1mm 0',
              borderBottom: '0.5px solid #f0f0f0'
            }}
          >
            <span 
              style={{
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                fontSize: '7px',
                letterSpacing: '0.3px'
              }}
            >
              ID:
            </span>
            <span 
              style={{
                fontWeight: '600',
                color: '#1a1a1a',
                fontSize: '8px'
              }}
            >
              {emp.employeeId}
            </span>
          </div>

          {/* Phone */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1mm 0',
              borderBottom: '0.5px solid #f0f0f0'
            }}
          >
            <span 
              style={{
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                fontSize: '7px',
                letterSpacing: '0.3px'
              }}
            >
              Phone:
            </span>
            <span 
              style={{
                fontWeight: '500',
                color: '#1a1a1a',
                fontSize: '8px'
              }}
            >
              {emp.mobile}
            </span>
          </div>

          {/* Email */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1mm 0',
              borderBottom: '0.5px solid #f0f0f0'
            }}
          >
            <span 
              style={{
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                fontSize: '7px',
                letterSpacing: '0.3px'
              }}
            >
              Email:
            </span>
            <span 
              style={{
                fontWeight: '500',
                color: '#1a1a1a',
                fontSize: '7px'
              }}
            >
              {emp.email}
            </span>
          </div>

          {/* Joined Date */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1mm 0',
              borderBottom: '0.5px solid #f0f0f0'
            }}
          >
            <span 
              style={{
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                fontSize: '7px',
                letterSpacing: '0.3px'
              }}
            >
              Joined:
            </span>
            <span 
              style={{
                fontWeight: '500',
                color: '#1a1a1a',
                fontSize: '8px'
              }}
            >
              {joinDate}
            </span>
          </div>

          {/* Address */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1mm 0',
              borderBottom: '0.5px solid #f0f0f0'
            }}
          >
            <span 
              style={{
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                fontSize: '7px',
                letterSpacing: '0.3px'
              }}
            >
              Address:
            </span>
            <span 
              style={{
                fontWeight: '500',
                color: '#1a1a1a',
                fontSize: '7px',
                textAlign: 'right',
                maxWidth: '60%'
              }}
            >
              {emp.address}
            </span>
          </div>

          {/* Gender */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1mm 0',
              borderBottom: '0.5px solid #f0f0f0'
            }}
          >
            <span 
              style={{
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                fontSize: '7px',
                letterSpacing: '0.3px'
              }}
            >
              Gender:
            </span>
            <span 
              style={{
                fontWeight: '500',
                color: '#1a1a1a',
                fontSize: '8px'
              }}
            >
              {emp.gender}
            </span>
          </div>

          {/* Emergency Contact */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1mm 0'
            }}
          >
            <span 
              style={{
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                fontSize: '7px',
                letterSpacing: '0.3px'
              }}
            >
              Emergency:
            </span>
            <span 
              style={{
                fontWeight: '500',
                color: '#1a1a1a',
                fontSize: '7px',
                textAlign: 'right'
              }}
            >
              {emp.emergencyName} ({emp.emergencyMobile})
            </span>
          </div>

          {/* Barcode */}
          <div 
            style={{
              textAlign: 'center',
              marginTop: '3mm'
            }}
          >
            <div 
              style={{
                background: 'white',
                borderRadius: '2mm',
                padding: '2mm',
                display: 'inline-block',
                boxShadow: '0 1mm 3mm rgba(255,111,0,0.15)'
              }}
            >
              <canvas 
                ref={barcodeRef}
                style={{
                  width: '35mm',
                  height: '9mm',
                  borderRadius: '1mm'
                }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Polygon Accent Bottom */}
        <div 
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '15mm',
            background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #ffb74d 100%)',
            clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: '0 -1mm 2mm rgba(255,111,0,0.2)'
          }}
        >
          <div 
            style={{
              fontSize: '9px',
              fontWeight: '700',
              color: 'white',
              textAlign: 'center',
              marginTop: '3mm',
              letterSpacing: '0.2px',
              textShadow: '0 0.5mm 1mm rgba(0,0,0,0.2)'
            }}
          >
            Your satisfaction is our first priority
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeIdCard;