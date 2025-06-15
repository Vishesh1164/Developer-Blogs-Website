'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Card from './Card';

const Carousal = ({ blogList }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="mySwiper"
      >
        {blogList.map(
          ({ _id, src, publishedBy, cover, title, description, createdAt }) => (
            <SwiperSlide key={_id}>
              <Card
                src={src}
                user={publishedBy}
                cover={cover}
                title={title}
                description={description}
                publishedDate={createdAt}
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

export default Carousal;
