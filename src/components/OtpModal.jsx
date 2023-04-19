import React, { useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import app from '../firebase/firebase'
import swal from 'sweetalert'
import { addDoc } from 'firebase/firestore'
import { usersRef } from '../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'

const auth = getAuth(app)

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [OTP, setOTP] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }
  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    )
  }

  const requestOtp = () => {
    setLoading(true)
    generateRecaptha()
    let appVerifier = window.recaptchaVerifier
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult
        swal({
          text: 'OTP Sent',
          icon: 'success',
          buttons: false,
          timer: 2000,
        })
        setOtpSent(true)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const verifyOTP = () => {
    try {
      setLoading(true)
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData()
        swal({
          text: 'Sucessfully Registered',
          icon: 'success',
          buttons: false,
          timer: 2000,
        })
        navigate('/login')
        setLoading(false)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const uploadData = async () => {
    try {
      const salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(form.password, salt)
      await addDoc(usersRef, {
        name: form.name,
        password: hash,
        mobile: form.mobile,
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className=" md:w-1/2 p-8 m-auto">
      <div className="flex my-8 justify-center">
        <h1 className="text-3xl font-bold">SignUp</h1>
      </div>
      {otpSent ? (
        <div className="mb-6">
          <label
            for="otp"
            className="block mb-2 text-sm font-medium text-white"
          >
            One Time Password
          </label>
          <input
            id="otp"
            name="otp"
            className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
            value={OTP}
            onChange={(event) => setOTP(event.target.value)}
          />
          <button
            onClick={verifyOTP}
            role="button"
            aria-label="otp"
            className=" flex justify-center focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-lg font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 p-2 m-auto mt-8 "
          >
            {loading ? <TailSpin height={25} color="white" /> : 'Confirm OTP'}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-white"
            >
              Full Name
            </label>
            <input
              aria-label="name"
              role="input"
              type="text"
              id="name"
              name="name"
              className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
              value={form.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="mobile"
              className="block mb-2 text-sm font-medium text-white"
            >
              Mobile No.
            </label>
            <input
              aria-label="mobile"
              role="input"
              type={'number'}
              id="mobile"
              name="mobile"
              required
              className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
              value={form.mobile}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-mediumtext-white"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            onClick={requestOtp}
            aria-label="login"
            className=" flex justify-center focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-lg font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 p-4 m-auto "
          >
            {loading ? <TailSpin height={25} color="white" /> : 'Request OTP'}
          </button>
        </div>
      )}
      <p className="text-sm mt-4 font-medium leading-none text-gray-500 mr-3">
        Already Having an Account?
        <Link to={'/login'}>
          <span
            tabIndex={0}
            role="link"
            aria-label="Sign up here"
            className="text-sm font-medium leading-none underline text-white cursor-pointer"
          >
            Login here
          </span>
        </Link>
      </p>
      <div id="recaptcha-container"></div>
    </div>
  )
}

export default Signup
