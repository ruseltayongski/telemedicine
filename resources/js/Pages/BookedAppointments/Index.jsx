import { Head, Link, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect, useRef, useState } from "react";

export default function BookedAppointments({bookedAppointments}) {
    // State for filtered appointments
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    // Initialize with default filter (current year)
    useEffect(() => {
        // Apply filter for current year on initial load
        const currentYear = new Date().getFullYear();
        filterAppointmentsByYear(currentYear.toString());
    }, [bookedAppointments.data]);

    // Function to generate year options from 2024 to current year
    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        
        // Generate years from 2024 to current year (in descending order)
        for (let year = currentYear; year >= 2024; year--) {
            years.push(year);
        }
        
        return years;
    };

    // Function to filter appointments by year
    const filterAppointmentsByYear = (year) => {
        if (year === "all") {
            setFilteredAppointments(bookedAppointments.data);
        } else {
            const filtered = bookedAppointments.data.filter(booking => 
                new Date(booking.appointment.date_start).getFullYear() === parseInt(year)
            );
            setFilteredAppointments(filtered);
        }
    };

    const generatePrescription = (patient_id, doctor_id, booking_id) => {
        const url = route('prescriptions.pdf', {
            patient_id: patient_id,
            doctor_id: doctor_id,
            booking_id: booking_id,
        });
    
        window.open(url, '_blank');
    };    

    const generateLaboratoryRequest = (patient_id, doctor_id, booking_id) => {
        const url = route('laboratory-request', {
            patient_id: patient_id,
            doctor_id: doctor_id,
            booking_id: booking_id,
        });
    
        window.open(url, '_blank');
    };   

    return (
        <GuestLayout>
            <Head title="Book Appointment" />

            <div className="breadcrumbs overlay">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
                            <div className="breadcrumbs-content">
                                <h1 className="page-title">Booked Appointments</h1>
                            </div>
                            <ul className="breadcrumb-nav">
                                <li><Link href={route('home')}>Home</Link></li>
                                <li>Booked Appointments</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <section id="contact-us" className="contact-us section">
                <div className="container">
                    <div className="contact-head">
                        <div className="row">
                            <div className="col-12">
                                <div className="section-title">
                                    <h3>Booked Appointments</h3>
                                    <h2>Booked Appointment Transactions</h2>
                                    <p>Below is a comprehensive list of all booking transactions, including details of scheduled and completed appointments.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12 col-12">
                                <div className="form-main">
                                    <div className='row'>
                                        <div className='col-md-8'>
                                            <div className="form-title">
                                                <h2>Activity List</h2>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="flex items-center" style={{marginTop: '-30px'}}>
                                                <label htmlFor="yearFilter" className="mr-2 font-medium">Filter by Year:</label>
                                                <select 
                                                    id="yearFilter" 
                                                    className="form-select px-3 py-2 border rounded"
                                                    onChange={(e) => filterAppointmentsByYear(e.target.value)}
                                                    defaultValue={new Date().getFullYear().toString()} // Default to current year
                                                >
                                                    <option value="all">All Years</option>
                                                    {getYearOptions().map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="border w-100 border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="border px-4 py-2">Appointment Date</th>
                                                    <th className="border px-4 py-2">Appointment Title</th>
                                                    <th className="border px-4 py-2">Doctor Name</th>
                                                    <th className="border px-4 py-2">Remarks</th>
                                                    <th className="border px-4 py-2">Status</th>
                                                    <th className="border px-4 py-2">Meeting Link</th>
                                                    <th className="border px-4 py-2">Prescription</th>
                                                    <th className="border px-4 py-2">Laboratory Request</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredAppointments.map((booking) => (
                                                    <tr key={booking.id} className="border">
                                                        <td className="border px-4 py-2">
                                                            <span style={{ fontSize: '12px' }}>
                                                                {new Date(booking.appointment.date_start).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                })} 
                                                            </span>
                                                            <small className="text-gray-500 d-block" style={{ fontSize: '9px' }}>
                                                                {new Date(`1970-01-01T${booking.selected_time}`).toLocaleTimeString([], {
                                                                    hour: 'numeric',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })}
                                                            </small>
                                                        </td>
                                                        <td className="border px-4 py-2">{booking.appointment.title}</td>
                                                        <td className="border px-4 py-2">{booking.appointment.doctor.name}</td>
                                                        <td className="border px-4 py-2">{booking.remarks}</td>
                                                        <td className="border px-4 py-2">
                                                            <span className={`badge text-uppercase ms-2 ${
                                                                booking.status === 'confirmed' ? 'bg-success text-white' :
                                                                booking.status === 'pending' ? 'bg-warning text-dark' :
                                                                booking.status === 'cancelled' ? 'bg-danger text-white' :
                                                                'bg-secondary text-white'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {booking.status === "confirmed" ? (
                                                                <form 
                                                                    action={route('video-call')} 
                                                                    method="GET" 
                                                                    target="_blank" 
                                                                    className="d-inline"
                                                                >
                                                                    <input type="hidden" name="booking_id" value={booking.id} />
                                                                    <input type="hidden" name="patient_id" value={booking.patient_id} />
                                                                    <input type="hidden" name="recipient" value="patient" />
                                                                    <a 
                                                                        href="#" 
                                                                        className="text-primary text-decoration-none"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.target.closest('form').submit();
                                                                        }}
                                                                    >
                                                                        Join call
                                                                    </a>
                                                                </form>
                                                            ) : (
                                                                <span className="text-gray-500">Not available</span>
                                                            )}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {booking.prescription ? (
                                                                <a 
                                                                    href="#" 
                                                                    className="text-primary text-decoration-none"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        generatePrescription(booking.patient_id, booking.appointment.doctor_id, booking.id);
                                                                    }}
                                                                >
                                                                    Download
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted">Not available</span>
                                                            )}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <a 
                                                                href="#" 
                                                                className="text-primary text-decoration-none"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    generateLaboratoryRequest(booking.patient_id, booking.appointment.doctor_id, booking.id);
                                                                }}
                                                            >
                                                                Download
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                            
                                    <div className="d-flex flex-column align-items-end mt-4 mb-4" style={{ minHeight: "40vh" }}>
                                        <div className="mt-auto">
                                            {bookedAppointments.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true, preserveState: true })}
                                                    className={`px-3 py-2 mx-1 border rounded ${
                                                        link.active ? 'bg-primary text-white' : 'bg-white'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    disabled={!link.url}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
