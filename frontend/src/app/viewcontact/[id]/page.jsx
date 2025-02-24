'use client'
import { IconCheck, IconLoader3 } from '@tabler/icons-react'
import axios from 'axios'
import { Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import { Contactouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const UpdateContact = () => {
  const { id } = useParams()

  const router = useRouter()

  const [contactData, setcontactData] = useState([])

  const fetchContactDat = async () => {
    const res = await axios.get(`${NEXT_PUBLIC_API_URL}/contact/getbyid/${id}`)
    console.log(res.data)
    setcontactData(res.data)
  }

  useEffect(() => {
    fetchContactDat()
  }, [])


  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-10 text-white">
    <div className="max-w-md w-full bg-gray-800 p-8 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-teal-400">Contact Information</h1>

      {/* Name */}
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-300">Name:</h2>
        <p className="text-xl text-white">{contactData.name}</p>
      </div>

      {/* Email */}
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-300">Email:</h2>
        <p className="text-xl text-white">{contactData.email}</p>
      </div>

      {/* Message */}
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-300">Message:</h2>
        <p className="text-xl text-white">{contactData.message}</p>
      </div>

      {/* Action Button */}
      <button
        className="w-full mt-6 bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition duration-300"
        onClick={() => alert('Marked as solved!')}
      >
        Mark as Solved
      </button>
    </div>
  </div>
  )
}

export default UpdateContact