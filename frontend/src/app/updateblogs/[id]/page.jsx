'use client';
import MarkdownEditor from '@uiw/react-markdown-editor';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { PuffLoader } from 'react-spinners';

const UpdateBlog = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogdata, setBlogdata] = useState(null);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const router = useRouter();
  const isServer= () =>typeof window !== 'undefined';


  useEffect(() => {
    const storedToken = isServer() &&localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const fetchBlog = async () => {
    if(!localStorage.getItem('token')){
      toast.custom("Please login first")
      router.push('/login')

      return
    }
    try {
      const res = await axios.get(`http://localhost:5000/blog/getbyid/${id}`);
      if (res.status === 200) {
        setBlogdata(res.data);
      }
    } catch (err) {
      console.error('Error fetching the blog:', err);
      setError('Error fetching the blog details. Please try again later.');
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const updateBlog = async (values) => {
    if (!token) {
      toast.error('Authentication token missing.');
      return;
    }

    values.profileImage = image || values.profileImage;
    try {
      const res = await axios.put(`http://localhost:5000/blog/update/${id}`, values, {
        headers: { 'x-auth-token': token },
      });
      if (res.status === 200) {
        toast.success('Blog updated successfully!');
        router.push('/my-blogs')
        console.log(values)
      } else {
        toast.error('An error occurred during the update.');
      }
    } catch (err) {
      console.log('Error updating the blog:', err);
      toast.error('Failed to update the blog. Please try again later.');
    }
  };
  const updateImage = async (e) => {
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
      setLoading(false);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      setLoading(false);
      toast.error('Image upload failed!');
    }
  };

  if (load) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-300">
        <PuffLoader size={150} color="#58A6FF" loading={loading} />
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center items-center">
      <motion.div
        className="w-full max-w-5xl bg-gray-800 shadow-xl rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-100">
          Update Blog
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
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
                onChange={updateImage}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
          <div className="flex-1">
            {blogdata === null ? (
              <p className="text-center my-5 text-gray-500 font-bold text-2xl">
                Loading, please wait...
              </p>
            ) : (
              <Formik initialValues={blogdata} onSubmit={updateBlog}>
                {(updateForm) => (
                  <form onSubmit={updateForm.handleSubmit} className="space-y-6">
                    <input
                      type="text"
                      id="title"
                      placeholder="Blog Title"
                      onChange={updateForm.handleChange}
                      value={updateForm.values.title}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                    />
                    <input
                      type="text"
                      id="description"
                      placeholder="Description"
                      onChange={updateForm.handleChange}
                      value={updateForm.values.description}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                    />
                    <MarkdownEditor
                      onChange={(value) => updateForm.setFieldValue('content', value)}
                      value={updateForm.values.content}
                      className="rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 text-gray-200 max-w-[500px]"
                    />
                    <motion.button
                      type="submit"
                      className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={updateForm.isSubmitting}
                    >
                      {updateForm.isSubmitting ? 'Updating...' : 'Update Blog'}
                    </motion.button>
                  </form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateBlog;
