import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const BookingCard = ({ booking, onStatusUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async (status) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`/doctor/bookings/${booking.id}/status`, {
                status
            });
            onStatusUpdate(booking.id, status);
        } catch (error) {
            console.error('Error updating booking status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Format appointment date and time
    const appointmentDate = new Date(booking.appointment.date).toLocaleDateString();
    const startTime = booking.appointment.start_time;
    const endTime = booking.appointment.end_time;

    // Get appropriate badge color based on status
    const getBadgeClass = () => {
        switch(booking.status) {
            case 'confirmed':
                return 'bg-success';
            case 'rejected':
                return 'bg-danger';
            default:
                return 'bg-warning';
        }
    };

    return (
        <div className="card mb-3 shadow-sm">
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
                            Status: <span className={`badge ${getBadgeClass()} text-uppercase`}>{booking.status}</span>
                        </p>
                    </div>
                    
                    {booking.status === 'pending' && (
                        <div className="col-md-4 d-flex align-items-center justify-content-end">
                            <div className="btn-group">
                                <button
                                    onClick={() => updateStatus('confirmed')}
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
                                    onClick={() => updateStatus('rejected')}
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

export default function ManageBookings() {
    const { pendingBookings, confirmedBookings, rejectedBookings } = usePage().props;
    const [bookings, setBookings] = useState({
        pending: pendingBookings,
        confirmed: confirmedBookings,
        rejected: rejectedBookings
    });
    const [activeTab, setActiveTab] = useState('pending');

    const handleStatusUpdate = (bookingId, newStatus) => {
        // Find the booking that was updated
        const updatedBooking = bookings.pending.find(booking => booking.id === bookingId);
        
        if (updatedBooking) {
            // Remove from pending
            const newPending = bookings.pending.filter(booking => booking.id !== bookingId);
            
            // Update the booking status
            updatedBooking.status = newStatus;
            
            // Add to appropriate list
            const newStatusList = newStatus === 'confirmed' ? 'confirmed' : 'rejected';
            
            setBookings({
                ...bookings,
                pending: newPending,
                [newStatusList]: [...bookings[newStatusList], updatedBooking]
            });
        }
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
                                            bookings.pending.map(booking => (
                                                <BookingCard 
                                                    key={booking.id} 
                                                    booking={booking} 
                                                    onStatusUpdate={handleStatusUpdate} 
                                                />
                                            ))
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
                                            bookings.confirmed.map(booking => (
                                                <BookingCard 
                                                    key={booking.id} 
                                                    booking={booking} 
                                                />
                                            ))
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
                                            bookings.rejected.map(booking => (
                                                <BookingCard 
                                                    key={booking.id} 
                                                    booking={booking} 
                                                />
                                            ))
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
        </AuthenticatedLayout>
    );
}