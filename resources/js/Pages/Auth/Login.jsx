// // import Checkbox from '@/Components/Checkbox';
// // import InputError from '@/Components/InputError';
// // import InputLabel from '@/Components/InputLabel';
// // import PrimaryButton from '@/Components/PrimaryButton';
// // import TextInput from '@/Components/TextInput';
// // import GuestLayout from '@/Layouts/GuestLayout';
// // import { Head, Link, useForm } from '@inertiajs/react';
// // import React, { useEffect, useRef, useState } from "react";

// // export default function Login({ status, canResetPassword }) {
// //     const { data, setData, post, processing, errors, reset } = useForm({
// //         email: '',
// //         password: '',
// //         remember: false,
// //     });

// //     const submit = (e) => {
// //         e.preventDefault();

// //         post(route('login'), {
// //             onFinish: () => reset('password'),
// //         });
// //     };

// //     return (
// //         <GuestLayout>
// //             <Head title="Log in" />
// //             <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-3 justify-content-center">
// //                 <a className="navbar-brand cursor-pointer" href={route('home')} style={{ color: "#006838", fontWeight: "600" }}>
// //                     <img src="assets/images/online.png" alt="Logo" style={{ width: "40px" }} />
// //                     Telemedicine
// //                 </a>

// //                 <div className="mt-3 w-100 bg-white p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
                    
// //                     {status && (
// //                         <div className="mb-3 text-success small">
// //                             {status}
// //                         </div>
// //                     )}

// //                     <form onSubmit={submit}>
// //                         <div className="mb-3">
// //                             <InputLabel htmlFor="email" value="Email" />
// //                             <TextInput
// //                                 id="email"
// //                                 type="email"
// //                                 name="email"
// //                                 value={data.email}
// //                                 className="form-control"
// //                                 autoComplete="username"
// //                                 isFocused={true}
// //                                 onChange={(e) => setData('email', e.target.value)}
// //                             />
// //                             <InputError message={errors.email} className="text-danger small" />
// //                         </div>

// //                         <div className="mb-3">
// //                             <InputLabel htmlFor="password" value="Password" />
// //                             <TextInput
// //                                 id="password"
// //                                 type="password"
// //                                 name="password"
// //                                 value={data.password}
// //                                 className="form-control"
// //                                 autoComplete="current-password"
// //                                 onChange={(e) => setData('password', e.target.value)}
// //                             />
// //                             <InputError message={errors.password} className="text-danger small" />
// //                         </div>

// //                         <div className="form-check mb-3">
// //                             <Checkbox
// //                                 id="remember"
// //                                 name="remember"
// //                                 checked={data.remember}
// //                                 onChange={(e) => setData('remember', e.target.checked)}
// //                                 className="form-check-input"
// //                             />
// //                             <label className="form-check-label" htmlFor="remember">
// //                                 Remember me
// //                             </label>
// //                         </div>

// //                         <div className="d-flex justify-content-between align-items-center">
// //                             {canResetPassword && (
// //                                 <Link href={route('password.request')} className="text-decoration-none text-primary small">
// //                                     Forgot your password?
// //                                 </Link>
// //                             )}
// //                             <PrimaryButton className="btn btn-primary" disabled={processing}>
// //                                 Log in
// //                             </PrimaryButton>
// //                         </div>

// //                         <div className="mt-3 text-center">
// //                             <span className="small">Don't have an account? </span>
// //                             <Link href={route('register')} style={{ marginLeft: '3px' }} className="text-decoration-none text-primary small">
// //                                 Sign up
// //                             </Link>
// //                         </div>
// //                     </form>

// //                 </div>
// //             </div>
// //         </GuestLayout>
// //     );
// // }

// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';
// import React, { useState } from "react";

// export default function Login({ status, canResetPassword }) {
//     const [otpSent, setOtpSent] = useState(false);
//     const [email, setEmail] = useState('');
    
//     const loginForm = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });
    
//     const otpForm = useForm({
//         email: '',
//         otp: '',
//         remember: false
//     });

//     const submitLogin = (e) => {
//         e.preventDefault();
        
//         // Store email for OTP form
//         setEmail(loginForm.data.email);
        
//         loginForm.post(route('login.request-otp'), {
//             onSuccess: () => {
//                 setOtpSent(true);
//                 otpForm.setData('email', loginForm.data.email);
//                 otpForm.setData('remember', loginForm.data.remember);
//             },
//             preserveScroll: true,
//         });
//     };
    
//     const submitOtp = (e) => {
//         e.preventDefault();
        
//         otpForm.post(route('login.verify-otp'), {
//             onSuccess: () => {
//                 // Redirect will be handled by the controller
//             },
//             onError: () => {
//                 // OTP verification failed
//             },
//         });
//     };
    
//     const resendOtp = () => {
//         loginForm.post(route('login.request-otp'), {
//             onSuccess: () => {
//                 // Show success message
//             },
//             preserveScroll: true,
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />
//             <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-3 justify-content-center">
//                 <a className="navbar-brand cursor-pointer" href={route('home')} style={{ color: "#006838", fontWeight: "600" }}>
//                     <img src="assets/images/online.png" alt="Logo" style={{ width: "40px" }} />
//                     Telemedicine
//                 </a>

//                 <div className="mt-3 w-100 bg-white p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
                    
//                     {status && (
//                         <div className="mb-3 text-success small">
//                             {status}
//                         </div>
//                     )}

//                     {!otpSent ? (
//                         // Step 1: Email and Password Form
//                         <form onSubmit={submitLogin}>
//                             <div className="mb-3">
//                                 <InputLabel htmlFor="email" value="Email" />
//                                 <TextInput
//                                     id="email"
//                                     type="email"
//                                     name="email"
//                                     value={loginForm.data.email}
//                                     className="form-control"
//                                     autoComplete="username"
//                                     isFocused={true}
//                                     onChange={(e) => loginForm.setData('email', e.target.value)}
//                                 />
//                                 <InputError message={loginForm.errors.email} className="text-danger small" />
//                             </div>

//                             <div className="mb-3">
//                                 <InputLabel htmlFor="password" value="Password" />
//                                 <TextInput
//                                     id="password"
//                                     type="password"
//                                     name="password"
//                                     value={loginForm.data.password}
//                                     className="form-control"
//                                     autoComplete="current-password"
//                                     onChange={(e) => loginForm.setData('password', e.target.value)}
//                                 />
//                                 <InputError message={loginForm.errors.password} className="text-danger small" />
//                             </div>

//                             <div className="form-check mb-3">
//                                 <Checkbox
//                                     id="remember"
//                                     name="remember"
//                                     checked={loginForm.data.remember}
//                                     onChange={(e) => loginForm.setData('remember', e.target.checked)}
//                                     className="form-check-input"
//                                 />
//                                 <label className="form-check-label" htmlFor="remember">
//                                     Remember me
//                                 </label>
//                             </div>

//                             <div className="d-flex justify-content-between align-items-center">
//                                 {canResetPassword && (
//                                     <Link href={route('password.request')} className="text-decoration-none text-primary small">
//                                         Forgot your password?
//                                     </Link>
//                                 )}
//                                 <PrimaryButton className="btn btn-primary" disabled={loginForm.processing}>
//                                     Continue
//                                 </PrimaryButton>
//                             </div>
//                         </form>
//                     ) : (
//                         // Step 2: OTP Verification Form
//                         <form onSubmit={submitOtp}>
//                             <div className="mb-3 text-center">
//                                 <h5>Verification Code</h5>
//                                 <p className="small">We've sent a verification code to <strong>{email}</strong></p>
//                             </div>
                            
//                             <div className="mb-4">
//                                 <InputLabel htmlFor="otp" value="Enter OTP Code" />
//                                 <TextInput
//                                     id="otp"
//                                     type="text"
//                                     name="otp"
//                                     value={otpForm.data.otp}
//                                     className="form-control"
//                                     isFocused={true}
//                                     onChange={(e) => otpForm.setData('otp', e.target.value)}
//                                     maxLength={6}
//                                 />
//                                 <InputError message={otpForm.errors.otp} className="text-danger small" />
//                             </div>

//                             <div className="d-flex justify-content-between align-items-center">
//                                 <button 
//                                     type="button" 
//                                     onClick={resendOtp} 
//                                     className="text-decoration-none text-primary small border-0 bg-transparent"
//                                     disabled={loginForm.processing}
//                                 >
//                                     Resend Code
//                                 </button>
//                                 <PrimaryButton className="btn btn-primary" disabled={otpForm.processing}>
//                                     Verify & Login
//                                 </PrimaryButton>
//                             </div>
                            
//                             <div className="mt-3 text-center">
//                                 <button 
//                                     type="button" 
//                                     onClick={() => setOtpSent(false)} 
//                                     className="text-decoration-none text-primary small border-0 bg-transparent"
//                                 >
//                                     Go back
//                                 </button>
//                             </div>
//                         </form>
//                     )}

//                     <div className="mt-3 text-center">
//                         <span className="small">Don't have an account? </span>
//                         <Link href={route('register')} style={{ marginLeft: '3px' }} className="text-decoration-none text-primary small">
//                             Sign up
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </GuestLayout>
//     );
// }

import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from "react";

export default function Login({ status, canResetPassword }) {
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState('');
    const [otpMethod, setOtpMethod] = useState('email'); // 'email' or 'sms'
    const [maskedPhone, setMaskedPhone] = useState(''); // Will be filled after login attempt
    
    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
        otp_method: 'email',
    });
    
    const otpForm = useForm({
        email: '',
        otp: '',
        otp_method: 'email',
        remember: false
    });

    // Update the form data whenever otpMethod changes
    useEffect(() => {
        loginForm.setData('otp_method', otpMethod);
        otpForm.setData('otp_method', otpMethod);
    }, [otpMethod]);

    const submitLogin = (e) => {
        e.preventDefault();
        
        // Double check that the latest otpMethod is in the form data
        loginForm.setData('otp_method', otpMethod);
        
        loginForm.post(route('login.request-otp'), {
            onSuccess: (response) => {
                setOtpSent(true);
                setEmail(loginForm.data.email);
                
                // If the backend returned a masked phone number, store it
                if (response?.maskedPhone) {
                    setMaskedPhone(response.maskedPhone);
                }
                
                otpForm.setData({
                    email: loginForm.data.email,
                    otp_method: otpMethod, // Make sure to use the current otpMethod
                    remember: loginForm.data.remember,
                    otp: ''
                });
            },
            preserveScroll: true,
        });
    };
    
    const submitOtp = (e) => {
        e.preventDefault();
        
        // Make sure the OTP form has the correct method before submitting
        otpForm.setData('otp_method', otpMethod);
        
        otpForm.post(route('login.verify-otp'), {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: () => {
                // OTP verification failed
            },
        });
    };
    
    const resendOtp = () => {
        // Create a resend request with the current OTP method
        const resendData = {
            email: email,
            otp_method: otpMethod
        };
        
        loginForm.post(route('login.request-otp'), {
            data: resendData,
            onSuccess: () => {
                // Show success message
            },
            preserveScroll: true,
        });
    };

    const handleOtpMethodChange = (method) => {
        setOtpMethod(method);
        // Explicitly update the form data when the method changes
        loginForm.setData('otp_method', method);
        otpForm.setData('otp_method', method);
    };

    // For debugging - you can remove this in production
    const confirmFormData = () => {
        console.log("Current otpMethod state:", otpMethod);
        console.log("Login Form otp_method:", loginForm.data.otp_method);
        console.log("OTP Form otp_method:", otpForm.data.otp_method);
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-3 justify-content-center">
                <a className="navbar-brand cursor-pointer" href={route('home')} style={{ color: "#006838", fontWeight: "600" }}>
                    <img src="assets/images/online.png" alt="Logo" style={{ width: "40px" }} />
                    Telemedicine
                </a>

                <div className="mt-3 w-100 bg-white p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
                    
                    {status && (
                        <div className="mb-3 text-success small">
                            {status}
                        </div>
                    )}

                    {!otpSent ? (
                        // Step 1: Email and Password Form
                        <form onSubmit={submitLogin}>
                            <div className="mb-3">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={loginForm.data.email}
                                    className="form-control"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => loginForm.setData('email', e.target.value)}
                                />
                                <InputError message={loginForm.errors.email} className="text-danger small" />
                            </div>

                            <div className="mb-3">
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={loginForm.data.password}
                                    className="form-control"
                                    autoComplete="current-password"
                                    onChange={(e) => loginForm.setData('password', e.target.value)}
                                />
                                <InputError message={loginForm.errors.password} className="text-danger small" />
                            </div>

                            <div className="mb-3">
                                <p className="mb-2">Verification Method:</p>
                                <div className="d-flex gap-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="otpMethod"
                                            id="emailMethod"
                                            checked={otpMethod === 'email'}
                                            onChange={() => handleOtpMethodChange('email')}
                                        />
                                        <label className="form-check-label" htmlFor="emailMethod">
                                            Email OTP
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="otpMethod"
                                            id="smsMethod"
                                            checked={otpMethod === 'sms'}
                                            onChange={() => handleOtpMethodChange('sms')}
                                        />
                                        <label className="form-check-label" htmlFor="smsMethod">
                                            SMS OTP
                                        </label>
                                    </div>
                                </div>
                                {/* Hidden field to ensure otp_method is part of the form submission */}
                                <input 
                                    type="hidden" 
                                    name="otp_method" 
                                    value={otpMethod} 
                                />
                            </div>

                            <div className="form-check mb-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={loginForm.data.remember}
                                    onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                    className="form-check-input"
                                />
                                <label className="form-check-label" htmlFor="remember">
                                    Remember me
                                </label>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-decoration-none text-primary small">
                                        Forgot your password?
                                    </Link>
                                )}
                                <PrimaryButton 
                                    className="btn btn-primary" 
                                    disabled={loginForm.processing} 
                                    onClick={() => confirmFormData()} // This is for debugging
                                >
                                    Continue
                                </PrimaryButton>
                            </div>
                        </form>
                    ) : (
                        // Step 2: OTP Verification Form
                        <form onSubmit={submitOtp}>
                            <div className="mb-3 text-center">
                                <h5>Verification Code</h5>
                                <p className="small">
                                    {otpMethod === 'email' ? (
                                        <>We've sent a verification code to <strong>{email}</strong></>
                                    ) : (
                                        <>We've sent a verification code via SMS to <strong>{maskedPhone || "your registered phone number"}</strong></>
                                    )}
                                </p>
                            </div>
                            
                            <div className="mb-4">
                                <InputLabel htmlFor="otp" value="Enter OTP Code" />
                                <TextInput
                                    id="otp"
                                    type="text"
                                    name="otp"
                                    value={otpForm.data.otp}
                                    className="form-control"
                                    isFocused={true}
                                    onChange={(e) => otpForm.setData('otp', e.target.value)}
                                    maxLength={6}
                                />
                                {/* Hidden field to ensure otp_method is part of the form submission */}
                                <input 
                                    type="hidden" 
                                    name="otp_method" 
                                    value={otpMethod} 
                                />
                                <InputError message={otpForm.errors.otp} className="text-danger small" />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <button 
                                    type="button" 
                                    onClick={resendOtp} 
                                    className="text-decoration-none text-primary small border-0 bg-transparent"
                                    disabled={loginForm.processing}
                                >
                                    Resend Code
                                </button>
                                <PrimaryButton className="btn btn-primary" disabled={otpForm.processing}>
                                    Verify & Login
                                </PrimaryButton>
                            </div>
                            
                            <div className="mt-3 text-center">
                                <button 
                                    type="button" 
                                    onClick={() => setOtpSent(false)} 
                                    className="text-decoration-none text-primary small border-0 bg-transparent"
                                >
                                    Go back
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-3 text-center">
                        <span className="small">Don't have an account? </span>
                        <Link href={route('register')} style={{ marginLeft: '3px' }} className="text-decoration-none text-primary small">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}