
import Navbar from '@/components/admin/content/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import React from 'react'
import { Outlet } from 'react-router-dom'

const authLayout = () => {
    return (
        <>
            <ScrollToTop />
            {/* <Navbar /> */}
            <div>
                <Outlet></Outlet>
            </div>
            <Footer />
        </>
    )
}

export default authLayout
