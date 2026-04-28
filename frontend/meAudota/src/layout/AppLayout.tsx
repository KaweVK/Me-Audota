import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { NavBar } from '../components/NavBar'

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-8 md:px-8 md:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
