import { useState, useRef, useEffect } from 'react';
import { FaUnlockAlt, FaUser } from "react-icons/fa";
import * as utils from "../../Utils/utils";
import { Link } from 'react-router-dom';
import { api } from "../../api";
import React from 'react';

function RegisterPt() {
    const userRef = useRef();

    // const [email, setEmail] = useState('');
    // const [file, setFile] = useState('');
    const [user, setUser] = useState('');
    const [isPt, setIsPt] = useState(false);
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = (form) => {
        // prevent form submission
        form.preventDefault();

        const register_form = { username: user, password: pwd, isNormalUser: isPt };
        api.post("/users/register", register_form).then((r) => {
            const data = r.data;

            // check for errors
            if (data["result"] !== "ok") {
                setErrMsg(data["error"]);
                return;
            }

            // set the cookie and go to the home page
            utils.setCookie("token", data["token"]);
            utils.goToRegisterDetails();
        }).catch((_) => { });
    };

    return (
        <div className="w-96 bg-opacity-25 border-2 border-white border-opacity-20 backdrop-blur-md shadow-md text-white rounded-lg p-8 bg-black">
            <form onSubmit={handleSubmit}>
                <h1 className='text-3xl text-center'>Welcome!</h1>
                <div role="tablist" className="tabs tabs-lifted my-3">
                    <Link to={"/register/athlete"} role="tab" className="tab text-white">Athlete</Link>
                    <Link to={"/register/trainer"} role="tab" className="tab tab-active">Trainer</Link>
                </div>
                <div className='input-box relative w-full h-12 my-3'>
                    <input
                        type='text'
                        placeholder='Username'
                        ref={userRef}
                        autoComplete='off'
                        id='username'
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        className='w-full h-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-full text-white text-base pl-20 pr-5 py-3'
                    />
                    <FaUser className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                </div>
                <div className='input-box relative w-full h-12 my-3'>
                    <input
                        type='password'
                        placeholder='Password'
                        id='password'
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        className='w-full h-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-full text-white text-base pl-20 pr-5 py-3'
                    />
                    <FaUnlockAlt className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                </div>

                <div className='text-red-500 text-center mb-2'> {errMsg} </div>
                <button type='submit' className='w-full h-12 bg-white border-none outline-none rounded-full shadow-md cursor-pointer text-base font-bold text-gray-700'>Register</button>

                <div className='register-link text-sm text-center mt-3'>
                    <p>I have a account. <Link to="/login" className='link link-success'> Login</Link> </p>
                </div>
            </form>
        </div>
    );
}

export default RegisterPt;

<div className="flex items-center justify-center p-12">

    <div className="mx-auto w-full max-w-[550px] bg-white">
        <form>
            <div className="mb-5">
                <label for="name" className="mb-3 block text-base font-medium text-[#07074D]">
                    Full Name
                </label>
                <input type="text" name="name" id="name" placeholder="Full Name"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
            </div>
            <div className="mb-5">
                <label for="phone" className="mb-3 block text-base font-medium text-[#07074D]">
                    Phone Number
                </label>
                <input type="text" name="phone" id="phone" placeholder="Enter your phone number"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
            </div>
            <div className="mb-5">
                <label for="email" className="mb-3 block text-base font-medium text-[#07074D]">
                    Email Address
                </label>
                <input type="email" name="email" id="email" placeholder="Enter your email"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
            </div>
            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                        <label for="date" className="mb-3 block text-base font-medium text-[#07074D]">
                            Date
                        </label>
                        <input type="date" name="date" id="date"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                        <label for="time" className="mb-3 block text-base font-medium text-[#07074D]">
                            Time
                        </label>
                        <input type="time" name="time" id="time"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                    </div>
                </div>
            </div>

            <div className="mb-5 pt-3">
                <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                    Address Details
                </label>
                <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="area" id="area" placeholder="Enter area"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="city" id="city" placeholder="Enter city"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="state" id="state" placeholder="Enter state"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="post-code" id="post-code" placeholder="Post Code"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button
                    className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                    Book Appointment
                </button>
            </div>
        </form>
    </div>
</div>
