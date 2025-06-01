'use client'
import { IconCheck, IconLoader3 } from '@tabler/icons-react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const UpdateContact = () => {
  const { id } = useParams()
  const router = useRouter()

  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [solving, setSolving] = useState(false)

  const fetchContactData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/contact/getbyid/${id}`,
        { withCredentials: true }
      )
      setContactData(res.data)
    } catch (error) {
      toast.error('Failed to fetch contact data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContactData()
  }, [])

  const handleMarkAsSolved = async () => {
    try {
      setSolving(true)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/contact/marksolved/${id}`,
        {}, // if your API needs a body, send it here
        { withCredentials: true }
      )
      toast.success('Marked as solved!')
      router.push('/contacts') // Redirect after success (change path if needed)
    } catch (error) {
      toast.error('Failed to mark as solved')
      console.error(error)
    } finally {
      setSolving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <IconLoader3 className="animate-spin" size={40} />
      </div>
    )
  }

  if (!contactData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <p>No contact data found.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-10 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-teal-400">
          Contact Information
        </h1>

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
          disabled={solving}
          onClick={handleMarkAsSolved}
          className="w-full mt-6 bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {solving ? (
            <>
              <IconLoader3 className="animate-spin" />
              Marking...
            </>
          ) : (
            <>
              <IconCheck />
              Mark as Solved
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default UpdateContact
