import Footer from '@/components/admin/content/Footer'
import Navbar from '@/components/admin/content/Navbar.jsx'
import ScrollToTop from '@/components/ScrollToTop'
import React from 'react'
import { Outlet } from 'react-router-dom'

const ContentLayout = () => {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <div>
                <Outlet></Outlet>
            </div>
            <Footer />
        </>
    )
}

export default ContentLayout