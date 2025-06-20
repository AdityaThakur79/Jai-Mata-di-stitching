import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { itemMeasurementFields } from "@/utils/itemsMeasurement";
import { useGetCustomerByIdMutation, useUpdateCustomerMutation } from "@/features/api/customerApi";

const UpdateCustomer = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [itemType, setItemType] = useState("");
  const [measurementList, setMeasurementList] = useState([]); 
  const [currentValues, setCurrentValues] = useState({});

  const location = useLocation();
  const customerId = location.state?.customerId;
  const navigate = useNavigate();

  const [getCustomerById, { data, isSuccess }] = useGetCustomerByIdMutation();
  const [updateCustomer, { isLoading, isSuccess: isUpdated, error }] = useUpdateCustomerMutation();

  useEffect(() => {
    if (customerId) getCustomerById(customerId );
  }, [customerId]);

  useEffect(() => {
    if (isSuccess && data?.customer) {
      const c = data?.customer;
      setName(c?.name);
      setMobile(c?.mobile);
      setEmail(c?.email);
      setPreviewImage(c?.profileImage || "");
      setMeasurementList(c?.measurements || []);
    }
  }, [data, isSuccess]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddMeasurement = () => {
    if (!itemType || !Object.keys(currentValues).length) return;

    const updated = measurementList.filter((m) => m.itemType !== itemType);  
    updated.push({ itemType, values: currentValues });

    setMeasurementList(updated);
    setItemType("");
    setCurrentValues({});
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("customerId", customerId);
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("measurements", JSON.stringify(measurementList));

    if (profileImage) {
      formData.append("customerProfilePhoto", profileImage);
    }

    await updateCustomer(formData);
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Customer Updated Successfully");
      setTimeout(() => navigate("/admin/customers"), 1500);
    } else if (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  }, [isUpdated, error]);

  return (
    <div className="flex-1 mx-4 md:mx-10 min-h-[100vh]">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Edit Customer</h1>
        <p className="text-sm">Update customer details and measurements below.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter customer name" />
        </div>
        <div>
          <Label>Mobile</Label>
          <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter mobile number" />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
        </div>
        <div>
          <Label>Profile Photo</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && (
            <img src={previewImage} className="w-24 h-24 mt-2 rounded-full border object-cover" alt="Preview" />
          )}
        </div>

        <div className="border rounded-lg p-4 mt-4 bg-gray-50 dark:bg-black/20">
          <h2 className="font-semibold mb-2">Measurements</h2>

          <div className="grid gap-3">
            <div>
              <Label>Select Item Type</Label>
              <Select onValueChange={(val) => {
                setItemType(val);
                setCurrentValues(
                  measurementList.find((m) => m.itemType === val)?.values || {}
                );
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(itemMeasurementFields).map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {itemType && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {itemMeasurementFields[itemType].map((field) => (
                  <div key={field}>
                    <Label className="capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>
                    <Input
                      type="number"
                      placeholder={`Enter ${field}`}
                      value={currentValues[field] || ""}
                      onChange={(e) =>
                        setCurrentValues((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {itemType && (
              <Button className="mt-2 w-fit" onClick={handleAddMeasurement}>
                Add / Update Item
              </Button>
            )}

            {measurementList.length > 0 && (
              <div className="mt-4 space-y-2">
               {measurementList.map((m) => (
  <div key={m?.itemType} className="text-sm bg-muted p-2 rounded">
    <strong>{m?.itemType}</strong>:{" "}
    {m?.values
      ? Object.entries(m.values)
          .map(([k, v]) => `${k}: ${v} In`)
          .join(", ")
      : "No Measuremnts Found"}
  </div>
))}

              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-6">
          <Button variant="outline" onClick={() => navigate("/admin/customers")}>Back</Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Customer"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCustomer;
