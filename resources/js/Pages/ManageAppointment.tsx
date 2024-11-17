import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Appointment {
    id: number;
    date: string;
    time: string;
    slot: number;
}

export default function ManageAppointment() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Open Modal (Add or Edit)
    const openModal = (appointment?: Appointment) => {
        if (appointment) {
            setCurrentAppointment(appointment); // Populate with existing data for editing
        } else {
            setCurrentAppointment({ id: 0, date: '', time: '', slot: 1 }); // Default for new appointment
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentAppointment(null);
        setIsModalOpen(false);
    };

    // Save Appointment (Create or Update)
    const handleSave = () => {
        if (currentAppointment) {
            if (currentAppointment.id) {
                // Edit Existing Appointment
                setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment.id === currentAppointment.id ? currentAppointment : appointment
                    )
                );
            } else {
                // Add New Appointment
                setAppointments((prev) => [
                    ...prev,
                    { ...currentAppointment, id: Date.now() }, // Generate unique ID
                ]);
            }
        }
        closeModal();
    };

    // Delete Appointment
    const handleDelete = (id: number) => {
        setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Manage Appointments
                </h2>
            }
        >
            <Head title="Manage Appointments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="mb-4 text-lg font-medium">Appointments</h3>

                            <button
                                className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                                onClick={() => openModal()}
                            >
                                Add Appointment
                            </button>

                            {/* Appointments Table */}
                            <table className="min-w-full bg-white dark:bg-gray-800 border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                            ID
                                        </th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                            Date
                                        </th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                            Time
                                        </th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                            Slot
                                        </th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td className="px-4 py-2">{appointment.id}</td>
                                            <td className="px-4 py-2">{appointment.date}</td>
                                            <td className="px-4 py-2">{appointment.time}</td>
                                            <td className="px-4 py-2">{appointment.slot}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => openModal(appointment)}
                                                    className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(appointment.id)}
                                                    className="px-2 py-1 ml-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                            {currentAppointment?.id ? 'Edit Appointment' : 'Add Appointment'}
                        </h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="date"
                                className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                                value={currentAppointment?.date || ''}
                                onChange={(e) =>
                                    setCurrentAppointment((prev) =>
                                        prev ? { ...prev, date: e.target.value } : null
                                    )
                                }
                            />
                            <input
                                type="time"
                                className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                                value={currentAppointment?.time || ''}
                                onChange={(e) =>
                                    setCurrentAppointment((prev) =>
                                        prev ? { ...prev, time: e.target.value } : null
                                    )
                                }
                            />
                            <input
                                type="number"
                                min="1"
                                className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                                value={currentAppointment?.slot || 1}
                                onChange={(e) =>
                                    setCurrentAppointment((prev) =>
                                        prev ? { ...prev, slot: parseInt(e.target.value) } : null
                                    )
                                }
                            />
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <button
                                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button
                                className="px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}



// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//     fetchAppointmentsRequest,
//     addAppointmentRequest,
//     updateAppointmentRequest,
//     deleteAppointmentRequest,
// } from '@/features/appointmentsSlice';
// import { RootState, AppDispatch } from '@/store';

// export default function ManageAppointment() {
//     const dispatch = useDispatch<AppDispatch>();
//     const { appointments, loading, error } = useSelector((state: RootState) => state.appointments);

//     const [currentAppointment, setCurrentAppointment] = useState<any | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     useEffect(() => {
//         dispatch(fetchAppointmentsRequest());
//     }, [dispatch]);

//     const openModal = (appointment?: any) => {
//         if (appointment) {
//             setCurrentAppointment(appointment);
//         } else {
//             setCurrentAppointment({ date: '', time: '', slot: 1 });
//         }
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setCurrentAppointment(null);
//     };

//     const saveAppointment = () => {
//         if (currentAppointment.id) {
//             dispatch(updateAppointmentRequest({ id: currentAppointment.id, data: currentAppointment }));
//         } else {
//             dispatch(addAppointmentRequest(currentAppointment));
//         }
//         closeModal();
//     };

//     const removeAppointment = (id: number) => {
//         dispatch(deleteAppointmentRequest(id));
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div>
//             <h1>Manage Appointments</h1>
//             <button onClick={() => openModal()}>Add Appointment</button>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Date</th>
//                         <th>Time</th>
//                         <th>Slot</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {appointments.map((a) => (
//                         <tr key={a.id}>
//                             <td>{a.id}</td>
//                             <td>{a.date}</td>
//                             <td>{a.time}</td>
//                             <td>{a.slot}</td>
//                             <td>
//                                 <button onClick={() => openModal(a)}>Edit</button>
//                                 <button onClick={() => removeAppointment(a.id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {isModalOpen && (
//                 <div>
//                     <h2>{currentAppointment.id ? 'Edit' : 'Add'} Appointment</h2>
//                     <input
//                         type="date"
//                         value={currentAppointment.date}
//                         onChange={(e) => setCurrentAppointment({ ...currentAppointment, date: e.target.value })}
//                     />
//                     <input
//                         type="time"
//                         value={currentAppointment.time}
//                         onChange={(e) => setCurrentAppointment({ ...currentAppointment, time: e.target.value })}
//                     />
//                     <input
//                         type="number"
//                         value={currentAppointment.slot}
//                         onChange={(e) => setCurrentAppointment({ ...currentAppointment, slot: parseInt(e.target.value) })}
//                     />
//                     <button onClick={saveAppointment}>Save</button>
//                     <button onClick={closeModal}>Cancel</button>
//                 </div>
//             )}
//         </div>
//     );
// }
