import React, { useState, useRef, useEffect } from 'react';
import { FaUnlockAlt, FaUser } from "react-icons/fa";
import * as utils from "../../Utils/utils";
import { Link } from 'react-router-dom';
import { api } from "../../api";

function LoginForm() {
    const [errMsg, setErrMsg] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const userRef = useRef();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (form) => {
        // prevent form submission
        form.preventDefault();

        const loginform = { username: user, password: pwd };
        await api.post("/users/login", loginform).then((r) => {
            const data = r.data;
            console.log(data);

            // check for errors
            if (data["result"] !== "ok") {
                setErrMsg(data["error"]);
                return;
            }

            // set the cookie and go to the home page
            utils.setCookie("token", data["token"]);
            utils.goToHome();
        }).catch((_) => { });
    };

    return (
        <div className="wrapper w-96 bg-opacity-25 border-2 border-white border-opacity-20 backdrop-blur-md shadow-md text-white rounded-lg p-8 bg-black">
            <form onSubmit={handleSubmit}>
                <h1 className='text-3xl text-center'>Login</h1>
                <div className='input-box relative w-full h-12 my-8'>
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
                <div className='input-box relative w-full h-12 my-8'>
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
                <button type='submit' className='w-full h-12 bg-white border-none outline-none rounded-full shadow-md cursor-pointer text-base font-bold text-gray-700'>Login</button>

                <div className='register-link text-sm text-center mt-5 mb-4'>
                    <p>Don't have an account? <Link to="/register/athlete" className='link link-success'> Register</Link> </p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
