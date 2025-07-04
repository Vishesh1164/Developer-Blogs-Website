'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const MarkdownEditor = dynamic(() => import('@uiw/react-markdown-editor'), { ssr: false });

const UploadBlog = () => {
  const [contentValue, setContentValue] = useState('');
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getuser`, {
          withCredentials: true,
        });
        setUserData(res.data);
        setIsAuthenticated(true);
      } catch {
        toast.error('Please login first');
        router.push('/login');
      }
    })();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      cover: '',
      content: '',
      publishedBy: '',
      email: '',
      src: '',
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.content = contentValue;
      values.email = userData?.email || '';
      values.publishedBy = userData?.name || '';
      values.src = userData?.src || '';

      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blog/add`, values, {
          withCredentials: true,
        });
        toast.success('Blog uploaded successfully!');
        resetForm();
        setImage(null);
        setContentValue('');
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || 'Failed to upload blog');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset2832');
    formData.append('cloud_name', 'dshlv1jgu');

    setLoadingImage(true);

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dshlv1jgu/image/upload',
        formData
      );
      const url = res.data.url;
      setImage(url);
      formik.setFieldValue('cover', url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setLoadingImage(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Checking authentication...
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
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-100">
          Upload Blog
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Upload */}
          <div className="flex-1 bg-gray-700 p-6 border-2 border-dashed border-gray-600 rounded-xl">
            <label htmlFor="image" className="cursor-pointer text-lg text-gray-400">
              <div className="text-center">
                {loadingImage ? (
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto" />
                  </div>
                ) : image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-64 object-cover rounded-xl"
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

          {/* Form Section */}
          <div className="flex-1">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {['title', 'description'].map((field) => (
                <input
                  key={field}
                  type="text"
                  id={field}
                  name={field}
                  placeholder={`Enter ${field}`}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
              ))}

              <div>
                <MarkdownEditor
                  value={contentValue}
                  onChange={setContentValue}
                  className="rounded-lg bg-gray-700 border border-gray-600"
                  minHeight={200}
                  maxHeight={500}
                  width="100%"
                  style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Uploading...' : 'Upload Blog'}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadBlog;
