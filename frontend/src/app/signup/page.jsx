'use client';
import { IconBrandGoogle, IconLoader3 } from '@tabler/icons-react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const InputField = ({ id, type, placeholder, formik }) => (
  <>
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      {...formik.getFieldProps(id)}
      className="w-full text-[#C9D1D9] py-2 px-4 bg-transparent border-b-2 border-white outline-none focus:ring-2 focus:ring-[#58A6FF] transition-all"
    />
    {formik.touched[id] && formik.errors[id] && (
      <p className="text-xs text-red-600 mt-2">{formik.errors[id]}</p>
    )}
  </>
);

const SignUp = () => {
  const router = useRouter();

  const SignupSchema = Yup.object({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .required('Password Required')
      .matches(/[a-z]/, 'Lower case letter is required')
      .matches(/[A-Z]/, 'Upper case letter is required')
      .matches(/[0-9]/, 'Number is required')
      .matches(/[\W]/, 'Special character is required')
      .min(8, 'Minimum 8 characters required'),
    confirmPassword: Yup.string()
      .required('Please confirm password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const onSubmit = useCallback(async (values, { resetForm, setSubmitting }) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, values);
      toast.success('Registered successfully');
      resetForm();
      router.push('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
      setSubmitting(false);
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit,
  });

  return (
    <div className="w-full h-[90vh] flex items-center">
      {/* Left Image */}
      <div className="relative w-1/2 h-full">
        <img src="new.jpg" alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117] to-transparent opacity-50" />
      </div>

      {/* Right Form */}
      <div className="w-1/2 h-full bg-[#0D1117] flex flex-col justify-center px-8 py-10">
        <div className="max-w-[400px] mx-auto text-center">
          <h3 className="text-3xl font-semibold text-white mb-4">Sign Up</h3>
          <p className="text-sm text-[#C9D1D9] mb-4">Welcome! Please enter your details.</p>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <InputField id="name" type="text" placeholder="Full Name" formik={formik} />
            <InputField id="email" type="email" placeholder="Email" formik={formik} />
            <InputField id="password" type="password" placeholder="Password" formik={formik} />
            <InputField
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              formik={formik}
            />

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full text-white py-3 font-semibold rounded-md flex justify-center items-center transition-all ${
                formik.isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#58A6FF] hover:bg-[#0D1117]'
              }`}
            >
              {formik.isSubmitting && <IconLoader3 className="animate-spin mr-2" />}
              Sign Up
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-[#C9D1D9]" />
              <span className="text-[#C9D1D9] px-4">or</span>
              <div className="flex-grow border-t border-[#C9D1D9]" />
            </div>

            <div className="w-full text-[#58A6FF] bg-black hover:bg-[#58A6FF] hover:text-black py-3 font-semibold rounded-md flex justify-center items-center transition-all cursor-pointer">
              <IconBrandGoogle className="h-6 mr-2" />
              Sign Up with Google
            </div>

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
