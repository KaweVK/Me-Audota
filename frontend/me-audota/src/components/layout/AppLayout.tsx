import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 lg:px-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
