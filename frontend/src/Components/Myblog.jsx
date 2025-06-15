'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const Vlog = ({ id, title, description, cover, user, src }) => {
  const handleDelete = () => {
    console.log(`Delete blog with ID: ${id}`);
  };

  const handleEdit = () => {
    console.log(`Edit blog with ID: ${id}`);
  };

  return (
    <div className="max-w-[30rem] min-w-[20rem] p-6 bg-black border border-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
      {/* Clickable Area */}
      <Link
        href={`/view-blogs/${id}`}
        className="block focus:outline-none transition duration-300"
      >
        {/* Blog Cover Image */}
        <div className="relative w-full h-52 rounded-xl overflow-hidden">
          <Image
            src={cover}
            alt="Blog cover"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Blog Info */}
        <div className="my-4">
          <h3 className="text-xl font-semibold text-gray-300 hover:text-white break-words">
            {title}
          </h3>
          <p className="mt-3 text-gray-400 line-clamp-2">{description}</p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mt-4">
          <Image
            src={src}
            alt="Author"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-sm text-gray-400">By {user}</span>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-500 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Vlog;
