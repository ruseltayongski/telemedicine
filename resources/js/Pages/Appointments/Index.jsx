import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ appointments, search }) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
    });

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('appointments.index'), { search: searchTerm });
    };

    // Handle create appointment
    const handleCreate = () => {
        router.post(route('appointments.store'), formData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setFormData({
                    title: '',
                    description: '',
                    start_time: '',
                    end_time: '',
                });
            },
        });
    };

    // Handle edit appointment
    const handleEdit = (appointment) => {
        setSelectedAppointment(appointment);
        setFormData({
            title: appointment.title,
            description: appointment.description,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = () => {
        router.put(route('appointments.update', selectedAppointment.id), formData, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    // Handle delete appointment
    const handleDelete = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('appointments.destroy', selectedAppointment.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
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

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-3">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </div>
            </form>

            {/* Create Appointment Button */}
            <button
                className="btn btn-success mb-3"
                onClick={() => setIsCreateModalOpen(true)}
            >
                Create Appointment
            </button>

            {/* Appointments Table */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.data.map(appointment => (
                        <tr key={appointment.id}>
                            <td>{appointment.title}</td>
                            <td>{appointment.start_time}</td>
                            <td>{appointment.end_time}</td>
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
            <div className="d-flex justify-content-center">
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
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
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
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
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