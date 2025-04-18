import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2'

export default function ManageBookings() {
    const { pendingBookings, confirmedBookings, cancelledBookings } = usePage().props;
    const [bookings, setBookings] = useState({
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings
    });
    const [activeTab, setActiveTab] = useState('pending');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash && flash.success) {
            if(selectedStatus === 'confirmed') {
                Swal.fire({
                    title: "Success!",
                    text: flash.success,
                    icon: "success"
                });
            } else {
                Swal.fire({
                    title: "Booking Cancelled",
                    text: flash.error || "The booking request has been cancelled.",
                    icon: "error"
                });
            }
        }
    }, [flash]);

    const handleStatusUpdate = (bookingId, newStatus) => {
        const updatedBooking = bookings.pending.find(booking => booking.id === bookingId);
        
        if (updatedBooking) {
            const newPending = bookings.pending.filter(booking => booking.id !== bookingId);
            updatedBooking.status = newStatus;
            const newStatusList = newStatus === 'confirmed' ? 'confirmed' : 'cancelled';
            
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
        setSelectedStatus(status);
        setSelectedBooking(booking);
        setPendingStatus(status);
        setShowConfirmDialog(true);
    };

    const getBadgeClass = (status) => {
        switch(status) {
            case 'confirmed':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-warning';
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const formatTime = (timeString) => {
        const today = new Date().toISOString().split('T')[0];
        const date = new Date(`${today}T${timeString}`);
    
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    }    

    const renderBookingCard = (booking) => {
        return (
            <div className="card mb-3 shadow-sm" key={booking.id}>
                <div className="card-body">
                    <div className="row">

                        <div className="col-md-12">
                            <div className="card-body p-3">
                                {/* Header row - All in one line */}
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h5 className="card-title mb-0 text-truncate">{booking.patient.name}</h5>
                                    <div className="d-flex align-items-center ms-2">
                                        <span className={`badge ${getBadgeClass(booking.status)} text-uppercase me-2`}>{booking.status}</span>
                                        {booking.status === 'confirmed' && (
                                            <a 
                                                href={`/video-call?booking_id=${booking.id}&patient_id=${booking.patient.id}&recipient=doctor`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-primary d-flex align-items-center"
                                                style={{height: '24px'}}
                                            >
                                                <i className="bi bi-camera-video me-1"></i>
                                                Join Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Booking details */}
                                <div className="row">
                                    <div className="col-md-8">
                                        <p className="card-text mb-2">
                                            <i className="bi bi-calendar-event me-2"></i>
                                            {formatDate(booking.appointment.date_start)} <span className="mx-2">|</span> 
                                            <i className="bi bi-clock me-1" style={{paddingTop:'10px'}}></i>{formatTime(booking.selected_time)}
                                        </p>
                                        <p className="card-text mb-2">
                                            <i className="bi bi-journal me-2"></i>Remarks: {booking.remarks}
                                        </p>
                                    </div>
                                    
                                    {/* Action buttons for pending status */}
                                    {booking.status === 'pending' && (
                                        <div className="col-md-4 d-flex align-items-center justify-content-end">
                                            <div className="btn-group">
                                                <button
                                                    onClick={() => confirmStatusUpdate(booking, 'confirmed')}
                                                    disabled={isLoading}
                                                    className="btn btn-success me-2 d-flex align-items-center"
                                                >
                                                    {isLoading ? (
                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <i className="bi bi-check-circle me-1"></i>
                                                    )}
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => confirmStatusUpdate(booking, 'cancelled')}
                                                    disabled={isLoading}
                                                    className="btn btn-danger d-flex align-items-center"
                                                >
                                                    {isLoading ? (
                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <i className="bi bi-x-circle me-1"></i>
                                                    )}
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="page-heading">
                    <h3>Manage Appointment Bookings</h3>
                </div>
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
                                            className={`nav-link ${activeTab === 'cancelled' ? 'active text-danger' : ''}`}
                                            onClick={() => setActiveTab('cancelled')}
                                            id="cancelled-tab" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#cancelled-tab-pane" 
                                            type="button" 
                                            role="tab" 
                                            aria-controls="cancelled-tab-pane" 
                                            aria-selected={activeTab === 'cancelled'}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Cancelled
                                            <span className="badge bg-danger ms-2 rounded-pill">
                                                {bookings.cancelled.length}
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
                                    
                                    {/* Cancelled Bookings Tab */}
                                    <div 
                                        className={`tab-pane fade ${activeTab === 'cancelled' ? 'show active' : ''}`}
                                        id="cancelled-tab-pane" 
                                        role="tabpanel" 
                                        aria-labelledby="cancelled-tab" 
                                        tabIndex="0"
                                    >
                                        {bookings.cancelled.length > 0 ? (
                                            bookings.cancelled.map(booking => renderBookingCard(booking))
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
                                                <p>No cancelled bookings</p>
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
                                Are you sure you want to {pendingStatus === 'confirmed' ? 'confirm' : 'cancelled'} this booking?
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
                                    {pendingStatus === 'confirmed' ? 'Confirm' : 'Submit'}
                                </button>
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