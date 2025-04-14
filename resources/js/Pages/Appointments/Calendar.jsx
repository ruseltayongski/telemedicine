import { Head, Link, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2'

// Import the necessary FullCalendar components
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar({ appointments }) {
    const calendarRef = useRef(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Get current date info for default events
    const date = new Date();
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    
    // const events = [
    //     {
    //         title: 'All Day Event',
    //         start: new Date(y, m, 1),
    //         className: 'default'
    //     },
    //     {
    //         id: 999,
    //         title: 'Repeating Event',
    //         start: new Date(y, m, d-3, 16, 0),
    //         allDay: false,
    //         className: 'info'
    //     },
    //     {
    //         title: 'Meeting',
    //         start: new Date(y, m, d, 10, 30),
    //         allDay: false,
    //         className: 'important'
    //     },
    //     // {
    //     //     title: 'Lunch',
    //     //     start: new Date(y, m, d, 12, 0),
    //     //     end: new Date(y, m, d, 14, 0),
    //     //     allDay: false,
    //     //     className: 'important'
    //     // },
    //     // {
    //     //     title: 'Click for Google',
    //     //     start: new Date(y, m, 28),
    //     //     end: new Date(y, m, 29),
    //     //     url: 'https://ccp.cloudaccess.net/aff.php?aff=5188',
    //     //     className: 'success'
    //     // }
    // ];

    let events = appointments.map((appointment, index) => {     
        return {
            id: appointment.id,
            title: appointment.title || "Untitled Event",
            start: appointment.date_start,
            allDay: true,
            className: "info",
        };
    });

    const handleDateSelect = (selectInfo) => {
        setRemarks("");
        setSelectedDate(selectInfo.event.start);
        setSelectedEvent({id: selectInfo.event.id});
        setIsModalOpen(true);
    };

    // Handle appointment booking confirmation
    const handleBookAppointment = () => {
        if (!selectedEvent) return;
        
        selectedEvent.selected_time = selectedTime;
        selectedEvent.remarks = remarks;
        setLoading(true);
    
        router.post(route("appointments.book"), selectedEvent, {
            preserveScroll: true,
            onSuccess: (response) => {
                console.log(response);
                setLoading(false);
                setIsModalOpen(false);
                Swal.fire({
                    title: "Success!",
                    text: "Your appointment has been successfully booked. We look forward to seeing you!",
                    icon: "success"
                });
            },
            onError: (errors) => {
                setLoading(false);
                setIsModalOpen(false);
                Swal.fire({
                    title: "Appointment Already Booked",
                    text: "You have already booked this appointment. Please check your schedule for details.",
                    icon: "error"
                });
            },
        });
    };

    // const renderEventContent = (eventInfo) => {
    //     const timeMatch = eventInfo.event.title.match(/^(\d+p)\s+(.+)$/);
    //     let title = eventInfo.event.title;
        
    //     if (timeMatch) {
    //         const [, timePrefix, actualTitle] = timeMatch;
    //         title = actualTitle;
            
    //         return (
    //             <>
    //                 <div className="fc-daygrid-event-dot"></div>
    //                 <div className="fc-event-time">{timePrefix}</div>
    //                 <div className="fc-event-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //                     {title}
    //                 </div>
    //             </>
    //         );
    //     }
        
    //     // If no time prefix is found, just return the title
    //     return (
    //         <>
    //             <div className="fc-daygrid-event-dot"></div>
    //             <div className="fc-event-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //                 {title}
    //             </div>
    //         </>
    //     );
    // };

    const renderEventContent = (eventInfo) => {
        const timeMatch = eventInfo.event.title.match(/^(\d+p)\s+(.+)$/);
        let title = eventInfo.event.title;
        const maxLength = 20;
        const isLong = title.length > maxLength;
        if (timeMatch) {
            const [, timePrefix, actualTitle] = timeMatch;
            title = actualTitle;
            
            return (
                <>
                    <div className="fc-daygrid-event-dot"></div>
                    <div className="fc-event-time">{timePrefix}</div>
                    <div className="fc-event-title" style={{ fontSize: title.length > maxLength ? '0.8em' : '1em' }}>
                        {title}
                    </div>
                </>
            );
        }
        
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="fc-daygrid-event-dot"></div>
                <div
                    className="fc-event-title"
                    style={{
                        fontSize: isLong ? '0.8em' : '1em',
                        marginTop: isLong ? '5px' : '0px',
                    }}
                >
                    {title}
                </div>
            </div>
        );
    };

    const [selectedTime, setSelectedTime] = useState('');
    const [remarks, setRemarks] = useState("");
    const [timeOptions, setTimeOptions] = useState([]);
    // const [selectedDate, setSelectedDate] = useState(() => {
    //     const tomorrow = new Date();
    //     tomorrow.setDate(tomorrow.getDate() + 1);
    //     return tomorrow.toISOString().split('T')[0];
    // });
    const [selectedDate, setSelectedDate] = useState('');
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const today = new Date();
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
      
        let start = new Date(selectedDate);
        if (selected.getTime() === today.getTime()) {
          start = new Date(now.getTime() + 40 * 60000);
        } else {
          start.setHours(0, 0, 0, 0);
        }
      
        const end = new Date(selectedDate);
        end.setHours(23, 59, 59);
      
        while (start <= end) {
          const formattedTime = start.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
      
          slots.push(formattedTime);
          start = new Date(start.getTime() + 30 * 60000);
        }
      
        setTimeOptions(slots);
        setSelectedTime(slots[0] || '');
    };

    useEffect(() => {
        generateTimeSlots();
    }, [selectedDate]);

    return (
        <GuestLayout>
            <Head title="Book Appointment" />

            <div className="breadcrumbs overlay">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
                            <div className="breadcrumbs-content">
                                <h1 className="page-title">Calendar</h1>
                            </div>
                            <ul className="breadcrumb-nav">
                                <li><Link href={route('home')}>Home</Link></li>
                                <li>Calendar</li>
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
                                <h3>Available Appointments</h3>
                                <h2>Book Your Appointment</h2>
                                <p>Select from the available appointment slots below to schedule your consultation quickly and conveniently.</p>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="form-main">
                                    <div id="wrap">
                                        <div id="calendar-container" style={{ 
                                            width: '100%', 
                                            margin: '0 auto',
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '6px',
                                            boxShadow: '0px 0px 21px 2px rgba(0,0,0,0.18)',
                                            padding: '20px'
                                        }}>
                                            <FullCalendar
                                                ref={calendarRef}
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                headerToolbar={{
                                                    left: 'title',
                                                    center: 'dayGridMonth,timeGridWeek,timeGridDay',
                                                    right: 'prev,next today'
                                                }}
                                                initialView="dayGridMonth"
                                                editable={true}
                                                selectable={true}
                                                selectMirror={true}
                                                dayMaxEvents={true}
                                                // firstDay={1} // Monday
                                                events={events}
                                                //select={handleDateSelect}
                                                eventClick={handleDateSelect}
                                                height="auto"
                                                eventContent={renderEventContent}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mt-5">
                <div className={`modal fade ${isModalOpen ? "show d-block" : ""}`} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Booking</h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Please select time for your appointment.</p>
                                <select
                                    className="form-select mt-2"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                >
                                    {timeOptions.map((time, index) => (
                                        <option key={index} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                                {/* Remarks Field */}
                                <label className="mt-3">Remarks (optional)</label>
                                <textarea
                                    className="form-control"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows="3"
                                    placeholder="Enter any remarks or notes for the doctor..."
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={handleBookAppointment} disabled={loading}>
                                    {loading ? "Booking..." : "Confirm"}
                                </button>
                                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isModalOpen && <div className="modal-backdrop fade show"></div>}
            </div>
        </GuestLayout>
    );
}