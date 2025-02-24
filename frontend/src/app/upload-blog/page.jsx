'use client'

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; 
import { useRouter } from 'next/navigation';

// Handle ResizeObserver issue
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Dynamically import Markdown Editor (Fixes SSR issues)
const MarkdownEditor = dynamic(() => import('@uiw/react-markdown-editor'), { ssr: false });

const UploadBlog = () => {
  const [contentValue, setContentValue] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Ensure client-side execution
  const isServer = () => typeof window !== 'undefined';
  const token = isServer() ? localStorage.getItem('token') : null;

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!token) {
      router.push('/login');
      toast.error("Please login first");
    }
  }, [token, router]);

  // Formik for blog upload
  const uploadBlog = useFormik({
    initialValues: {
      title: '',
      description: '',
      cover: '',
      content: '',
      publishedBy: '',
      email: '',
      src: '',
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      values.content = contentValue;
      values.email = isServer() ? localStorage.getItem('email') : '';
      values.publishedBy = isServer() ? localStorage.getItem('name') : '';
      values.src = isServer() ? localStorage.getItem('src') : '';

      setSubmitting(true);
      axios
        .post(`${NEXT_PUBLIC_API_URL}/blog/add`, values, {
          headers: { 'x-auth-token': token }
        })
        .then(() => {
          toast.success('Blog uploaded successfully!');
          resetForm();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Something went wrong');
          setSubmitting(false);
        });
    },
  });

  // Image Upload Function
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset2832');
    formData.append('cloud_name', 'dshlv1jgu');
    setLoading(true);

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dshlv1jgu/image/upload',
        formData
      );
      setImage(res.data.url);
      uploadBlog.setFieldValue('cover', res.data.url);
      setLoading(false);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      setLoading(false);
      toast.error('Image upload failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center items-center">
      <motion.div
        className="w-full max-w-5xl bg-gray-800 shadow-xl rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-100">
          Upload Blog
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Upload Section */}
          <div className="flex-1 bg-gray-700 p-6 border-2 border-dashed border-gray-600 rounded-xl">
            <label htmlFor="image" className="cursor-pointer text-lg text-gray-400">
              <div className="text-center">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto" />
                  </div>
                ) : image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-gray-500">Click to upload an image</span>
                )}
              </div>
              <input
                type="file"
                id="image"
                onChange={uploadImage}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* Blog Details Form */}
          <div className="flex-1">
            <form onSubmit={uploadBlog.handleSubmit} className="space-y-6">
              {/* Blog Title */}
              <input
                type="text"
                id="title"
                placeholder="Blog Title"
                value={uploadBlog.values.title}
                onChange={uploadBlog.handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />

              {/* Blog Description */}
              <input
                type="text"
                id="description"
                placeholder="Description"
                value={uploadBlog.values.description}
                onChange={uploadBlog.handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />

              {/* Markdown Editor with Scroll */}
              <div className="space-y-4">
                <div className="relative">
                  <MarkdownEditor
                    value={contentValue}
                    onChange={setContentValue}
                    className="rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 text-gray-200"
                    minHeight={200}
                    maxHeight={500} 
                    width="100%"
                    style={{
                      maxHeight: '400px', 
                      overflowY: 'auto',
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={uploadBlog.isSubmitting}
              >
                {uploadBlog.isSubmitting ? 'Uploading...' : 'Upload Blog'}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadBlog;
