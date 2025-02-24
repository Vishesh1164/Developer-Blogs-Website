'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Vlog from '../../Components/Vlog';
import { motion } from 'framer-motion';
import { IconLoader3 } from '@tabler/icons-react';


const BrowseBlogs = () => {
  const [blog, setBlog] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getall`);
      if (res.status === 200) {
        const data = [...res.data];
        setBlog(data);
        setMasterList(data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const searchBlog = (e) => {
    const val = e.target.value;
    const filteredData = masterList.filter((item) =>
      item.title.toLowerCase().includes(val.toLowerCase())
    );
    setBlog(filteredData);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-300 px-4 py-6">
      {/* Search Bar */}
      <div className="mb-8 text-center">
        <input
          type="text"
          onChange={searchBlog}
          placeholder="Search blogs..."
          className="w-full md:w-1/2 px-4 py-2 bg-gray-800 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <IconLoader3 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : (
        // Blog Cards
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {blog.map((vlog) => (
            <motion.div
              key={vlog._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseBlogs;
