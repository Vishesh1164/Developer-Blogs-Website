'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IconLoader3 } from '@tabler/icons-react';

const ContactUs = () => {
  const isServer= () =>typeof window !== 'undefined';

  const router = useRouter();

  const contactForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      console.log(values);

      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact/add`, values,{withCredentials:true})
        .then((result) => {
          toast.success('Sent successfully');
          resetForm();
          router.push('/');
        }).catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message || 'Something went wrong');
          setSubmitting(false);
        });
    }
  });

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white min-h-screen overflow-hidden">
      {/* Contact Us Heading */}
      <section className="py-8 sm:py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-5xl font-semibold mb-4">Contact Us</h2>
          <p className="text-lg mb-4 text-gray-300">
            We&apos;d love to hear from you! Fill out the form below, and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            className="bg-gray-900 p-8 rounded-lg shadow-lg"
          >
            <form onSubmit={contactForm.handleSubmit} >
              {/* Name Input */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-semibold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  onChange={contactForm.handleChange}
                  value={contactForm.values.name}
                  className="w-full p-4 bg-gray-800 text-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  onChange={contactForm.handleChange}
                  value={contactForm.values.email}
                  className="w-full p-4 bg-gray-800 text-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div className="mb-4">
                <label htmlFor="message" className="block text-lg font-semibold mb-2">Message</label>
                <textarea
                  id="message"
                  onChange={contactForm.handleChange}
                  value={contactForm.values.message}
                  className="w-full p-4 bg-gray-800 text-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows="6"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-10 rounded-lg shadow-lg text-xl hover:scale-105 transition-transform duration-300"
                  
                >
                  {contactForm.isSubmitting ? <IconLoader3 className='animate-spin' /> :''}
                  {contactForm.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-8">
        <div className="text-center text-gray-300">
          <p className="text-xl">
            Feel free to get in touch with us! We&apos;re here to help and will get back to you as soon as possible.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
