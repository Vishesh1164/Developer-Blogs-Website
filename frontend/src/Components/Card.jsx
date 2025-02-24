'use client'
import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ src, user, cover, title, description }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="group relative block rounded-xl overflow-hidden shadow-lg bg-gray-800"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <div className="relative h-[350px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={cover}
          alt="Blog Image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-900 via-transparent text-white">
        <h3 className="text-2xl text-white font-bold group-hover:text-teal-400">
          {title}
        </h3>
        <p className="mt-2 text-gray-300">
          {description}
        </p>
      </div>

      <div className="absolute top-4 left-4 flex items-center gap-3">
        <img
          className="w-12 h-12 rounded-full border-2 border-white"
          src={src}
          alt="Avatar"
        />
        <div>
          <h4 className="text-white font-semibold">{user}</h4>
          <p className="text-gray-400 text-sm">Jan 09, 2021</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
