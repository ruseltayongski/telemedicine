<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prescription;
use Barryvdh\DomPDF\Facade\Pdf;

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

        return redirect()->back()->with('success', 'Prescription saved successfully!');
    }

    public function downloadPrescriptionPdf($patient_id, $doctor_id, $booking_id)
    {
        $prescription = Prescription::where('patient_id', $patient_id)
            ->where('doctor_id', $doctor_id)
            ->where('booking_id', $booking_id)
            ->first();
        $pdf = Pdf::loadView('pdf.prescription', ['prescription' => $prescription]);
        return $pdf->stream('prescription.pdf');
    }
}
