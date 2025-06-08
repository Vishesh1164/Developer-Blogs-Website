'use client';

import { IconBrandGoogle, IconCheck, IconLoader3 } from '@tabler/icons-react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const SignUp = () => {
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/authenticate`, values, {
            withCredentials: true,
        });
console.log(res.data)
        toast.success('Logged in successfully!');
        if (typeof window !== 'undefined') {
          console.log('hello')
          localStorage.setItem('email', res.data.user.email);
          localStorage.setItem('name', res.data.user.name);
          localStorage.setItem('src', res.data.user.profileImage);
          localStorage.setItem('token',true)
        }
        resetForm();
        router.replace('/');
      } catch (err) { 
        console.log(err);
        toast.error('Invalid username or password.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-center">
      {/* Left Image Section */}
      <div className="relative w-full md:w-1/2 h-1/3 md:h-full hidden md:block">
        <img src="new.jpg" alt="Background" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117] to-transparent opacity-50"></div>
      </div>

      {/* Right Login Section */}
      <div className="w-full md:w-1/2 h-full bg-[#0D1117] flex flex-col justify-center px-6 sm:px-10 py-10">
        <div className="max-w-[400px] mx-auto text-center">
          <h3 className="text-3xl font-semibold text-white mb-4">Log In</h3>
          <p className="text-sm text-[#C9D1D9] mb-4">Welcome back! Please enter your details.</p>

          <form onSubmit={signupForm.handleSubmit} className="space-y-4" noValidate>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                value={signupForm.values.email}
                placeholder="Email"
                className="w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all"
                aria-invalid={signupForm.touched.email && signupForm.errors.email ? 'true' : undefined}
                aria-describedby="email-error"
              />
              {signupForm.touched.email && signupForm.errors.email ? (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {signupForm.errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                value={signupForm.values.password}
                placeholder="Password"
                className="w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all"
                aria-invalid={signupForm.touched.password && signupForm.errors.password ? 'true' : undefined}
                aria-describedby="password-error"
              />
              {signupForm.touched.password && signupForm.errors.password ? (
                <p id="password-error" className="text-red-500 text-sm mt-1">
                  {signupForm.errors.password}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={signupForm.isSubmitting}
              className={`w-full text-white py-3 font-semibold rounded-md flex justify-center items-center transition-all ${
                signupForm.isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#58A6FF] hover:bg-[#0D1117]'
              }`}
            >
              {signupForm.isSubmitting ? <IconLoader3 className="animate-spin mr-2" /> : <IconCheck className="mr-2" />}
              {signupForm.isSubmitting ? 'Verifying...' : 'Log In'}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-[#C9D1D9]"></div>
              <span className="text-[#C9D1D9] px-4">or</span>
              <div className="flex-grow border-t border-[#C9D1D9]"></div>
            </div>

            <div
              className="w-full text-[#58A6FF] bg-black hover:bg-[#58A6FF] hover:text-black py-3 font-semibold rounded-md flex justify-center items-center transition-all cursor-pointer"
              onClick={() => toast('Google login is not implemented yet')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toast('Google login is not implemented yet');
                }
              }}
            >
              <IconBrandGoogle className="h-6 mr-2" />
              Log In with Google
            </div>

            <div className="w-full text-center mt-6">
              <p className="text-sm text-[#C9D1D9]">
                Don&apos;t have an account?
                <span
                  onClick={() => router.push('/signup')}
                  className="text-[#58A6FF] font-semibold cursor-pointer ml-1"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push('/signup');
                    }
                  }}
                >
                  Sign up
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
