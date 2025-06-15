'use client';

import MarkdownEditor from '@uiw/react-markdown-editor';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

const UpdateBlog = () => {
  const { id } = useParams();
  const router = useRouter();

  const [blogdata, setBlogdata] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Start as true, set to false only if auth fails

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getuser`, {
          withCredentials: true,
        });
      } catch {
        setIsAuthenticated(false);
        toast.error('Please login first');
        router.push('/login');
      }
    };
    checkAuth();
  }, []);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getbyid/${id}`, {
          withCredentials: true,
        });
        setBlogdata(res.data);
      } catch (err) {
        setError('Failed to fetch blog. Please try again later.');
      }
    };
    fetchBlog();
  }, [id]);

  // Image upload handler
  const updateImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset2832');
    formData.append('cloud_name', 'dshlv1jgu');
    setLoading(true);

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dshlv1jgu/image/upload', formData);
      setImage(res.data.url);
      toast.success('Image uploaded successfully!');
    } catch {
      toast.error('Image upload failed!');
    } finally {
      setLoading(false);
    }
  };

  // Update blog handler
  const updateBlog = async (values) => {
    const updatedValues = {
      ...values,
      profileImage: image || values.profileImage,
    };

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/update/${id}`,
        updatedValues,
        { withCredentials: true }
      );
      toast.success('Blog updated successfully!');
      router.push('/my-blogs');
    } catch (err) {
      toast.error('Failed to update the blog. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Checking authentication...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 bg-gray-900 text-gray-300">
        <h2 className="text-2xl text-red-500">{error}</h2>
      </div>
    );
  }

  if (!blogdata) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <p className="text-xl text-gray-400 animate-pulse">Loading blog data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center items-center">
      <motion.div
        className="w-full max-w-5xl bg-gray-800 shadow-xl rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-100">Update Blog</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Upload */}
          <div className="flex-1 bg-gray-700 p-6 border-2 border-dashed border-gray-600 rounded-xl">
            <label htmlFor="image" className="cursor-pointer text-lg text-gray-400">
              <div className="text-center">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto" />
                  </div>
                ) : (
                  <img
                    src={image || blogdata.profileImage}
                    alt="Cover"
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>
              <input
                type="file"
                id="image"
                onChange={updateImage}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* Blog Form */}
          <div className="flex-1">
            <Formik initialValues={blogdata} onSubmit={updateBlog} enableReinitialize>
              {(form) => (
                <form onSubmit={form.handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    name="title"
                    placeholder="Blog Title"
                    onChange={form.handleChange}
                    value={form.values.title}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={form.handleChange}
                    value={form.values.description}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  />
                  <MarkdownEditor
                    value={form.values.content}
                    onChange={(value) => form.setFieldValue('content', value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                    style={{ maxHeight: 400, overflowY: 'auto' }}
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={form.isSubmitting}
                  >
                    {form.isSubmitting ? 'Updating...' : 'Update Blog'}
                  </motion.button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateBlog;
