'use client'
import { IconCarCrash, IconPencil, IconTrash } from '@tabler/icons-react'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ManageContact = () => {

  const [contactList, setContactList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchContacts = async () => {
    setLoading(true)
    const res = await axios.get('http://localhost:5000/contact/getall')
    console.log(res.data)
    setContactList(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete?')) return

    const res = await axios.delete(`http://localhost:5000/contact/delete/${id}`)
    if (res.status === 200) {
      fetchContacts()
      toast.success('Contact deleted successfully')
    } else {
      toast.error('Failed to delete contact')
    }
  }

  return (
    <div className="h-screen bg-gray-900 text-white">
      <h1 className="text-center text-3xl font-bold py-5">Manage Contact Us Form</h1>
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
                <th className="p-3">Message</th>
                <th className="p-3">Sent At</th>
                <th className="p-3" colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {contactList.map((contact) => (
                <tr key={contact._id} className="border-b border-slate-600 hover:bg-slate-700">
                  <td className="p-3">{contact._id}</td>
                  <td className="p-3">{contact.name}</td>
                  <td className="p-3">{contact.email}</td>
                  <td className="p-3">{contact.message}</td>
                  <td className="p-3">{contact.createdAt}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700"
                      onClick={() => deleteContact(contact._id)}
                    >
                      <IconTrash />
                    </button>
                  </td>
                  <td className="p-3">
                    <Link
                      href={'/viewcontact/' + contact._id}
                      className="bg-blue-600 text-white px-3 py-2 rounded-full block w-fit hover:bg-blue-700"
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

export default ManageContact
