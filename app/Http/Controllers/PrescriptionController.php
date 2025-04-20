<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prescription;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class PrescriptionController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->all();

        $prescription = Prescription::updateOrCreate(
            [
                'patient_id' => $data['patient_id'],
                'doctor_id' => $data['doctor_id'],
                'booking_id' => $data['booking_id'],
            ],
            $data // Fields to update if the record exists
        );

        //return redirect()->back()->with('success', 'Prescription saved successfully!');
    }

    public function downloadPrescriptionPdf($patient_id, $doctor_id, $booking_id)
    {
        $prescription = Prescription::with(['doctor.specialization','doctor.facility','patient'])->where('patient_id', $patient_id)
            ->where('doctor_id', $doctor_id)
            ->where('booking_id', $booking_id)
            ->first();

        $prescriptionData = [
            'content' => $prescription->content,
            'doctorName' => $prescription->doctor->name,
            'specialty' => $prescription->doctor->specialization->name,
            'clinicName' => $prescription->doctor->facility->name,
            'location' => $prescription->doctor->address,
            'phone' => $prescription->doctor->contact,
            'patientName' => $prescription->patient->name,
            'age' => Carbon::parse($prescription->patient->dob)->age,
            'address' => $prescription->patient->address,
            'date' => now()->format('m/d/Y'),
            'dob' => Carbon::parse($prescription->patient->dob)->format('F d, Y'),
            'gender' => ucfirst($prescription->patient->sex),
            'prescriptionNumber' => $prescription->prescription_no,
            'licenseNumber' => $prescription->doctor->license_no,
            'ptrNumber' => $prescription->doctor->ptr_number,
        ];
        
        $pdf = Pdf::loadView('pdf.prescription', $prescriptionData);
        $pdf->setPaper('a4', 'portrait');
        
        // Adjust margins if needed
        // $pdf->setOption('margin-top', '10mm');
        // $pdf->setOption('margin-bottom', '10mm');
        // $pdf->setOption('margin-left', '10mm');
        // $pdf->setOption('margin-right', '10mm');
        
        return $pdf->stream('prescription.pdf');
    }
}
