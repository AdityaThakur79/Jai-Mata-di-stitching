import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetPendingOrderStockBucketsQuery, useGetTailorSlipStatsQuery } from "@/features/api/pendingOrderApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  ScanLine,
  PackageCheck,
  ListChecks,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TailorWorkDashboard = () => {
  const { data: slipStatsData } = useGetTailorSlipStatsQuery();
  const { data: stockBucketsData } = useGetPendingOrderStockBucketsQuery();
  const navigate = useNavigate();

  const partialReadyCount = stockBucketsData?.partialReady?.length || 0;
  const fullReadyCount = stockBucketsData?.fullReady?.length || 0;
  const assignedSlips = slipStatsData?.stats?.assigned || 0;

  return (
    <div className="space-y-5 w-full">
      <Card className="border-orange-200 bg-gradient-to-r from-orange-100 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-700 flex items-center gap-2">
            <ScanLine className="w-6 h-6" />
            Tailor Work Dashboard
          </CardTitle>
          <CardDescription className="text-orange-900">
            Use the scanner machine to open order item details, update measurements/notes, and mark item status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full h-16 text-lg bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate("/employee/order-details")}
          >
            Start Scan & Update Item
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Assigned Slips</p>
            <p className="text-2xl font-bold text-orange-700">{assignedSlips}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Partial Ready Orders</p>
            <p className="text-2xl font-bold text-orange-700">{partialReadyCount}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Full Ready Orders</p>
            <p className="text-2xl font-bold text-orange-700">{fullReadyCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">Quick Actions</CardTitle>
          <CardDescription>Open commonly used work screens directly.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start h-12" onClick={() => navigate("/employee/order-details")}>
              <ScanLine className="w-4 h-4 mr-2" /> Scan & Update Item
            </Button>
            <Button variant="outline" className="justify-start h-12" onClick={() => navigate("/employee/partial-ready")}>
              <ListChecks className="w-4 h-4 mr-2" /> View Partial Ready
            </Button>
            <Button variant="outline" className="justify-start h-12" onClick={() => navigate("/employee/full-ready")}>
              <PackageCheck className="w-4 h-4 mr-2" /> View Full Ready
            </Button>
            <Button variant="outline" className="justify-start h-12" onClick={() => navigate("/employee/pending-slip")}>
              <ClipboardList className="w-4 h-4 mr-2" /> Pending Slips
            </Button>
            <Button variant="outline" className="justify-start h-12" onClick={() => navigate("/employee/printed-slip")}>
              <FileText className="w-4 h-4 mr-2" /> Printed Slips
            </Button>
            <Button variant="outline" className="justify-start h-12" onClick={() => navigate("/employee/scanned-slips")}>
              <ScanLine className="w-4 h-4 mr-2" /> Slip Scan Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TailorWorkDashboard;
