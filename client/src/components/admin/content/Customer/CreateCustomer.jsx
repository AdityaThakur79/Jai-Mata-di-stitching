import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateCustomerMutation } from "@/features/api/customerApi";
import { Separator } from "@/components/ui/separator";
import { itemMeasurementFields } from "@/utils/itemsMeasurement";
import { PlusCircle, Trash } from "lucide-react";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [itemType, setItemType] = useState("");
  const [measurements, setMeasurements] = useState([
    { itemType: "", values: {} },
  ]);

  const {
    data: itemData,
    isLoading: itemLoading,
    refetch,
  } = useGetAllItemMastersQuery({
    page: 1,
    limit: 100,
    search: "",
  });

  const [createCustomer, { isLoading, isSuccess, isError, error, data }] =
    useCreateCustomerMutation();

  const addMeasurementItem = () => {
    setMeasurements([...measurements, { itemType: "", values: {} }]);
  };

  const removeMeasurementItem = (index) => {
    const updated = [...measurements];
    updated.splice(index, 1);
    setMeasurements(updated);
  };

  const handleItemTypeChange = (index, val) => {
    const updated = [...measurements];
    updated[index].itemType = val;
    updated[index].values = {};
    setMeasurements(updated);
  };

  const handleValueChange = (index, field, value) => {
    const updated = [...measurements];
    updated[index].values[field] = value;
    setMeasurements(updated);
  };

  const handleSubmit = async () => {
    if (!name || !mobile) return toast.error("Name and Mobile are required.");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    if (email) formData.append("email", email);
    if (profilePhoto) formData.append("customerProfilePhoto", profilePhoto);
    formData.append("measurements", JSON.stringify(measurements || {}));

    await createCustomer(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Customer created successfully");
      navigate("/admin/customers");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to create customer");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-10 p-4 min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-1">Add New Customer</h2>
      <p className="text-sm mb-4 text-gray-500">
        Basic details and measurement
      </p>

      {/* --- Section 1: Customer Info --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer Name"
          />
        </div>
        <div>
          <Label>Mobile</Label>
          <Input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile Number"
          />
        </div>
        <div>
          <Label>Email (Optional)</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
        </div>
        <div>
          <Label>Profile Photo (Optional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files?.[0])}
          />
          {profilePhoto && (
            <img
              src={URL.createObjectURL(profilePhoto)}
              alt="Preview"
              className="mt-2 w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6">
        {measurements.map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Measurement {index + 1}</h3>
              {measurements.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeMeasurementItem(index)}
                >
                  <Trash size={16} />
                </button>
              )}
            </div>

            <div className="mb-4">
              <Label>Select Item Type</Label>
              <Select
                value={item.itemType}
                onValueChange={(val) => handleItemTypeChange(index, val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {itemData?.items?.map((item) => {
                    const isSelected = measurements.some(
                      (m) => m.itemType === item.name
                    );
                    return (
                      <SelectItem
                        key={item._id}
                        value={item.name}
                        disabled={isSelected}
                        className={
                          isSelected ? "opacity-50 cursor-not-allowed" : ""
                        }
                      >
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {item.itemType && itemData?.items && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {itemData.items
                  .find((i) => i.name === item.itemType)
                  ?.fields.map((field) => (
                    <div key={field}>
                      <Label className="capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </Label>
                      <Input
                        type="number"
                        placeholder={`Enter ${field}`}
                        value={item.values[field] || ""}
                        onChange={(e) =>
                          handleValueChange(index, field, e.target.value)
                        }
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addMeasurementItem}
          className="mt-2 w-fit"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate("/admin/customers")}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Customer"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateCustomer;
