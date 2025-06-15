'use client';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Vlog from '../../Components/Vlog';
import { motion } from 'framer-motion';
import { IconLoader3 } from '@tabler/icons-react';

const BrowseBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const originalBlogs = useRef([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getall`);
      if (res.status === 200) {
        const data = res.data;
        setBlogs(data);
        setFilteredBlogs(data);
        originalBlogs.current = data;
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = originalBlogs.current.filter(blog =>
      blog.title.toLowerCase().includes(val)
    );
    setFilteredBlogs(filtered);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-300 px-4 py-6">
      {/* Search */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search blogs..."
          className="w-full md:w-1/2 px-4 py-2 bg-gray-800 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <IconLoader3 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((vlog) => (
              <motion.div
                key={vlog._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition-all duration-300"
              >
                <Vlog
                  src={vlog.src}
                  user={vlog.publishedBy}
                  id={vlog._id}
                  title={vlog.title}
                  description={vlog.description}
                  cover={vlog.cover}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400">No blogs found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseBlogs;
