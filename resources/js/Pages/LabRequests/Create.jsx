import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, labTests, patients }) {
  const { data, setData, post, processing, errors } = useForm({
    lab_test_id: '',
    patient_id: '',
    booking_id: '',
    requested_date: new Date().toISOString().substr(0, 10),
    doctor_notes: '',
    priority: 'normal',
  });

  const [selectedTest, setSelectedTest] = useState(null);

  const handleTestChange = (e) => {
    const testId = e.target.value;
    setData('lab_test_id', testId);
    
    const test = labTests.find(test => test.id == testId);
    setSelectedTest(test);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('lab-requests.store'), {
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout 
        header={
            <div className="page-heading">
                <h3>Create New Lab Request</h3>
            </div>
        }
    >
        <Head title="Create New Lab Request" />
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                <h1 className="text-2xl font-bold mb-6">Create New Lab Request</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lab_test_id">
                        Select Lab Test
                    </label>
                    <select
                        id="lab_test_id"
                        value={data.lab_test_id}
                        onChange={handleTestChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">-- Select a Lab Test --</option>
                        {labTests.map(test => (
                        <option key={test.id} value={test.id}>
                            {test.name} ({test.code})
                        </option>
                        ))}
                    </select>
                    </div>

                    {selectedTest && (
                    <div className="mb-6 p-4 bg-gray-50 rounded">
                        <h3 className="font-bold text-lg mb-2">{selectedTest.name}</h3>
                        <p className="mb-2">Code: {selectedTest.code}</p>
                        <p className="mb-2">Price: ${selectedTest.price}</p>
                        {selectedTest.requires_fasting && (
                        <p className="text-red-600 font-bold">Fasting Required</p>
                        )}
                    </div>
                    )}
                    
                    <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patient_id">
                        Select Patient
                    </label>
                    <select
                        id="patient_id"
                        value={data.patient_id}
                        onChange={e => setData('patient_id', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">-- Select a Patient --</option>
                        {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                            {patient.name} (ID: {patient.id})
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requested_date">
                        Requested Date
                    </label>
                    <input
                        id="requested_date"
                        type="date"
                        value={data.requested_date}
                        onChange={e => setData('requested_date', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    </div>
                    
                    <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctor_notes">
                        Doctor's Notes
                    </label>
                    <textarea
                        id="doctor_notes"
                        value={data.doctor_notes}
                        onChange={e => setData('doctor_notes', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                    ></textarea>
                    </div>
                    
                    <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Priority
                    </label>
                    <div className="mt-2">
                        <label className="inline-flex items-center mr-6">
                        <input
                            type="radio"
                            name="priority"
                            value="normal"
                            checked={data.priority === 'normal'}
                            onChange={e => setData('priority', e.target.value)}
                            className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Normal</span>
                        </label>
                        <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="priority"
                            value="urgent"
                            checked={data.priority === 'urgent'}
                            onChange={e => setData('priority', e.target.value)}
                            className="form-radio h-5 w-5 text-red-600"
                        />
                        <span className="ml-2 text-gray-700">Urgent</span>
                        </label>
                    </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={processing}
                    >
                        {processing ? 'Creating...' : 'Create Lab Request'}
                    </button>
                    <Link
                        href="#"
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Cancel
                    </Link>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>
    </AuthenticatedLayout>
  );
}
