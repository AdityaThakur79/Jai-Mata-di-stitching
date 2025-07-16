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
  const [stitchingCharge, setStitchingCharge] = useState("");
  const [fields, setFields] = useState([""]);
  const [itemImage, setItemImage] = useState(null);
  const [secondaryItemImage, setSecondaryItemImage] = useState(null);
  const [previewItemImage, setPreviewItemImage] = useState("");
  const [previewSecondaryItemImage, setPreviewSecondaryItemImage] = useState("");
  const [category, setCategory] = useState("");

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
          setStitchingCharge(item.stitchingCharge || "");
          setFields(item.fields?.length ? item.fields : [""]);
          setPreviewItemImage(item.itemImage || "");
          setPreviewSecondaryItemImage(item.secondaryItemImage || "");
          setCategory(item.category || "");
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

  const handleItemImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setItemImage(file);
      setPreviewItemImage(URL.createObjectURL(file));
    }
  };
  const handleSecondaryItemImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSecondaryItemImage(file);
      setPreviewSecondaryItemImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
 
    if (!itemType.trim() || fields.some((f) => !f.trim()) || !category) {
      toast.error("Item type, category, and all fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("itemId", itemId);
    formData.append("name", itemType.trim());
    formData.append("description", description.trim());
    formData.append("stitchingCharge", stitchingCharge);
    formData.append("category", category);
    fields.forEach((f) => formData.append("fields", f.trim().toLowerCase()));
    if (itemImage) formData.append("itemImage", itemImage);
    if (secondaryItemImage) formData.append("secondaryItemImage", secondaryItemImage);
    await updateItemMaster(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Item updated successfully");
      navigate("/employee/items");
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
          <Label>Category</Label>
          <select
            className="w-full border rounded p-2 mt-1"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div>
          <Label>Description (Optional)</Label>
          <Input
            placeholder="Enter item desc in short"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>StitchingCharge</Label>
          <Input
            placeholder="Enter item charge"
            value={stitchingCharge}
            onChange={(e) => setStitchingCharge(e.target.value)}
          />
        </div>

        <div>
          <Label>Item Image</Label>
          <Input type="file" accept="image/*" onChange={handleItemImageChange} />
          {previewItemImage && (
            <img
              src={previewItemImage}
              alt="Preview"
              className="mt-2 w-16 h-16 object-cover rounded"
            />
          )}
        </div>
        <div>
          <Label>Secondary Item Image</Label>
          <Input type="file" accept="image/*" onChange={handleSecondaryItemImageChange} />
          {previewSecondaryItemImage && (
            <img
              src={previewSecondaryItemImage}
              alt="Preview"
              className="mt-2 w-16 h-16 object-cover rounded"
            />
          )}
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
        <Button variant="outline" onClick={() => navigate("/employee/items")}>
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
