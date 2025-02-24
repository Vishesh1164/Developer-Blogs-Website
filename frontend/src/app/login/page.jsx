'use client'
import { IconBrandGoogle, IconCheck, IconLoader3 } from '@tabler/icons-react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const SignUp = () => {
  const isServer= () =>typeof window !== 'undefined';
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios
        .post('http://localhost:5000/user/authenticate', values)
        .then((res) => {
          toast.success('Logged in successfully!');
          console.log(res)
          isServer() &&localStorage.setItem('email', res.data.email);
          isServer() &&localStorage.setItem('name', res.data.name);
          isServer() &&localStorage.setItem('src', res.data.profileImage);
          isServer() &&localStorage.setItem('token', res.data.token);
          window.location.replace("/")
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error('Invalid username or password.');
          setSubmitting(false);
        });
    },
  });

  return (
    <div className='w-full h-[90vh] flex items-center'>

      <div className='relative w-1/2 h-[90vh]'>
        <img src="new.jpg" alt="" className='w-full h-full object-cover opacity-60' />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117] to-transparent opacity-50"></div>
      </div>


      <div className='w-1/2 h-full bg-[#0D1117] flex flex-col justify-center px-8 py-10'>
        <div className='max-w-[400px] mx-auto text-center'>
          <h3 className='text-3xl font-semibold text-white mb-4'>Log In</h3>
          <p className='text-sm text-[#C9D1D9] mb-4'>Welcome back! Please enter your details.</p>


          <form onSubmit={signupForm.handleSubmit} className='space-y-4'>


            <input
              type="email"
              id='email'
              onChange={signupForm.handleChange}
              value={signupForm.values.email}
              placeholder='Email'
              className='w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all'
            />

            {/* Password Input */}
            <input
              type="password"
              id='password'
              onChange={signupForm.handleChange}
              value={signupForm.values.password}
              placeholder='Password'
              className='w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all'
            />


            {/* Submit Button */}
            <button
              type='submit'
              className='w-full text-white bg-[#58A6FF] hover:bg-[#0D1117] py-3 font-semibold rounded-md flex justify-center items-center transition-all'>
              {signupForm.isSubmitting ? <IconLoader3 className='animate-spin' /> : <IconCheck />}
              {signupForm.isSubmitting ? 'Verifying...' : 'Log In'}
            </button>

            {/* OR Divider */}
            <div className='flex items-center my-4'>
              <div className='flex-grow border-t border-[#C9D1D9]'></div>
              <span className='text-[#C9D1D9] px-4'>or</span>
              <div className='flex-grow border-t border-[#C9D1D9]'></div>
            </div>

            {/* Google Sign-Up Button */}
            <div className='w-full text-[#58A6FF] bg-black hover:bg-[#58A6FF] hover:text-black py-3 font-semibold rounded-md flex justify-center items-center transition-all'>
              <IconBrandGoogle className='h-6 mr-2' />
              Log In with Google
            </div>

            {/* Login Link */}
            <div className='w-full text-center mt-6'>
              <p className='text-sm text-[#C9D1D9]'>
                Don&apos;t have an account?
                <span
                  onClick={() => router.push("/signup")}
                  className='text-[#58A6FF] font-semibold cursor-pointer'
                > Sign up</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
