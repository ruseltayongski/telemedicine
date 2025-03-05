import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import React, { useEffect, useRef, useState } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            {/* <HeadAssets
                cssFiles={[
                    "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
                    "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap",
                    "assets/css/bootstrap.min.css",
                    "assets/css/LineIcons.2.0.css",
                    "assets/css/animate.css",
                    "assets/css/tiny-slider.css",
                    "assets/css/glightbox.min.css",
                    "assets/css/main.css"
                ]}
                jsFiles={[
                    "assets/js/bootstrap.min.js",
                    "assets/js/wow.min.js" ,
                    "assets/js/tiny-slider.js",
                    "assets/js/glightbox.min.js",
                    "assets/js/count-up.min.js",
                    "assets/js/imagesloaded.min.js",
                    "assets/js/isotope.min.js",
                ]}
            />    */}

            <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-3 justify-content-center">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="" style={{ height: '80px', width: '80px', color: '#6c757d' }} />
                    </Link>
                </div>

                <div className="mt-3 w-100 bg-white p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
                    
                    {status && (
                        <div className="mb-3 text-success small">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-control"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="text-danger small" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="form-control"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="text-danger small" />
                        </div>

                        <div className="form-check mb-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="remember">
                                Remember me
                            </label>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-decoration-none text-primary small"
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <PrimaryButton className="btn btn-primary" disabled={processing}>
                                Log in
                            </PrimaryButton>
                        </div>
                    </form>

                </div>
            </div>
        </GuestLayout>
    );
}
