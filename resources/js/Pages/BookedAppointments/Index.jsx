import { Head, Link, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect, useRef, useState } from "react";

export default function BookedAppointments({bookedAppointments}) {
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
                            <div className="col-lg-8 col-12">
                                <div className="form-main">
                                    <div className="form-title">
                                        <h2>Feel free to contact us for any query.</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="border px-4 py-2">ID</th>
                                                    <th className="border px-4 py-2">Patient Name</th>
                                                    <th className="border px-4 py-2">Appointment Title</th>
                                                    <th className="border px-4 py-2">Status</th>
                                                    <th className="border px-4 py-2">Booked Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookedAppointments.data.map((booking) => (
                                                    <tr key={booking.id} className="border">
                                                        <td className="border px-4 py-2">{booking.id}</td>
                                                        <td className="border px-4 py-2">{booking.patient.name}</td>
                                                        <td className="border px-4 py-2">{booking.appointment.title}</td>
                                                        <td className="border px-4 py-2">{booking.status}</td>
                                                        <td className="border px-4 py-2">{new Date(booking.created_at).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                        
                                    {/* Pagination */}
                                    {/* <div className="d-flex justify-content-end mt-4 mb-4">
                                        {bookedAppointments.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                                className={`px-3 py-2 mx-1 border rounded ${
                                                    link.active ? 'bg-primary text-white' : 'bg-white'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                disabled={!link.url} // Disable buttons for "..." or inactive links
                                            />
                                        ))}
                                    </div> */}
                                    {/* <div className="d-flex flex-column align-items-end mt-4 mb-4" style={{ minHeight: "40vh" }}>
                                        <div className="mt-auto">
                                            {bookedAppointments.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                                    className={`px-3 py-2 mx-1 border rounded ${
                                                        link.active ? 'bg-primary text-white' : 'bg-white'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    disabled={!link.url} // Disable buttons for "..." or inactive links
                                                />
                                            ))}
                                        </div>
                                    </div> */}

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
                                                    disabled={!link.url} // Disable buttons for "..." or inactive links
                                                />
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4 col-12">
                                <div className="single-head">
                                    <h2 className="main-title">Contact Information</h2>
                                    <div className="single-info">
                                    <div className="info-icon">
                                        <i className="lni lni-map-marker"></i>
                                    </div>
                                    <h3>Medical Address</h3>
                                    <ul>
                                        <li>Department of Health - Central Visayas Center for Health Development</li>
                                    </ul>
                                    </div>
                                    <div className="single-info">
                                    <div className="info-icon">
                                        <i className="lni lni-timer"></i>
                                    </div>
                                    <h3>Opening hours</h3>
                                    <ul>
                                        <li>Mon - Tue 08:30 - 18:30</li>
                                        <li>Wed - Thu 07:00 - 14:30</li>
                                    </ul>
                                    </div>
                                    <div className="single-info">
                                    <div className="info-icon">
                                        <i className="lni lni-envelope"></i>
                                    </div>
                                    <h3>Email Support</h3>
                                    <ul>
                                        <li><a href="mailto:contact@medigrids.com">contact@medigrids.com</a></li>
                                        <li><a href="mailto:support@medigrids.com">support@medigrids.com</a></li>
                                    </ul>
                                    </div>
                                    <div className="single-info contact-social">
                                    <h3>Social contact</h3>
                                    <div className="info-icon">
                                        <i className="lni lni-mobile"></i>
                                    </div>
                                    <ul>
                                        <li><a href="#"><i className="lni lni-facebook-original"></i></a></li>
                                        <li><a href="#"><i className="lni lni-twitter-original"></i></a></li>
                                        <li><a href="#"><i className="lni lni-linkedin-original"></i></a></li>
                                        <li><a href="#"><i className="lni lni-pinterest"></i></a></li>
                                        <li><a href="#"><i className="lni lni-youtube"></i></a></li>
                                    </ul>
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
