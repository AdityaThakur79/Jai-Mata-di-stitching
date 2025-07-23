
import Navbar from '@/components/admin/content/Navbar'
import Footer from '@/components/Footer'
import React from 'react'
import { Outlet } from 'react-router-dom'

const authLayout = () => {
    return (
        <>
            {/* <Navbar /> */}
            <div>
                <Outlet></Outlet>
            </div>
            <Footer />
        </>
    )
}

export default authLayout
