'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Card = ({ src, user, cover, title, description, publishedDate }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <motion.div
      className="group relative block rounded-xl overflow-hidden shadow-lg bg-gray-800"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      {/* Cover Image */}
      <div className="relative h-[350px] w-full">
        <Image
          src={cover}
          alt="Blog Cover"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      </div>

      {/* Bottom Title & Description */}
      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-900 via-transparent text-white">
        <h3 className="text-2xl font-bold group-hover:text-teal-400">{title}</h3>
        <p className="mt-2 text-gray-300 line-clamp-2">{description}</p>
      </div>

      {/* User Avatar & Info */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <Image
          src={src}
          alt="User Avatar"
          width={48}
          height={48}
          className="rounded-full border-2 border-white"
        />
        <div>
          <h4 className="text-white font-semibold">{user}</h4>
          <p className="text-gray-400 text-sm">{formattedDate}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
