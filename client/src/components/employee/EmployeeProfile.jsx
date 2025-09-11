import React from "react";
import { useSelector } from "react-redux";
import { useGetEmployeeProfileQuery } from "@/features/api/employeeApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  Shield,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const EmployeeProfile = () => {
  const { employee } = useSelector((state) => state.auth);
  const { data: profileData, isLoading } = useGetEmployeeProfileQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const profile = profileData?.employee;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View your employee profile information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Fixed on scroll */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.profileImage} alt={profile?.name} />
                  <AvatarFallback className="text-2xl">
                    {profile?.name?.charAt(0).toUpperCase() || "E"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profile?.name}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="capitalize">
                  {profile?.role}
                </Badge>
                {Array.isArray(profile?.secondaryRoles) && profile.secondaryRoles.length > 0 && (
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">Secondary:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {profile.secondaryRoles.map((r) => (
                        <Badge key={r} variant="outline" className="capitalize text-xs">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{profile?.employeeId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Joined On</p>
                  <p className="font-medium">
                    {new Date(profile?.joiningDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge 
                    variant={profile?.status === "active" ? "default" : "destructive"}
                  >
                    {profile?.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-medium">{profile?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Gender</label>
                <p className="font-medium capitalize">{profile?.gender || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <p className="font-medium">
                  {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Blood Group</label>
                <p className="font-medium">{profile?.bloodGroup || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Grade</label>
                <p className="font-medium">{profile?.grade || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Base Salary</label>
                <p className="font-medium text-green-600">
                  ₹{profile?.baseSalary?.toLocaleString() || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-medium">{profile?.mobile}</p>
                </div>
              </div>
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{profile?.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          {profile?.bankDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Bank Name</label>
                  <p className="font-medium">{profile.bankDetails.bankName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Account Number</label>
                  <p className="font-medium">{profile.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">IFSC Code</label>
                  <p className="font-medium">{profile.bankDetails.ifsc}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          {profile?.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Contact Name</label>
                  <p className="font-medium">{profile.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Contact Mobile</label>
                  <p className="font-medium">{profile.emergencyContact.mobile}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.aadhaarImage ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Aadhaar Card</label>
                    <div className="mt-2">
                      <img
                        src={profile.aadhaarImage}
                        alt="Aadhaar Card"
                        className="w-48 h-32 object-cover border rounded-lg"
                      />
                    </div>
                  </div>
                  {profile?.aadhaarNumber && (
                    <div>
                      <label className="text-sm text-gray-500">Aadhaar Number</label>
                      <p className="font-medium">{profile.aadhaarNumber}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile; 