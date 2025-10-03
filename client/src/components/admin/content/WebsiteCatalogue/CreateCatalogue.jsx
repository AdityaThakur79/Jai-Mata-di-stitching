import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCatalogueMutation } from "@/features/api/catalogueApi";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, FileText, Link2 } from "lucide-react";

const CreateCatalogue = () => {
  const [form, setForm] = useState({ name: "", category: "men", type: "", description: "", driveUrl: "", featuredImage: null });
  const [createCatalogue, { isLoading }] = useCreateCatalogueMutation();
  const navigate = useNavigate();

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
    if (!form.name || !form.type || !form.driveUrl) return toast.error("Name, type and Drive link are required");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("type", form.type);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("driveUrl", form.driveUrl);
    if (form.featuredImage) fd.append("galleryImage", form.featuredImage);
    const res = await createCatalogue(fd);
    if (res.data?.success) { toast.success("Catalogue created"); navigate("/employee/website/catalogues"); } else { toast.error(res.data?.message || "Failed"); }
  };

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Catalogue</h1>
          <p className="text-gray-600 text-sm">Define catalogue details, category, type, Drive link, and featured image</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">

      {/* Basic details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Name</Label>
          <Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="h-8 text-sm" placeholder="Designer Blazer"/>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <Select value={form.category} onValueChange={(v)=>setForm({...form, category: v})}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select category"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Type</Label>
          <Input value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})} placeholder="blazer, suit, kurta" className="h-8 text-sm"/>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Description</Label>
        <Textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} rows={3} className="text-sm"/>
      </div>

      {/* Drive link + preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs flex items-center gap-1"><Link2 className="w-3 h-3"/> Google Drive PDF Link</Label>
          <Input value={form.driveUrl} onChange={(e)=>setForm({...form,driveUrl:e.target.value})} placeholder="https://drive.google.com/file/d/FILE_ID/view" className="h-8 text-sm"/>
          <p className="text-[11px] text-gray-500">Use Drive share link (Anyone with the link – Viewer). We auto-convert it for embed.</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Featured Image</Label>
          <Input type="file" accept="image/*" onChange={(e)=>setForm({...form, featuredImage: e.target.files?.[0] || null})} className="h-8 text-sm"/>
          {form.featuredImage && (
            <div className="mt-2">
              <img src={URL.createObjectURL(form.featuredImage)} alt="Preview" className="w-full h-24 object-cover rounded border" />
            </div>
          )}
        </div>
      </div>

      {previewUrl && (
        <div className="border rounded-lg overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600">PDF Preview</div>
          <iframe title="Preview" src={previewUrl} className="w-full h-64" style={{ border: 0 }} />
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={isLoading} className="h-8 bg-orange-600 hover:bg-orange-700 text-white text-sm px-4">{isLoading?"Saving...":"Create Catalogue"}</Button>
        <Button type="button" variant="outline" onClick={()=>navigate(-1)} className="h-8 text-sm">Cancel</Button>
      </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCatalogue;


