import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetCatalogueByIdQuery, useUpdateCatalogueMutation } from "@/features/api/catalogueApi";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCatalogue = () => {
  const { id } = useParams();
  const { data } = useGetCatalogueByIdQuery(id);
  const [updateCatalogue, { isLoading }] = useUpdateCatalogueMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", category: "men", type: "", description: "", driveUrl: "", featuredImage: null });

  useEffect(() => {
    if (data?.catalogue) {
      setForm({ name: data.catalogue.name || "", category: data.catalogue.category || "men", type: data.catalogue.type || "", description: data.catalogue.description || "", driveUrl: data.catalogue.driveUrl || "" });
    }
  }, [data]);

  const previewUrl = useMemo(() => {
    const url = form.driveUrl || "";
    const m1 = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (m1 && m1[1]) return `https://drive.google.com/file/d/${m1[1]}/preview`;
    const m2 = url.match(/[?&]id=([^&]+)/);
    if (m2 && m2[1]) return `https://drive.google.com/file/d/${m2[1]}/preview`;
    return url ? `https://drive.google.com/viewerng/viewer?embedded=1&url=${encodeURIComponent(url)}` : "";
  }, [form.driveUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) return toast.error("Name and type are required");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("type", form.type);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("driveUrl", form.driveUrl);
    if (form.featuredImage) fd.append("galleryImage", form.featuredImage);
    const res = await updateCatalogue({ id, payload: fd });
    if (res.data?.success) { toast.success("Catalogue updated"); navigate("/employee/website/catalogues"); } else { toast.error(res.data?.message || "Failed"); }
  };

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <span className="w-6 h-6 bg-white rounded" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Update Catalogue</h1>
          <p className="text-gray-600 text-sm">Edit catalogue details, category, type, Drive link, and featured image</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="h-8 text-sm"/>
        </div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v)=>setForm({...form, category: v})}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select category"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Type</Label>
          <Input value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})} className="h-8 text-sm"/>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} rows={3} className="text-sm"/>
      </div>
      <div>
        <Label>Google Drive PDF Link</Label>
        <Input value={form.driveUrl} onChange={(e)=>setForm({...form,driveUrl:e.target.value})} placeholder="https://drive.google.com/file/d/FILE_ID/view" className="h-8 text-sm"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label>Featured Image (optional)</Label>
          <Input type="file" accept="image/*" onChange={(e)=>setForm({...form, featuredImage: e.target.files?.[0] || null})} className="h-8 text-sm"/>
          {data?.catalogue?.featuredImageUrl && !form.featuredImage && (
            <img src={data.catalogue.featuredImageUrl} alt="Current" className="w-full h-24 object-cover rounded border mt-2" />
          )}
          {form.featuredImage && (
            <img src={URL.createObjectURL(form.featuredImage)} alt="Preview" className="w-full h-24 object-cover rounded border mt-2" />
          )}
        </div>
        {previewUrl && (
          <div className="md:col-span-2 border rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600">PDF Preview</div>
            <iframe title="Preview" src={previewUrl} className="w-full h-40 md:h-56" style={{ border: 0 }} />
          </div>
        )}
      </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="h-8 text-sm bg-orange-600 hover:bg-orange-700 text-white">{isLoading?"Saving...":"Update Catalogue"}</Button>
          <Button type="button" variant="outline" onClick={()=>navigate(-1)} className="h-8 text-sm">Cancel</Button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCatalogue;


