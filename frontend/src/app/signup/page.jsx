'use client'
import { IconBrandGoogle, IconLoader3 } from '@tabler/icons-react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const SignUp = () => {
  const router = useRouter();

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .required('Password Required')
      .matches(/[a-z]/, 'lower case letter is required')
      .matches(/[A-Z]/, 'Upper case letter is required')
      .matches(/[0-9]/, 'Number is required')
      .matches(/[\W]/, 'Special character is required')
      .min(8, 'Minimum 8 characters required'),
    confirmPassword: Yup.string()
      .required('Please confirm password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, values)
        .then(() => {
          toast.success('Registered successfully');
          resetForm();
          router.push('/login');
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Something went wrong');
          setSubmitting(false);
        });
    },
  });

  return (
    <div className="w-full h-[90vh] flex items-center">
      {/* Left side background image */}
      <div className="relative w-1/2 h-[90vh]">
        <img
          src="new.jpg"
          alt=""
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117] to-transparent opacity-50"></div>
      </div>

      {/* Right side sign-up form */}
      <div className="w-1/2 h-full bg-[#0D1117] flex flex-col justify-center px-8 py-10">
        <div className="max-w-[400px] mx-auto text-center">
          <h3 className="text-3xl font-semibold text-white mb-4">Sign Up</h3>
          <p className="text-sm text-[#C9D1D9] mb-4">Welcome! Please enter your details.</p>

          {/* Form Start */}
          <form onSubmit={signupForm.handleSubmit} className="space-y-4">
            {/* Name Input */}
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              {...signupForm.getFieldProps('name')}
              className="w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all"
            />
            {signupForm.touched.name && signupForm.errors.name && (
              <p className="text-xs text-red-600 mt-2" id="name-error">
                {signupForm.errors.name}
              </p>
            )}

            {/* Email Input */}
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              {...signupForm.getFieldProps('email')}
              className="w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all"
            />
            {signupForm.touched.email && signupForm.errors.email && (
              <p className="text-xs text-red-600 mt-2" id="email-error">
                {signupForm.errors.email}
              </p>
            )}

            {/* Password Input */}
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              {...signupForm.getFieldProps('password')}
              className="w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all"
            />
            {signupForm.touched.password && signupForm.errors.password && (
              <p className="text-xs text-red-600 mt-2" id="password-error">
                {signupForm.errors.password}
              </p>
            )}

            {/* Confirm Password Input */}
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              {...signupForm.getFieldProps('confirmPassword')}
              className="w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all"
            />
            {signupForm.touched.confirmPassword && signupForm.errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-2" id="confirmPassword-error">
                {signupForm.errors.confirmPassword}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signupForm.isSubmitting}
              className={`w-full text-white py-3 font-semibold rounded-md flex justify-center items-center transition-all ${
                signupForm.isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#58A6FF] hover:bg-[#0D1117]'
              }`}
            >
              {signupForm.isSubmitting && <IconLoader3 className="animate-spin mr-2" />}
              Sign Up
            </button>

            {/* OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-[#C9D1D9]"></div>
              <span className="text-[#C9D1D9] px-4">or</span>
              <div className="flex-grow border-t border-[#C9D1D9]"></div>
            </div>

            {/* Google Sign-Up Button */}
            <div className="w-full text-[#58A6FF] bg-black hover:bg-[#58A6FF] hover:text-black py-3 font-semibold rounded-md flex justify-center items-center transition-all cursor-pointer">
              <IconBrandGoogle className="h-6 mr-2" />
              Sign Up with Google
            </div>

            {/* Login Link */}
            <div className="w-full text-center mt-6">
              <p className="text-sm text-[#C9D1D9]">
                Already have an account?{' '}
                <span
                  onClick={() => router.push('/login')}
                  className="text-[#58A6FF] font-semibold cursor-pointer"
                >
                  Log in
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
