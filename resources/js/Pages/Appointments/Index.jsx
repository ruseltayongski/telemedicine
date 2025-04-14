import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2'

export default function Index({ appointments, search }) {
    const user = usePage().props.auth.user;
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date_start: '',
        date_end: '',
        slot: 1,
        doctor_id: user.id
    });

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('appointments.index'), { search: searchTerm });
    };

    // Handle create appointment
    const handleCreate = () => {
        router.post(route('appointments.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Created!',
                    text: 'Appointment has been created successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setFormData({
                    ...formData,
                    title: '',
                    date_start: '',
                    slot: 1
                });
            },
        });
    };

    // Handle edit appointment
    const handleEdit = (appointment) => {
        setSelectedAppointment(appointment);
        setFormData({
            ...formData,
            title: appointment.title,
            // description: appointment.description,
            date_start: appointment.date_start,
            date_end: appointment.date_end,
            slot: appointment.slot
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = () => {
        router.put(route('appointments.update', selectedAppointment.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Appointment has been updated successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setFormData({
                    ...formData,
                    title: '',
                    date_start: '',
                    slot: 1
                });
            },
        });
    };

    // Handle delete appointment
    const handleDelete = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('appointments.destroy', selectedAppointment.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Appointment has been deleted successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="page-heading">
                    <h3>Appointments</h3>
                </div>
            }
        >
            <Head title="Appointments" />

            <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="d-flex w-50 w-md-100 me-md-2">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                {/* Create Appointment Button */}
                <button
                    className="btn btn-success"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create Appointment
                </button>
            </div>

            {/* Appointments Table */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        {/* <th>Date End</th> */}
                        <th>Slot</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.data.map(appointment => (
                        <tr key={appointment.id}>
                            <td>{appointment.title}</td>
                            <td>
                                {new Date(appointment.date_start).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })} 
                            </td>
                            {/* <td>{appointment.date_end}</td> */}
                            <td>{appointment.slot}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleEdit(appointment)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(appointment)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-end mt-4 mb-4">
                {appointments.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 mx-1 border rounded ${
                            link.active ? 'bg-primary text-white' : 'bg-white'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>

            {/* Create Appointment Modal */}
            <div className={`modal fade ${isCreateModalOpen ? 'show' : ''}`} style={{ display: isCreateModalOpen ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create Appointment</h5>
                            <button type="button" className="btn-close" onClick={() => setIsCreateModalOpen(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label">DATE</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.date_start}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label className="form-label">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.date_end}
                                        onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label">Slot</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.slot}
                                        onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Appointment Modal */}
            <div className={`modal fade ${isEditModalOpen ? 'show' : ''}`} style={{ display: isEditModalOpen ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Appointment</h5>
                            <button type="button" className="btn-close" onClick={() => setIsEditModalOpen(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.date_start}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label className="form-label">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.date_end}
                                        onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label">Slot</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.slot}
                                        onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`modal fade ${isDeleteModalOpen ? 'show' : ''}`} style={{ display: isDeleteModalOpen ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Appointment</h5>
                            <button type="button" className="btn-close" onClick={() => setIsDeleteModalOpen(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this appointment?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}