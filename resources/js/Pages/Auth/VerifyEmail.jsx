import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-3 justify-content-center">
                <div className="mt-3 w-100 p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
                    <a className="navbar-brand d-flex align-items-center justify-content-center cursor-pointer" 
                        href={route('home')} 
                        style={{ color: "#006838", fontWeight: "600" }}>
                        <img src="assets/images/online.png" alt="Logo" style={{ width: "40px", marginRight: "8px" }} />
                        Telemedicine
                    </a>
                </div>

                <div className="alert alert-secondary">
                    Thanks for signing up! Before getting started, could you verify
                    your email address by clicking on the link we just emailed to
                    you? If you didn't receive the email, we will gladly send you
                    another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="alert alert-success">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 d-flex justify-content-between align-items-center">
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            Resend Verification Email
                        </button>
                        
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="btn btn-link text-decoration-none"
                        >
                            Log Out
                        </Link>
                    </div>
                </form>

            </div>
        </GuestLayout>
    );
}
