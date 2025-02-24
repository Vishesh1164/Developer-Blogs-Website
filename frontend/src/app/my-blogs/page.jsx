"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BlogManagementPage = () => {
const router = useRouter()

  const [Blog, setBlog] = useState([])
  const [MasterList, setMasterList] = useState([])
  const [Loading, setLoading] = useState(false)
  const fetchBlog = async () => {

    if(!localStorage.getItem('token')){
      toast.custom("Please login first")
      router.push('/login')

      return
    }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getbyemail/${localStorage.getItem('email')}`);
        if (res.status === 200) {
          const data = [...res.data];
          console.log(data);
          setBlog(data);
          setMasterList(data);
          setLoading(false);
        }
      } catch (err) {
        console.log('Error fetching blogs:', err);
        setLoading(false);
      }
    };

    const deleteblog = async (id)=>{

      if(!confirm('Are you sure you want to delete')) return
  
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/blog/delete/${id}`)
      if(res.status===200){
        fetchBlog(res)
         toast.success('Blog deleted successfully')
      }
      else{
        toast.error('Failed to delete Blog')
      }
      
    }
  
    useEffect(() => {
      fetchBlog();
    }, []);

  const handleEdit = (blog) => {
    alert(`Editing blog: ${blog.title}`);
  };

  const handleDelete = (blog) => {
    alert(`Deleting blog: ${blog.title}`);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <header className="py-10 text-center">
        <h1 className="text-4xl font-extrabold text-teal-400 drop-shadow-lg">
          Manage Your Blogs
        </h1>
        <p className="text-gray-400 mt-2">Edit or delete your published blogs easily</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Blog.map((blog) => (
            <div
              key={blog._id}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={blog.cover}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                {/* Blog Title */}
                <h2 className="text-xl font-bold text-teal-300 mb-2">
                  {blog.title}
                </h2>

                {/* Blog Description */}
                <p className="text-gray-300 mb-4">{blog.description}</p>

                <div className="flex justify-between items-center">
                  {/* Edit Button */}
                  <Link
                   href={"/updateblogs/"+blog._id}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition duration-300"
                  >
                    Edit
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteblog(blog._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 border-t border-gray-700">
        <p className="text-gray-500 text-sm">© 2024 Blog Manager. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BlogManagementPage;
