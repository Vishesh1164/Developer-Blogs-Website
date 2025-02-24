'use client'
import { IconCarCrash, IconPencil, IconTrash } from '@tabler/icons-react'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ManageUser = () => {

  const [userList, setUserList] = useState([])
  const [loading, setloading] = useState(false)
  
  const fetchUsers = async () =>{
    setloading(true)
    const res= await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getall`)
    console.log(res.data)
    setUserList(res.data)
    setloading(false)
  }

  useEffect(()=>{
    fetchUsers()
  },[])

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete?')) return

    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/delete/${id}`)
    if (res.status === 200) {
      fetchUsers(res)
      toast.success('User deleted successfully')
    } else {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className="h-screen bg-gray-900 text-white">
      <h1 className="text-center text-3xl font-bold py-5">Manage Users</h1>
      <div className="container mx-auto px-4">
        {loading ? (
          <p className="text-center text-gray-400 text-2xl font-bold">Loading... Please Wait</p>
        ) : (
          <table className="w-full my-10 table-auto">
            <thead className="border-2 border-slate-600 text-white bg-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Password</th>
                <th className="p-3">Registered At</th>
                <th className="p-3" colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user._id} className="border-b border-slate-600">
                  <td className="p-3">{user._id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.password}</td>
                  <td className="p-3">{user.createdAt}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-600 text-white px-3 py-2 rounded-full"
                      onClick={() => deleteUser(user._id)}
                    >
                      <IconTrash />
                    </button>
                  </td>
                  <td className="p-3">
                    <Link
                      href={'/updateuser/' + user._id}
                      className="bg-blue-600 text-white px-3 py-2 rounded-full block w-fit"
                    >
                      <IconPencil />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ManageUser
