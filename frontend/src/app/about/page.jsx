'use client'
import React from 'react';
import { motion } from 'framer-motion';


const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white min-h-screen">
      {/* About Us Heading */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-5xl font-semibold mb-4">About Us</h2>
          <p className="text-lg mb-6 text-gray-300">
            We are dedicated to providing you with the best experience. Our mission is to bring you the most insightful content and create a community where ideas and creativity flourish.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.5 } }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl"
          >
            <h3 className="text-3xl font-semibold mb-4">Our Mission</h3>
            <p className="text-lg text-gray-300">
              Our mission is to inspire and connect people by delivering high-quality content, offering a platform for creativity, and providing an inclusive environment where everyone&apos;s voice is heard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.5, delay: 0.5 } }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl"
          >
            <h3 className="text-3xl font-semibold mb-4">Our Vision</h3>
            <p className="text-lg text-gray-300">
              Our vision is to become a global leader in content creation, cultivating a space where ideas and creativity come together to shape a brighter, more innovative future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.5, delay: 1 } }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl"
          >
            <h3 className="text-3xl font-semibold mb-4">Our Team</h3>
            <p className="text-lg text-gray-300">
              We have a passionate team of creators, innovators, and thinkers who work together to deliver the best content. Each member brings unique skills and perspectives that shape our creative process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-8 sm:py-12 bg-gray-900 text-center">
        <div className="text-gray-300">
          <p className="text-xl">
            We&apos;re always working towards our vision, and we&apos;re glad to have you as part of our journey.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
