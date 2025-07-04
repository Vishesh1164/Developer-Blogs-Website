'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PuffLoader } from 'react-spinners';

const ViewBlog = () => {
  const { id } = useParams();
  const [blogDetails, setBlogDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getbyid/${id}`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setBlogDetails(res.data);
        } else {
          setError('Failed to fetch blog details.');
        }
      } catch (err) {
        setError('Error fetching the blog details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-300">
        <PuffLoader size={150} color="#58A6FF" loading={true} />
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
    <div className="bg-gray-900 min-h-screen p-5 md:p-10 text-gray-300">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h1 className="text-4xl font-bold text-white mb-6">{blogDetails?.title}</h1>
        <p className="text-lg text-gray-400 mb-4">{blogDetails?.description}</p>

        {blogDetails?.cover && (
          <div className="mb-8">
            <img
              src={blogDetails.cover}
              alt={blogDetails.title || 'Blog Cover'}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
        )}

        <div className="text-gray-300 leading-relaxed mb-8">
          <div dangerouslySetInnerHTML={{ __html: blogDetails?.content || '' }} />
        </div>

        <div className="flex items-center mt-4">
          <span className="font-semibold text-gray-400">
            Published by: <span className="text-blue-400">{blogDetails?.publishedBy}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
