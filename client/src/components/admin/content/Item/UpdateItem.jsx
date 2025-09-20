import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Package, Upload, Scissors } from "lucide-react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetItemMasterByIdMutation,
  useUpdateItemMasterMutation,
} from "@/features/api/itemApi";

const FormSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
      <Icon className="w-4 h-4 text-gray-600" />
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

const FormField = ({ label, required, children, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <Label className="text-xs font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

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
  const [styles, setStyles] = useState([]);

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
          setStyles(Array.isArray(item.styles) ? item.styles : []);
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

  const addStyle = () => {
    setStyles([...styles, { styleId: "", styleName: "", description: "" }]);
  };

  const removeStyle = (index) => {
    const updated = [...styles];
    updated.splice(index, 1);
    setStyles(updated);
  };

  const handleStyleChange = (index, field, value) => {
    const updated = [...styles];
    updated[index] = { ...updated[index], [field]: value };
    setStyles(updated);
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

    // Validate styles if any are added
    const validStyles = styles.filter(style => 
      style.styleId.trim() && style.styleName.trim()
    );
    
    if (styles.length > 0 && validStyles.length !== styles.length) {
      toast.error("All styles must have Style ID and Style Name");
      return;
    }

    const formData = new FormData();
    formData.append("itemId", itemId);
    formData.append("name", itemType.trim());
    formData.append("description", description.trim());
    formData.append("stitchingCharge", stitchingCharge);
    formData.append("category", category);
    fields.forEach((f) => formData.append("fields", f.trim().toLowerCase()));
    if (validStyles.length > 0) {
      formData.append("styles", JSON.stringify(validStyles));
    }
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
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Update Item Master</h1>
          <p className="text-gray-600 text-sm">Edit item type, measurement fields, and styles</p>
        </div>

        <div className="space-y-4">
          {/* Basic Information */}
          <FormSection title="Basic Information" icon={Package}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormField label="Item Name" required>
                <Input
                  placeholder="Enter item name"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Category" required>
                <select
                  className="w-full border rounded p-2 h-8 text-sm"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </FormField>

              <FormField label="Stitching Charge">
                <Input
                  placeholder="Enter stitching charge"
                  value={stitchingCharge}
                  onChange={(e) => setStitchingCharge(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Description" className="md:col-span-2 lg:col-span-3">
                <Input
                  placeholder="Enter item description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Images */}
          <FormSection title="Item Images" icon={Upload}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Primary Image">
                <div className="space-y-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleItemImageChange}
                    className="h-8 text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700"
                  />
                  {previewItemImage && (
                    <img
                      src={previewItemImage}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </FormField>
              
              <FormField label="Secondary Image">
                <div className="space-y-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleSecondaryItemImageChange}
                    className="h-8 text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700"
                  />
                  {previewSecondaryItemImage && (
                    <img
                      src={previewSecondaryItemImage}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </FormField>
            </div>
          </FormSection>

          {/* Measurement Fields */}
          <FormSection title="Measurement Fields" icon={Scissors}>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Enter field name"
                    value={field}
                    onChange={(e) => handleFieldChange(index, e.target.value)}
                    className="h-8 text-sm"
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
                className="mt-2 w-fit h-8 text-sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>
          </FormSection>

          {/* Styles */}
          <FormSection title="Item Styles (Optional)" icon={Package}>
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Add different styles for this item type</p>
              {styles.map((style, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Style {index + 1}</span>
                    {styles.length > 0 && (
                      <Button
                        type="button"
                        className="p-1 h-6 w-6 bg-red-100 text-red-600 hover:bg-red-200"
                        onClick={() => removeStyle(index)}
                      >
                        <FaRegTrashCan className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Style ID</Label>
                      <Input
                        placeholder="e.g., STYLE001"
                        value={style.styleId}
                        onChange={(e) => handleStyleChange(index, "styleId", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Style Name</Label>
                      <Input
                        placeholder="e.g., Formal Shirt"
                        value={style.styleName}
                        onChange={(e) => handleStyleChange(index, "styleName", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Description (Optional)</Label>
                    <Input
                      placeholder="Brief description of this style"
                      value={style.description}
                      onChange={(e) => handleStyleChange(index, "description", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addStyle}
                className="mt-2 w-fit h-8 text-sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Style
              </Button>
            </div>
          </FormSection>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="h-9 px-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-sm transition-colors text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Item"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateItem;
