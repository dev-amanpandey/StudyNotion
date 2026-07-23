import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col sm:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-visible sm:h-[calc(100vh-3.5rem)] sm:overflow-auto">
        <div className="mx-auto w-full max-w-[1000px] px-4 py-6 sm:w-11/12 sm:px-0 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
