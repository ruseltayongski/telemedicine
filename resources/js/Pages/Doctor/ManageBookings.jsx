import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ManageBookings() {
    const { pendingBookings, confirmedBookings, rejectedBookings } = usePage().props;
    const [bookings, setBookings] = useState({
        pending: pendingBookings,
        confirmed: confirmedBookings,
        rejected: rejectedBookings
    });
    const [activeTab, setActiveTab] = useState('pending');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const { flash } = usePage().props;
    useEffect(() => {
        console.log(flash);
        if (flash && flash.success) {
            setSuccessMessage(flash.success);
            setShowSuccessDialog(true);
            
            const timer = setTimeout(() => {
                setShowSuccessDialog(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleStatusUpdate = (bookingId, newStatus) => {
        const updatedBooking = bookings.pending.find(booking => booking.id === bookingId);
        
        if (updatedBooking) {
            const newPending = bookings.pending.filter(booking => booking.id !== bookingId);
            updatedBooking.status = newStatus;
            const newStatusList = newStatus === 'confirmed' ? 'confirmed' : 'rejected';
            
            setBookings({
                ...bookings,
                pending: newPending,
                [newStatusList]: [...bookings[newStatusList], updatedBooking]
            });
        }
    };

    const updateStatus = (status) => {
        setIsLoading(true);
        
        router.put(`/doctor-bookings/${selectedBooking.id}/status`, {
            status
        }, {
            preserveScroll: true,
            // preserveState: false,
            onSuccess: () => {
                handleStatusUpdate(selectedBooking.id, status);
                setShowConfirmDialog(false);
            },
            onError: (errors) => {
                console.error('Error updating booking status:', errors);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const confirmStatusUpdate = (booking, status) => {
        setSelectedBooking(booking);
        setPendingStatus(status);
        setShowConfirmDialog(true);
    };

    const getBadgeClass = (status) => {
        switch(status) {
            case 'confirmed':
                return 'bg-success';
            case 'rejected':
                return 'bg-danger';
            default:
                return 'bg-warning';
        }
    };

    const renderBookingCard = (booking) => {
        const appointmentDate = new Date(booking.appointment.date).toLocaleDateString();
        const startTime = booking.appointment.start_time;
        const endTime = booking.appointment.end_time;

        return (
            <div className="card mb-3 shadow-sm" key={booking.id}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h5 className="card-title">Patient: {booking.patient.name}</h5>
                            <p className="card-text mb-1">
                                <i className="bi bi-calendar me-2"></i>Date: {appointmentDate}
                            </p>
                            <p className="card-text mb-1">
                                <i className="bi bi-clock me-2"></i>Time: {startTime} - {endTime}
                            </p>
                            <p className="card-text">
                                Status: <span className={`badge ${getBadgeClass(booking.status)} text-uppercase`}>{booking.status}</span>
                            </p>
                        </div>
                        
                        {booking.status === 'pending' && (
                            <div className="col-md-4 d-flex align-items-center justify-content-end">
                                <div className="btn-group">
                                    <button
                                        onClick={() => confirmStatusUpdate(booking, 'confirmed')}
                                        disabled={isLoading}
                                        className="btn btn-success me-2"
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <i className="bi bi-check-circle me-1"></i>
                                        )}
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => confirmStatusUpdate(booking, 'rejected')}
                                        disabled={isLoading}
                                        className="btn btn-danger"
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <i className="bi bi-x-circle me-1"></i>
                                        )}
                                        Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="fw-bold fs-4 text-dark m-0">
                    Manage Appointment Bookings
                </h2>
            }
        >
            <Head title="Manage Bookings" />

            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white p-4">
                                <ul className="nav nav-tabs" id="bookingsTabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className={`nav-link ${activeTab === 'pending' ? 'active text-warning' : ''}`}
                                            onClick={() => setActiveTab('pending')}
                                            id="pending-tab" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#pending-tab-pane" 
                                            type="button" 
                                            role="tab" 
                                            aria-controls="pending-tab-pane" 
                                            aria-selected={activeTab === 'pending'}
                                        >
                                            <i className="bi bi-hourglass-split me-2"></i>
                                            Pending
                                            <span className="badge bg-warning text-dark ms-2 rounded-pill">
                                                {bookings.pending.length}
                                            </span>
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className={`nav-link ${activeTab === 'confirmed' ? 'active text-success' : ''}`}
                                            onClick={() => setActiveTab('confirmed')}
                                            id="confirmed-tab" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#confirmed-tab-pane" 
                                            type="button" 
                                            role="tab" 
                                            aria-controls="confirmed-tab-pane" 
                                            aria-selected={activeTab === 'confirmed'}
                                        >
                                            <i className="bi bi-check-circle me-2"></i>
                                            Confirmed
                                            <span className="badge bg-success ms-2 rounded-pill">
                                                {bookings.confirmed.length}
                                            </span>
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className={`nav-link ${activeTab === 'rejected' ? 'active text-danger' : ''}`}
                                            onClick={() => setActiveTab('rejected')}
                                            id="rejected-tab" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#rejected-tab-pane" 
                                            type="button" 
                                            role="tab" 
                                            aria-controls="rejected-tab-pane" 
                                            aria-selected={activeTab === 'rejected'}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Rejected
                                            <span className="badge bg-danger ms-2 rounded-pill">
                                                {bookings.rejected.length}
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body">
                                <div className="tab-content" id="bookingsTabsContent">
                                    {/* Pending Bookings Tab */}
                                    <div 
                                        className={`tab-pane fade ${activeTab === 'pending' ? 'show active' : ''}`}
                                        id="pending-tab-pane" 
                                        role="tabpanel" 
                                        aria-labelledby="pending-tab" 
                                        tabIndex="0"
                                    >
                                        {bookings.pending.length > 0 ? (
                                            bookings.pending.map(booking => renderBookingCard(booking))
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                <p>No pending bookings</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Confirmed Bookings Tab */}
                                    <div 
                                        className={`tab-pane fade ${activeTab === 'confirmed' ? 'show active' : ''}`}
                                        id="confirmed-tab-pane" 
                                        role="tabpanel" 
                                        aria-labelledby="confirmed-tab" 
                                        tabIndex="0"
                                    >
                                        {bookings.confirmed.length > 0 ? (
                                            bookings.confirmed.map(booking => renderBookingCard(booking))
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bi bi-calendar-check fs-1 d-block mb-2"></i>
                                                <p>No confirmed bookings</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Rejected Bookings Tab */}
                                    <div 
                                        className={`tab-pane fade ${activeTab === 'rejected' ? 'show active' : ''}`}
                                        id="rejected-tab-pane" 
                                        role="tabpanel" 
                                        aria-labelledby="rejected-tab" 
                                        tabIndex="0"
                                    >
                                        {bookings.rejected.length > 0 ? (
                                            bookings.rejected.map(booking => renderBookingCard(booking))
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
                                                <p>No rejected bookings</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmDialog && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Action</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfirmDialog(false)} disabled={isLoading}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to {pendingStatus === 'confirmed' ? 'confirm' : 'reject'} this booking?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmDialog(false)} disabled={isLoading}>Cancel</button>
                                <button 
                                    type="button" 
                                    className={`btn ${pendingStatus === 'confirmed' ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => updateStatus(pendingStatus)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    {pendingStatus === 'confirmed' ? 'Confirm' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast/Alert */}
            {showSuccessDialog && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto">Success</strong>
                            <button type="button" className="btn-close" onClick={() => setShowSuccessDialog(false)}></button>
                        </div>
                        <div className="toast-body">
                            <div className="d-flex">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                <span>{successMessage}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal Backdrop */}
            {showConfirmDialog && (
                <div className="modal-backdrop fade show"></div>
            )}
        </AuthenticatedLayout>
    );
}