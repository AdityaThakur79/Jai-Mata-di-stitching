import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";


// Note: Use built-in fonts (Helvetica) for maximum compatibility with react-pdf

const EmployeeIdCard = ({ employee, logoDataUrl, profileImageDataUrl = null }) => {
  // Sample employee data with better defaults
  const defaultEmployee = {
    name: "John Doe",
    role: "Software Engineer",
    employeeId: "EMP001",
    mobile: "+91 9876543210",
    email: "john.doe@company.com",
    joiningDate: "2024-01-15",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    gender: "Male",
    emergencyContact: {
      name: "Jane Doe",
      mobile: "+91 9876543211"
    },
    profileImage: null,
    grade: "A",
    bloodGroup: "B+",
    validityDate: "2025-12-31",
  };

  const emp = employee || defaultEmployee;
  const joinDate = emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN') : "—";
  const validityDate = emp.validityDate ? new Date(emp.validityDate).toLocaleDateString('en-IN') : "—";
  const emergencyName = emp.emergencyContact?.name || emp.emergencyName || "Not Provided";
  const emergencyMobile = emp.emergencyContact?.mobile || emp.emergencyMobile || "Not Provided";

  const companyName = "JMD Stitching PVT LTD";
  const companyFullName = "JMD STITCHING PVT LTD";
  const companyAddress = "108,1st floor, A-115 Vijay Infinity Business Park, MIDC Phase - 1, Behind Pendharkar College, Dombivali(E), Thane - 421203, Maharashtra, India";
  const companyEmail = "info@jmdstitching.com";
  const companyPhone = "9082150556";

  // Function to get profile image
  const getProfileImage = () => {
    // If we have a converted base64 profile image, use it
    if (profileImageDataUrl) {
      return profileImageDataUrl;
    }
    
    if (emp.profileImage) {
      // If it's already a data URL, return as is
      if (emp.profileImage.startsWith('data:')) {
        return emp.profileImage;
      }
      
      // If it's a URL (Cloudinary or other), we need to convert to base64
      // This should be handled by the parent component
      if (emp.profileImage.startsWith('http')) {
        return null; // Return null to show fallback
      }
      
      // If it's a relative path, construct the full backend URL
      // Remove any leading slash to avoid double slashes
      const cleanPath = emp.profileImage.startsWith('/') ? emp.profileImage.slice(1) : emp.profileImage;
      
      // Use backend URL for local files
      // Development (localhost)
      const fullUrl = `http://localhost:8080/${cleanPath}`;
      
      // Production (uncomment the line below and comment the line above)
      // const fullUrl = `https://jai-mata-di-stitching-1mic.onrender.com/${cleanPath}`;
      
      return fullUrl;
    }
    return null;
  };

  // helper to convert mm to pt (1mm = 2.83465pt)
  const mm = (value) => value * 2.83465;

  return (
    <Document>
      <Page 
        size="A4" 
        style={{
          backgroundColor: "#ffffff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: mm(15),
          fontFamily: "Helvetica",
        }}
      >
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
          {/* FRONT SIDE */}
          <View style={{
            width: mm(85),
            height: mm(125),
            backgroundColor: "#ffffff",
            borderRadius: 8,
            position: "relative",
            overflow: "hidden",
           
            marginRight: mm(15),
          }}>
            {/* Top Header */}
            <View style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: mm(30),
              backgroundColor: "#FF6B35",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}>
              <View style={{
                alignItems: "center",
                flexDirection: "row",
                marginTop: mm(2),
              }}>
                {logoDataUrl ? (
                  <Image src={logoDataUrl} style={{
                    width: mm(14),
                    height: mm(14),
                    // backgroundColor: "#ffffff",
                    borderRadius: mm(1),
                    marginRight: mm(3),
                    // borderWidth: 2,
                    // borderStyle: "solid",
                    // borderColor: "#ffffff",
                  }} />
                ) : (
                  <View style={{
                    width: mm(12),
                    height: mm(12),
                    backgroundColor: "#ffffff",
                    borderRadius: mm(1),
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: mm(3),
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor: "#ffffff",
                  }}>
                    <Text style={{
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#FF6B35",
                    }}>JMD</Text>
                  </View>
                )}
                <View style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: 0.5,
                    lineHeight: 1.2,
                  }}>JMD STITCHING PVT LTD</Text>
                  {/* <Text style={{
                    fontSize: 8,
                    color: "#ffffff",
                    fontWeight: 700,
                  }}>PVT LTD</Text> */}
                </View>
              </View>
            </View>

            {/* Employee Photo */}
            <View style={{
              position: "absolute",
              top: mm(32),
              left: 0,
              right: 0,
              alignItems: "center",
              flexDirection: "column",
              zIndex: 10,
            }}>
              <View style={{
                width: mm(24),
                height: mm(24),
                backgroundColor: "#ffffff",
                borderRadius: mm(8),
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "#FF6B35",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: mm(3),
                overflow: "hidden",
              }}>
                {getProfileImage() ? (
                  <Image 
                    src={getProfileImage()} 
                    style={{
                      width: mm(18),
                      height: mm(18),
                      borderRadius: mm(6),
                    }}
                  />
                ) : (
                  <View style={{
                    width: mm(18),
                    height: mm(18),
                    backgroundColor: "#f5f5f5",
                    borderRadius: mm(6),
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#FF6B35",
                    }}>
                      {emp.name?.charAt(0) || "?"}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={{
                textAlign: "center",
                marginBottom: mm(4),
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#000000",
                  marginBottom: mm(1),
                  letterSpacing: -0.2,
                }}>{emp.name || "Employee Name"}</Text>
                <Text style={{
                  fontSize: 10,
                  color: "#ffffff",
                  fontWeight: 700,
                  backgroundColor: "#FF6B35",
                  paddingTop: mm(1),
                  paddingBottom: mm(1),
                  paddingLeft: mm(4),
                  paddingRight: mm(4),
                  borderRadius: mm(4),
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  textAlign: "center",
                  alignSelf: "center",
                }}>{emp.role || "Position"}</Text>
              </View>
            </View>

            {/* Information Grid */}
            <View style={{
              position: "absolute",
              top: mm(75),
              left: mm(4),
              right: mm(4),
              zIndex: 10,
            }}>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: mm(1.5),
                paddingBottom: mm(1.5),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e0e0e0",
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#333333",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  width: mm(30),
                }}>Employee ID:</Text>
                <Text style={{
                  fontSize: 8,
                  color: "#000000",
                  fontWeight: 400,
                  textAlign: "right",
                  flex: 1,
                }}>{emp.employeeId || "—"}</Text>
              </View>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: mm(1.5),
                paddingBottom: mm(1.5),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e0e0e0",
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#333333",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  width: mm(30),
                }}>Mobile:</Text>
                <Text style={{
                  fontSize: 8,
                  color: "#000000",
                  fontWeight: 400,
                  textAlign: "right",
                  flex: 1,
                }}>{emp.mobile || "—"}</Text>
              </View>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: mm(1.5),
                paddingBottom: mm(1.5),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e0e0e0",
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#333333",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  width: mm(30),
                }}>Email:</Text>
                <Text style={{
                  fontSize: 8,
                  color: "#000000",
                  fontWeight: 400,
                  textAlign: "right",
                  flex: 1,
                }}>{emp.email || "—"}</Text>
              </View>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: mm(1.5),
                paddingBottom: mm(1.5),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e0e0e0",
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#333333",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  width: mm(30),
                }}>Joining Date:</Text>
                <Text style={{
                  fontSize: 8,
                  color: "#000000",
                  fontWeight: 400,
                  textAlign: "right",
                  flex: 1,
                }}>{joinDate}</Text>
              </View>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: mm(1.5),
                paddingBottom: mm(1.5),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e0e0e0",
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#333333",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  width: mm(30),
                }}>Valid Until:</Text>
                <Text style={{
                  fontSize: 8,
                  color: "#000000",
                  fontWeight: 400,
                  textAlign: "right",
                  flex: 1,
                }}>{validityDate}</Text>
              </View>
              {/* <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: mm(1.5),
                paddingBottom: mm(1.5),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e0e0e0",
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#333333",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  width: mm(30),
                }}>Gender:</Text>
                <Text style={{
                  fontSize: 8,
                  color: "#000000",
                  fontWeight: 400,
                  textAlign: "right",
                  flex: 1,
                }}>{emp.gender || "—"}</Text>
              </View> */}
              {/* <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: mm(1.5),
                paddingBottom: mm(1.5),
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e0e0e0",
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#333333",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  width: mm(30),
                }}>Blood Group:</Text>
                <Text style={{
                  fontSize: 8,
                  color: "#FF6B35",
                  fontWeight: 700,
                  backgroundColor: "#fff5f2",
                  paddingTop: mm(1),
                  paddingBottom: mm(1),
                  paddingLeft: mm(2),
                  paddingRight: mm(2),
                  borderRadius: mm(2),
                  textAlign: "center",
                }}>{emp.bloodGroup || "B+"}</Text>
              </View> */}
            </View>

            {/* Barcode Section */}
            {/* <View style={{
              position: "absolute",
              bottom: mm(20),
              left: 0,
              right: 0,
              alignItems: "center",
              flexDirection: "column",
              zIndex: 10,
            }}>
              <View style={{
                backgroundColor: "#ffffff",
                borderRadius: mm(3),
                padding: mm(2),
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#e0e0e0",
                marginBottom: mm(1),
              }}>
                {barcodeDataUrl ? (
                  <Image src={barcodeDataUrl} style={{
                    width: mm(30),
                    height: mm(8),
                    borderRadius: mm(2),
                  }} />
                ) : (
                  <View style={{
                    width: mm(30),
                    height: mm(8),
                    backgroundColor: "#000000",
                    borderRadius: mm(2),
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{
                      fontSize: 6,
                      color: "#ffffff",
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}>||||| |||| |||||</Text>
                  </View>
                )}
              </View>
              <Text style={{
                fontSize: 7,
                color: "#666666",
                fontWeight: 700,
                textAlign: "center",
              }}>ID: {emp.employeeId || "EMP001"}</Text>
            </View> */}

            {/* Bottom Section */}
            <View style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: mm(15),
              backgroundColor: "#FF6B35",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#ffffff",
                textAlign: "center",
                letterSpacing: 0.3,
              }}>YOUR SATISFACTION IS OUR FIRST PRIORITY</Text>
            </View>
          </View>

          {/* BACK SIDE */}
          <View style={{
            width: mm(85),
            height: mm(125),
            backgroundColor: "#ffffff",
            borderRadius: 8,
            position: "relative",
            overflow: "hidden",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "orange",
            padding: mm(5),
          }}>
            {/* Header */}
            <View style={{
              textAlign: "center",
              marginBottom: mm(5),
              paddingBottom: mm(3),
              borderBottomWidth: 2,
              borderBottomStyle: "solid",
              borderBottomColor: "#FF6B35",
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#000000",
                marginBottom: mm(1),
              }}>{companyFullName}</Text>
              <Text style={{
                fontSize: 10,
                color: "#FF6B35",
                fontWeight: 700,
                marginBottom: mm(2),
              }}>Excellence in Every Stitch</Text>
              <Text style={{
                fontSize: 8,
                color: "#666666",
                lineHeight: 1.3,
                textAlign: "center",
              }}>{companyAddress}</Text>
            </View>

            {/* Employee Details - Top Section */}
            <View style={{
              marginBottom: mm(3),
              padding: mm(3),
              backgroundColor: "#f8f9fa",
              borderRadius: mm(3),
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e0e0e0",
            }}>
              <Text style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#FF6B35",
                marginBottom: mm(2),
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}>Employee Details</Text>
              
              {/* Blood Group and Grade Row */}
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: mm(2),
              }}>
                <View style={{
                  flex: 1,
                  marginRight: mm(2),
                }}>
                  <Text style={{
                    fontSize: 7,
                    color: "#333333",
                    lineHeight: 1.4,
                    marginBottom: mm(0.5),
                  }}>
                    <Text style={{
                      fontWeight: 700,
                      color: "#000000",
                    }}>Blood Group: </Text>
                    <Text style={{
                      color: "#FF6B35",
                      fontWeight: 700,
                    }}>{emp.bloodGroup || "B+"}</Text>
                  </Text>
                </View>
                <View style={{
                  flex: 1,
                }}>
                  <Text style={{
                    fontSize: 7,
                    color: "#333333",
                    lineHeight: 1.4,
                    marginBottom: mm(0.5),
                  }}>
                    <Text style={{
                      fontWeight: 700,
                      color: "#000000",
                    }}>Grade: </Text>
                    <Text style={{
                      color: "#FF6B35",
                      fontWeight: 700,
                    }}>{emp.grade || "A"}</Text>
                  </Text>
                </View>
              </View>
              
              {/* Address */}
              <Text style={{
                fontSize: 7,
                color: "#333333",
                lineHeight: 1.4,
                marginBottom: mm(2),
              }}>
                <Text style={{
                  fontWeight: 700,
                  color: "#000000",
                }}>Address: </Text>
                {emp.address || "Not Provided"}
              </Text>
              
              {/* Emergency Contact */}
              <Text style={{
                fontSize: 7,
                color: "#333333",
                lineHeight: 1.4,
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontWeight: 700,
                  color: "#000000",
                }}>Emergency Contact: </Text>
                {emergencyName}
              </Text>
              <Text style={{
                fontSize: 7,
                color: "#333333",
                lineHeight: 1.4,
                marginBottom: mm(0.5),
              }}>
                <Text style={{
                  fontWeight: 700,
                  color: "#000000",
                }}>Emergency Phone: </Text>
                {emergencyMobile}
              </Text>
            </View>

            {/* Terms & Conditions */}
            <View style={{
              marginBottom: mm(3),
              padding: mm(3),
              backgroundColor: "#f8f9fa",
              borderRadius: mm(3),
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e0e0e0",
            }}>
              <Text style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#FF6B35",
                marginBottom: mm(2),
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}>Terms & Conditions</Text>
              <View style={{
                fontSize: 6,
                color: "#555555",
                lineHeight: 1.3,
              }}>
                <Text style={{
                  marginBottom: mm(1),
                  paddingLeft: mm(2),
                }}>• This ID card must be worn visibly during work hours</Text>
                <Text style={{
                  marginBottom: mm(1),
                  paddingLeft: mm(2),
                }}>• Report lost or damaged cards to HR immediately</Text>
                <Text style={{
                  marginBottom: mm(1),
                  paddingLeft: mm(2),
                }}>• This card remains property of JMD Stitching</Text>
                <Text style={{
                  marginBottom: mm(1),
                  paddingLeft: mm(2),
                }}>• Must be returned upon resignation or termination</Text>
                <Text style={{
                  marginBottom: mm(1),
                  paddingLeft: mm(2),
                }}>• If found, please return to company address above</Text>
              </View>
            </View>

            {/* Company Information - Bottom Section */}
            <View style={{
              marginBottom: mm(3),
              padding: mm(3),
              backgroundColor: "#f8f9fa",
              borderRadius: mm(3),
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e0e0e0",
            }}>
              <Text style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#FF6B35",
                marginBottom: mm(2),
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}>Contact Information</Text>
              <Text style={{
                fontSize: 7,
                color: "#333333",
                lineHeight: 1.4,
                marginBottom: mm(1),
              }}>
                <Text style={{
                  fontWeight: 700,
                  color: "#000000",
                }}>Email: </Text>
                {companyEmail}
              </Text>
              <Text style={{
                fontSize: 7,
                color: "#333333",
                lineHeight: 1.4,
                marginBottom: mm(1),
              }}>
                <Text style={{
                  fontWeight: 700,
                  color: "#000000",
                }}>Phone: </Text>
                +91 {companyPhone}
              </Text>
              <Text style={{
                fontSize: 7,
                color: "#333333",
                lineHeight: 1.4,
                marginBottom: mm(1),
              }}>
                <Text style={{
                  fontWeight: 700,
                  color: "#000000",
                }}>Website: </Text>
                www.jmdstitching.com
              </Text>
            </View>

            {/* Footer */}
            <Text style={{
              position: "absolute",
              bottom: mm(3),
              left: mm(5),
              right: mm(5),
              textAlign: "center",
              fontSize: 6,
              color: "#999999",
              borderTopWidth: 1,
              borderTopStyle: "solid",
              borderTopColor: "#e0e0e0",
              paddingTop: mm(2),
            }}>
              © {new Date().getFullYear()} JMD Stitching PVT LTD. All rights reserved. | www.jmdstitching.com
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default EmployeeIdCard;