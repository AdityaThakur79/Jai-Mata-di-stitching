import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from 'react'
import { useGetEmployeeProfileQuery, useUpdateEmployeeMutation } from "../../../features/api/employeeApi";
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const { data, isLoading, refetch } = useGetEmployeeProfileQuery();
    const [
        updateEmployee,
        {
            data: updateEmployeeData,
            isLoading: updateEmployeeIsLoading,
            isError,
            error,
            isSuccess,
        },
    ] = useUpdateEmployeeMutation();

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        const fieldName = e.target.name;

        if (file) {
            if (fieldName === "profilePhoto") {
                setProfilePhoto(file);
            }
        }
    };

    const updateEmployeeHandler = async () => {
        const formData = new FormData();
        formData.append("name", name);
        if (profilePhoto) formData.append("profilePhoto", profilePhoto);
        await updateEmployee(formData);
    };

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(updateEmployeeData?.message || "Profile updated.");
        }
        if (isError) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    }, [error, updateEmployeeData, isSuccess, isError]);

    const employee = data && data.employee;
    useEffect(() => {
        if (employee?.name) {
            setName(employee.name);
        }
    }, [employee]);

    //Page Skeleton
    if (isLoading) return (
        <>
            <MyProfile />
        </>
    )
    return (
        <>
            <section className="relative block">
                {/* Banner image removed */}
                <span className="w-full h-full absolute top-0 left-0 opacity-50 bg-black z-1" />
                <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px z-20" style={{ transform: 'translateZ(0px)' }}>
                    <svg
                        className="absolute bottom-0 overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x={0}
                        y={0}
                    >
                        <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100" />
                    </svg>
                </div>
            </section>

            <section className="relative py-16 bg-blueGray-200">
                <div className="container mx-auto px-20">
                    <div className="relative flex flex-col min-w-0 break-words bg-[#FFF7F3] dark:bg-gray-800 w-full mb-6 shadow-xl rounded-lg -mt-64">
                        <div className="px-6">
                            <div className="max-w-4xl mx-auto px-4 my-24">
                                <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                                    <div className="flex flex-col items-center">
                                        <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                                            <AvatarImage
                                                src={employee?.photoUrl} alt={employee?.name}
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <div className="mb-2">
                                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                                Name:
                                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                                    {name}
                                                </span>
                                            </h1>
                                        </div>
                                        <div className="mb-2">
                                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                                Email:
                                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                                    {employee?.email}
                                                </span>
                                            </h1>
                                        </div>
                                        <div className="mb-2">
                                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                                Role:
                                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                                    {employee?.role?.toUpperCase()}
                                                </span>
                                            </h1>
                                        </div>
                                        <div className="mb-2">
                                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                                Status:
                                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                                    {employee?.status === false ? "Deactive" : "Active"}
                                                </span>
                                            </h1>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="mt-2">
                                                    Edit Profile
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Profile</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your profile here. Click save when you're
                                                        done.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label>Name</Label>
                                                        <Input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e?.target?.value)}
                                                            placeholder="Name"
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label>Profile Photo</Label>
                                                        <Input
                                                            onChange={onChangeHandler}
                                                            type="file"
                                                            accept="image/*"
                                                            className="col-span-3"
                                                            id="profilePhoto"
                                                            name="profilePhoto"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        disabled={updateEmployeeIsLoading}
                                                        onClick={updateEmployeeHandler}
                                                    >
                                                        {updateEmployeeIsLoading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Please wait
                                                            </>
                                                        ) : (
                                                            "Save Changes"
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <div className="mb-2 mt-4 text-center">
                                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                                <h1 className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                                    {employee?.status === false ? "Your account is deactivated. Please contact support for assistance." : ""}
                                                </h1>
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Profile

const MyProfile = () => {
    return (
        <>
            <section className="relative block h-500-px">
                <div className="absolute top-0 w-full h-full bg-center bg-cover bg-gray-200">
                    <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black" />
                </div>
                <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style={{ transform: "translateZ(0px)" }}>
                    <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x={0} y={0}>
                        <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100" />
                    </svg>
                </div>
            </section>
            <section className="relative py-16 bg-blueGray-200">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-800 w-full mb-6 shadow-xl rounded-lg -mt-64">
                        <div className="px-6">
                            <div className="max-w-4xl mx-auto px-4 my-24">
                                <div className="flex justify-center md:justify-start">
                                    <Skeleton className="h-8 w-24 mb-6" />
                                </div>

                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                                    <div className="flex flex-col items-center">
                                        <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full mb-4" />
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center">
                                            <Skeleton className="h-6 w-16 mr-2" />
                                            <Skeleton className="h-6 w-32 sm:w-48 mt-1 sm:mt-0" />
                                        </div>
                                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center">
                                            <Skeleton className="h-6 w-16 mr-2" />
                                            <Skeleton className="h-6 w-40 sm:w-64 mt-1 sm:mt-0" />
                                        </div>
                                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center">
                                            <Skeleton className="h-6 w-16 mr-2" />
                                            <Skeleton className="h-6 w-24 mt-1 sm:mt-0" />
                                        </div>
                                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center">
                                            <Skeleton className="h-6 w-16 mr-2" />
                                            <Skeleton className="h-6 w-16 mt-1 sm:mt-0" />
                                        </div>
                                        <div className="mt-4">
                                            <Skeleton className="h-9 w-24" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};