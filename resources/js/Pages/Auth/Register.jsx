import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        address: '',
        contact: '',
        sex: '',
        dob: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        // <GuestLayout>
        //     <Head title="Register" />
        //     <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-3 justify-content-center">
        //         <div className="mt-3 w-100 bg-white p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
        //         <a className="navbar-brand d-flex align-items-center justify-content-center cursor-pointer" 
        //             href={route('home')} 
        //             style={{ color: "#006838", fontWeight: "600" }}>
        //             <img src="assets/images/online.png" alt="Logo" style={{ width: "40px", marginRight: "8px" }} />
        //             Telemedicine
        //         </a>
        //             <form onSubmit={submit}>
        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="name" value="Name" />
        //                     <TextInput
        //                         id="name"
        //                         name="name"
        //                         value={data.name}
        //                         className="form-control"
        //                         autoComplete="name"
        //                         isFocused={true}
        //                         onChange={(e) => setData('name', e.target.value)}
        //                         required
        //                     />
        //                     <InputError message={errors.name} className="text-danger small" />
        //                 </div>

        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="email" value="Email" />
        //                     <TextInput
        //                         id="email"
        //                         type="email"
        //                         name="email"
        //                         value={data.email}
        //                         className="form-control"
        //                         autoComplete="username"
        //                         onChange={(e) => setData('email', e.target.value)}
        //                         required
        //                     />
        //                     <InputError message={errors.email} className="text-danger small" />
        //                 </div>

        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="address" value="Address" />
        //                     <TextInput
        //                         id="address"
        //                         name="address"
        //                         value={data.address}
        //                         className="form-control"
        //                         onChange={(e) => setData('address', e.target.value)}
        //                         required
        //                     />
        //                     <InputError message={errors.address} className="text-danger small" />
        //                 </div>

        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="contact" value="Contact" />
        //                     <TextInput
        //                         id="contact"
        //                         name="contact"
        //                         value={data.contact}
        //                         className="form-control"
        //                         onChange={(e) => setData('contact', e.target.value)}
        //                         required
        //                     />
        //                     <InputError message={errors.contact} className="text-danger small" />
        //                 </div>

        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="sex" value="Sex" />
        //                     <select
        //                         id="sex"
        //                         name="sex"
        //                         className="form-select"
        //                         value={data.sex}
        //                         onChange={(e) => setData('sex', e.target.value)}
        //                         required
        //                     >
        //                         <option value="">Select Sex</option>
        //                         <option value="male">Male</option>
        //                         <option value="female">Female</option>
        //                     </select>
        //                     <InputError message={errors.sex} className="text-danger small" />
        //                 </div>

        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="dob" value="Date of Birth" />
        //                     <TextInput
        //                         id="dob"
        //                         type="date"
        //                         name="dob"
        //                         value={data.dob}
        //                         className="form-control"
        //                         autoComplete="dob"
        //                         onChange={(e) => setData('dob', e.target.value)}
        //                         required
        //                     />
        //                     <InputError message={errors.dob} className="text-danger small" />
        //                 </div>

        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="password" value="Password" />
        //                     <TextInput
        //                         id="password"
        //                         type="password"
        //                         name="password"
        //                         value={data.password}
        //                         className="form-control"
        //                         autoComplete="new-password"
        //                         onChange={(e) => setData('password', e.target.value)}
        //                         required
        //                     />
        //                     <InputError message={errors.password} className="text-danger small" />
        //                 </div>

        //                 <div className="mb-3">
        //                     <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
        //                     <TextInput
        //                         id="password_confirmation"
        //                         type="password"
        //                         name="password_confirmation"
        //                         value={data.password_confirmation}
        //                         className="form-control"
        //                         autoComplete="new-password"
        //                         onChange={(e) => setData('password_confirmation', e.target.value)}
        //                         required
        //                     />
        //                     <InputError message={errors.password_confirmation} className="text-danger small" />
        //                 </div>

        //                 <div className="d-flex justify-content-between align-items-center">
        //                     <Link href={route('login')} className="text-decoration-none text-primary small">
        //                         Already registered?
        //                     </Link>
        //                     <PrimaryButton className="btn btn-primary" disabled={processing}>
        //                         Register
        //                     </PrimaryButton>
        //                 </div>
        //             </form>
        //         </div>
        //     </div>

        // </GuestLayout>
        
        <GuestLayout>
            <Head title="Register" />
            <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-4 justify-content-center">
                <div className="mt-3 w-100 bg-white p-4 shadow rounded" style={{ maxWidth: '800px' }}>
                    <div className="text-center mb-4">
                        <a className="navbar-brand d-flex align-items-center justify-content-center cursor-pointer" 
                            href={route('home')} 
                            style={{ color: "#006838", fontWeight: "600" }}>
                            <img src="assets/images/online.png" alt="Logo" style={{ width: "40px", marginRight: "8px" }} />
                            <span className="fs-4">Telemedicine</span>
                        </a>
                        <h4 className="mt-3">Create Your Account</h4>
                        <p className="text-muted">Fill in your information to get started</p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <InputLabel htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="form-control"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="text-danger small" />
                                </div>

                                <div className="mb-3">
                                    <InputLabel htmlFor="dob" value="Date of Birth" />
                                    <TextInput
                                        id="dob"
                                        type="date"
                                        name="dob"
                                        value={data.dob}
                                        className="form-control"
                                        autoComplete="dob"
                                        max={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setData('dob', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.dob} className="text-danger small" />
                                </div>

                                <div className="mb-3">
                                    <InputLabel htmlFor="contact" value="Contact Number" />
                                    <TextInput
                                        id="contact"
                                        name="contact"
                                        value={data.contact}
                                        className="form-control"
                                        onChange={(e) => setData('contact', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.contact} className="text-danger small" />
                                </div>

                                <div className="mb-3">
                                    <InputLabel htmlFor="password" value="Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="form-control"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="text-danger small" />
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <InputLabel htmlFor="address" value="Address" />
                                    <TextInput
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        className="form-control"
                                        onChange={(e) => setData('address', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.address} className="text-danger small" />
                                </div>

                                <div className="mb-3">
                                    <InputLabel htmlFor="email" value="Email Address" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="form-control"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="text-danger small" />
                                </div>

                                <div className="mb-3">
                                    <InputLabel htmlFor="sex" value="Sex" />
                                    <select
                                        id="sex"
                                        name="sex"
                                        className="form-select"
                                        value={data.sex}
                                        onChange={(e) => setData('sex', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Sex</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <InputError message={errors.sex} className="text-danger small" />
                                </div>

                                <div className="mb-3">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="form-control"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="text-danger small" />
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Link href={route('login')} className="text-decoration-none text-primary">
                                        Already registered?
                                    </Link>
                                    <PrimaryButton className="btn btn-primary px-4 py-2" disabled={processing}>
                                        Create Account
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>

    );
}
