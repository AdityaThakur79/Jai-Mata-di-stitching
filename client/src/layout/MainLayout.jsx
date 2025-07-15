import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Fabric from '@/components/user/Fabric'
import Feature from '@/components/user/Feature'
import HeroSection from '@/components/user/Herosection'
import Info from '@/components/user/Info'
import React from 'react'
import { Outlet } from 'react-router-dom'

const mainLayout = () => {
    return (
        <>
            <Navbar />
            <div>
                <Outlet>
                    <HeroSection/>
                    <Feature/>

                    <Fabric />
                    <Info/>

                </Outlet>
            </div>
            <Footer />
        </>
    )
}

export default mainLayout
