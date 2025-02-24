'use client'
import { IconCarCrash, IconPencil, IconTrash } from '@tabler/icons-react'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Managethought = () => {

  const [thoughtList, setthoughtList] = useState([])
  const [loading, setloading] = useState(false)
  
  const fetchthoughts = async () =>{
    setloading(true)
    const res= await axios.get('http://localhost:5000/thought/getall')
    console.log(res.data)
    setthoughtList(res.data)
    setloading(false)
  }

  useEffect(()=>{
    fetchthoughts()
  },[])

  const deletethought = async (id) => {
    if (!confirm('Are you sure you want to delete?')) return

    const res = await axios.delete(`http://localhost:5000/thought/delete/${id}`)
    if (res.status === 200) {
      fetchthoughts(res)
      toast.success('thought deleted successfully')
    } else {
      toast.error('Failed to delete thought')
    }
  }

  return (
    <div className="h-screen bg-gray-900 text-white">
      <h1 className="text-center text-3xl font-bold py-5">Manage thoughts</h1>
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
                <th className="p-3">Thought</th>
                <th className="p-3">Recieved At</th>
                <th className="p-3" colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {thoughtList.map((thoughts) => (
                <tr key={thoughts._id} className="border-b border-slate-600">
                  <td className="p-3">{thoughts._id}</td>
                  <td className="p-3">{thoughts.name}</td>
                  <td className="p-3">{thoughts.email}</td>
                  <td className="p-3">{thoughts.thought}</td>
                  <td className="p-3">{thoughts.createdAt}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-600 text-white px-3 py-2 rounded-full"
                      onClick={() => deletethought(thoughts._id)}
                    >
                      <IconTrash />
                    </button>
                  </td>
                  <td className="p-3">
                    <Link
                      href={'/updatethought/' + thoughts._id}
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

export default Managethought
