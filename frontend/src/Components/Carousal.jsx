'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Card from './Card';
import axios from 'axios';

const BlogCarousel = ({ blogList }) => {

  return (
    <div className="max-w-4xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="h-auto mySwiper"
      >
        {blogList.map((blog) => (
          <SwiperSlide key={blog._id}>
            <Card
              src={blog['src']}
              user={blog['publishedBy']}
              cover={blog['cover']}
              title={blog['title']}
              description={blog['description']}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogCarousel;