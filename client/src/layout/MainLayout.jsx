import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Fabric from '@/components/user/Fabric'
import Feature from '@/components/user/Feature'
import HeroSection from '@/components/user/Herosection'
import Info from '@/components/user/Info'
import UserFooter from '@/components/user/userFooter'
import UserNavbar from '@/components/user/Usernavbar'
import ScrollToTop from '@/components/ScrollToTop'
import React from 'react'
import { Outlet } from 'react-router-dom'

const mainLayout = () => {
    return (
        <>
            <ScrollToTop />
            <UserNavbar />
            <div>
                <Outlet>
                </Outlet>
            </div>
            <UserFooter />
        </>
    )
}

export default mainLayout
