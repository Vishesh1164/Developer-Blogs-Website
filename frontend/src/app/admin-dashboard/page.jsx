'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconUsers, IconMessageCircle, IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

const AdminDashboard = () => {

   const [loadings, setLoadings] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        router.push('/admin-login');  // Redirect if token not found
      } else {
        setLoadings(false);  // Allow page to render
      }
    }, []);

     if (loadings) return <p>Checking token...</p>;
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Admin Dashboard</h1>
      
      {/* Dashboard Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
        
        {/* Manage Users Card */}
        <Link href="/manage-user">
          <div className="bg-slate-800 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Manage Users</h2>
              <p className="text-gray-400">Manage all user accounts and details.</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full text-white">
              <IconUsers size={32} />
            </div>
          </div>
        </Link>
        
        {/* Manage Contacts Card */}
        <Link href="/manage-contact">
          <div className="bg-slate-800 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Manage Contact Us</h2>
              <p className="text-gray-400">View and manage messages from users.</p>
            </div>
            <div className="bg-green-600 p-3 rounded-full text-white">
              <IconMessageCircle size={32} />
            </div>
          </div>
        </Link>

        {/* Manage Thoughts Card */}
        <Link href="/manage-thoughts">
          <div className="bg-slate-800 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Manage Thoughts</h2>
              <p className="text-gray-400">View and manage all shared thoughts and ideas.</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-full text-white">
              <IconEdit size={32} />
            </div>
          </div>
        </Link>

      </div>
    </div>
  )
}

export default AdminDashboard;
