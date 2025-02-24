import Link from 'next/link';
import React from 'react';

const Vlog = ({ id, title, description, cover, user, src }) => {
  const handleDelete = () => {
    console.log(`Delete blog with ID: ${id}`);
  };

  const handleEdit = () => {
    console.log(`Edit blog with ID: ${id}`);
  };

  return (
    <>
      {/* Card Blog */}
      <div className="max-w-[30rem] min-w-[20rem] px-1 py-5 sm:px-6 lg:px-5 lg:py-10 mx-auto bg-black border border-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-6">
          {/* Card Content */}
          <Link
            className="group flex flex-col h-auto focus:outline-none transition duration-300"
            href={'/view-blogs/' + id}
          >
            {/* Blog Cover Image */}
            <div className="w-full">
              <img
                className="w-full h-[200px] object-cover rounded-xl"
                src={cover}
                alt="Blog Image"
              />
            </div>
            <div className="my-6">
              {/* Blog Title */}
              <h3 className="text-xl font-semibold text-gray-300 dark:group-hover:text-white break-words">
                {title}
              </h3>
              {/* Blog Description */}
              <p className="mt-5 text-gray-400">
                {description}
              </p>
            </div>
            {/* Author Section */}
            <div className="mt-auto flex items-center gap-x-3">
              <img
                className="w-10 h-10 rounded-full"
                src={src}
                alt="Avatar"
              />
              <div>
                <h5 className="text-sm text-gray-400">
                  {`By ${user}`}
                </h5>
              </div>
            </div>
          </Link>

          {/* Edit and Delete Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-500 transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vlog;
