import axios from 'axios';
import Link from 'next/link'
import React from 'react'

const Vlog = ({ id, title, description, cover, user, src }) => {

  return (
    <>
      {/* Card Blog */}
      <div className="max-w-full sm:max-w-[30rem] sm:min-w-[20rem] px-4 py-5 sm:px-6 lg:px-5 lg:py-10 mx-auto bg-black">

        <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Card */}
          <Link
            className="group flex flex-col h-auto border border-gray-200 hover:border-transparent hover:shadow-lg focus:outline-none focus:border-transparent focus:shadow-lg transition duration-300 rounded-xl p-5 dark:border-neutral-700 dark:hover:border-transparent dark:hover:shadow-black/40 dark:focus:border-transparent dark:focus:shadow-black/40"
            href={'/view-blogs/' + id}
          >
            <div className="w-full sm:w-[100%] lg:w-[100%]">
              <img
                className="w-full object-cover rounded-xl"
                src={cover}
                alt="Blog Image"
              />
            </div>
            <div className="my-6 text-wrap">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:group-hover:text-white break-words">
                {title}
              </h3>
              <p className="mt-5 text-gray-600 dark:text-neutral-400 text-sm md:text-base">
                {description}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-x-3">
              <img
                className="size-8 rounded-full"
                src={src}
                alt="Avatar"
              />
              <div>
                <h5 className="text-sm text-gray-800 dark:text-neutral-200">
                  {`By ${user}`}
                </h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Vlog;
