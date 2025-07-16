import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Fabric from '@/components/user/Fabric'
import Feature from '@/components/user/Feature'
import HeroSection from '@/components/user/Herosection'
import Info from '@/components/user/Info'
import UserNavbar from '@/components/user/Usernavbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const mainLayout = () => {
    return (
        <>
            <UserNavbar />
            <div>
                <Outlet>
                   

                </Outlet>
            </div>
            <Footer />
        </>
    )
}

export default mainLayout
