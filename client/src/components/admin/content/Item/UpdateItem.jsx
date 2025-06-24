import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetItemMasterByIdMutation,
  useUpdateItemMasterMutation,
} from "@/features/api/itemApi";

const UpdateItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemId = location.state?.itemId;

  const [itemType, setItemType] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([""]);

  const [getItemById, { isLoading: loadingItem }] =
    useGetItemMasterByIdMutation();
  const [updateItemMaster, { isLoading, isSuccess, isError, error, data }] =
    useUpdateItemMasterMutation();

  useEffect(() => {
    if (itemId) {
      getItemById(itemId).then(({ data }) => {
        if (data?.success) {
          const item = data.item;
          setItemType(item.name || "");
          setDescription(item.description || "");
          setFields(item.fields?.length ? item.fields : [""]);
        } else {
          toast.error("Failed to load item data");
          navigate("/admin/items");
        }
      });
    }
  }, [itemId]);

  const handleFieldChange = (index, value) => {
    const updated = [...fields];
    updated[index] = value;
    setFields(updated);
  };

  const addField = () => {
    setFields([...fields, ""]);
  };

  const removeField = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const handleSubmit = async () => {
    if (!itemType.trim() || fields.some((f) => !f.trim())) {
      toast.error("Item type and all fields are required");
      return;
    }

    await updateItemMaster({
      itemId,
      name: itemType.trim(),
      description : description.trim(),
      fields: fields.map((f) => f.trim().toLowerCase()),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Item updated successfully");
      navigate("/admin/items");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to update item");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-10 p-4 min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-1">Update Item Master</h2>
      <p className="text-sm mb-4 text-gray-500">
        Edit item type and its measurement fields.
      </p>

      <div className="grid gap-4">
        <div>
          <Label>Item Name</Label>
          <Input
            placeholder="Enter item name"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
          />
        </div>

        <div>
          <Label>Description (Optional)</Label>
          <Input
            placeholder="Enter item desc in short"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Measurement Fields</Label>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Enter field name"
                value={field}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
              {fields.length > 1 && (
                <Button
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200"
                  onClick={() => removeField(index)}
                >
                  <FaRegTrashCan />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addField}
            className="mt-2 w-fit"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate("/admin/items")}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Item"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateItem;
