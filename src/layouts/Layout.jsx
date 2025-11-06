import React from 'react'

import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
    <div>
        <Header />
        <main>
            {/* Main content goes here */}
            This is the main content.
        </main>
        <Footer />
    </div>
    </>
  )
}
