import React, { useState } from "react";
import { useGetAllBranchesQuery, useDeleteBranchMutation } from "@/features/api/branchApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GrPowerCycle } from "react-icons/gr";

const Branches = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, refetch } = useGetAllBranchesQuery();
  const [deleteBranch] = useDeleteBranchMutation();

  const handleEdit = (branch) => {
    navigate("/admin/update-branch", { state: { branch } });
  };

  const handleDelete = async (branchId) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteBranch(branchId).unwrap();
        toast.success("Branch deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete branch");
      }
    }
  };

  // Filter branches by search query
  const filteredBranches = data?.branches?.filter(
    (b) =>
      b.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.gst.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-[100vh] rounded-md">
      <div className="md:p-6 p-2">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <h2 className="md:text-xl font-semibold text-gray-700 dark:text-white">
            All Branches
          </h2>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Search by name, address, phone, email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500"
            />
            <Button onClick={() => navigate("/admin/create-branch")}>Add Branch</Button>
            <Button className="p-2" onClick={refetch}>
              <GrPowerCycle />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-md shadow border bg-white dark:bg-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">GST</th>
                <th className="px-4 py-2 border">PAN</th>
                <th className="px-4 py-2 border">SCN</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center py-4">Loading...</td></tr>
              ) : filteredBranches?.length ? (
                filteredBranches.map((branch) => (
                  <tr key={branch._id} className="even:bg-gray-50 dark:even:bg-gray-900">
                    <td className="border px-4 py-2">{branch.branchName}</td>
                    <td className="border px-4 py-2">{branch.address}</td>
                    <td className="border px-4 py-2">{branch.gst}</td>
                    <td className="border px-4 py-2">{branch.pan}</td>
                    <td className="border px-4 py-2">{branch.scn}</td>
                    <td className="border px-4 py-2">{branch.phone}</td>
                    <td className="border px-4 py-2">{branch.email}</td>
                    <td className="border px-4 py-2 capitalize">{branch.status}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <Button size="sm" onClick={() => handleEdit(branch)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(branch._id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={9} className="text-center py-4">No branches found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Branches; 