import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetCataloguesQuery, useDeleteCatalogueMutation } from "@/features/api/catalogueApi";
import { Plus, Loader2, Trash2, FileText, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Catalogues = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetCataloguesQuery({ page: 1, limit: 50, type, search });
  const [deleteCatalogue, { isLoading: isDeleting }] = useDeleteCatalogueMutation();
  const [selected, setSelected] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this catalogue?")) return;
    try {
      const res = await deleteCatalogue(id);
      if (res.data?.success) {
        toast.success("Deleted");
        refetch();
      } else toast.error(res.data?.message || "Failed");
    } catch (e) { toast.error("Error deleting"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catalogues</h1>
          <p className="text-gray-600 text-sm">Manage downloadable PDF catalogues</p>
        </div>
        <Button onClick={() => navigate("/employee/website/catalogues/create")} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Catalogue
        </Button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. blazer, suit, kurta" className="h-9" />
          </div>
          <div>
            <Label>Search</Label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name/desc" className="h-9" />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => refetch()} className="h-9 bg-orange-600 hover:bg-orange-700 text-white">Filter</Button>
            <Button variant="outline" onClick={() => { setType(""); setSearch(""); refetch(); }} className="h-9">Reset</Button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg">
        {isLoading ? (
          <div className="py-10 text-center text-gray-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2"/> Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {data?.catalogues?.map((c) => (
              <div key={c._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                {c.featuredImageUrl && (
                  <img src={c.featuredImageUrl} alt={c.name} className="w-full h-40 object-cover" />
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{c.name}</h4>
                    <span className="text-[10px] capitalize bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{c.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{c.type}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{c.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => setSelected(c)}> <Eye className="w-4 h-4 mr-1"/> View</Button>
                    <a href={c.driveUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm"> <Download className="w-4 h-4 mr-1"/> Download</Button>
                    </a>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/employee/website/catalogues/update/${c._id}`)}> <FileText className="w-4 h-4 mr-1"/> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(c._id)} disabled={isDeleting}> <Trash2 className="w-4 h-4"/> </Button>
                  </div>
                </div>
              </div>
            ))}
            {(!data?.catalogues || data.catalogues.length === 0) && (
              <div className="col-span-full text-center text-gray-500 py-8">No catalogues found</div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col">
            <div className="p-3 border-b flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{selected.name}</h4>
                <p className="text-xs text-gray-500 capitalize">{selected.category} · {selected.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={selected.driveUrl} target="_blank" rel="noreferrer" className="inline-block">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white" size="sm">
                    <Download className="w-4 h-4 mr-2"/> Download
                  </Button>
                </a>
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
            <div className="flex-1">
              <iframe
                title="Catalogue PDF"
                src={(() => { const m1 = selected.driveUrl?.match(/drive\.google\.com\/file\/d\/([^/]+)/); if (m1 && m1[1]) return `https://drive.google.com/file/d/${m1[1]}/preview`; const m2 = selected.driveUrl?.match(/[?&]id=([^&]+)/); if (m2 && m2[1]) return `https://drive.google.com/file/d/${m2[1]}/preview`; return `https://drive.google.com/viewerng/viewer?embedded=1&url=${encodeURIComponent(selected.driveUrl)}`; })()}
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogues;


