'use client';

import { IconBrandGoogle, IconCheck, IconLoader3 } from '@tabler/icons-react';
import axios from 'axios';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
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

        toast.success('Logged in successfully!');
        if (typeof window !== 'undefined') {
          Cookies.set('email', res.data.user.email);
          Cookies.set('name', res.data.user.name);
          Cookies.set('src', res.data.user.profileImage);
          Cookies.set('token', 'true');
        }

        resetForm();
        router.replace('/');
      } catch (err) {
        console.error(err);
        toast.error('Invalid username or password.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161B22] p-8 rounded-2xl shadow-lg">
        <h3 className="text-3xl font-bold text-white mb-2 text-center">Log In</h3>
        <p className="text-sm text-gray-400 text-center mb-6">Welcome back! Please enter your details.</p>

        <form onSubmit={signupForm.handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              value={signupForm.values.email}
              className="w-full py-2 px-4 text-white bg-[#0D1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58A6FF]"
              aria-invalid={signupForm.touched.email && signupForm.errors.email ? 'true' : undefined}
              aria-describedby="email-error"
            />
            {signupForm.touched.email && signupForm.errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">{signupForm.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              value={signupForm.values.password}
              className="w-full py-2 px-4 text-white bg-[#0D1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58A6FF]"
              aria-invalid={signupForm.touched.password && signupForm.errors.password ? 'true' : undefined}
              aria-describedby="password-error"
            />
            {signupForm.touched.password && signupForm.errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">{signupForm.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signupForm.isSubmitting}
            className={`w-full flex items-center justify-center py-3 text-white font-medium rounded-md transition-all ${
              signupForm.isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#58A6FF] hover:bg-[#1f2937]'
            }`}
          >
            {signupForm.isSubmitting ? (
              <>
                <IconLoader3 className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <IconCheck className="mr-2" />
                Log In
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <hr className="flex-grow border-gray-600" />
            <span className="text-gray-400">or</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          {/* Google Login (Not Implemented) */}
          <div
            className="w-full flex justify-center items-center text-[#58A6FF] bg-black hover:bg-[#58A6FF] hover:text-black py-3 rounded-md cursor-pointer transition-all"
            role="button"
            onClick={() => toast('Google login is not implemented yet')}
            tabIndex={0}
            onKeyDown={(e) => ['Enter', ' '].includes(e.key) && toast('Google login is not implemented yet')}
          >
            <IconBrandGoogle className="h-6 mr-2" />
            Log In with Google
          </div>

          {/* Sign-up redirect */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?
            <span
              className="text-[#58A6FF] font-semibold cursor-pointer ml-1"
              onClick={() => router.push('/signup')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => ['Enter', ' '].includes(e.key) && router.push('/signup')}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
