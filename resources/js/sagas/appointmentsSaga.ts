import { takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    fetchAppointmentsRequest,
    fetchAppointmentsSuccess,
    fetchAppointmentsFailure,
    addAppointmentRequest,
    addAppointmentSuccess,
    addAppointmentFailure,
    updateAppointmentRequest,
    updateAppointmentSuccess,
    updateAppointmentFailure,
    deleteAppointmentRequest,
    deleteAppointmentSuccess,
    deleteAppointmentFailure,
} from '../features/appointmentsSlice';

const API_URL = '/api/appointments';

// Fetch Appointments
function* fetchAppointmentsSaga() {
    try {
        const response = yield call(axios.get, API_URL);
        yield put(fetchAppointmentsSuccess(response.data));
    } catch (error) {
        yield put(fetchAppointmentsFailure(error.message));
    }
}

// Add Appointment
function* addAppointmentSaga(action: any) {
    try {
        const response = yield call(axios.post, API_URL, action.payload);
        yield put(addAppointmentSuccess(response.data));
    } catch (error) {
        yield put(addAppointmentFailure(error.message));
    }
}

// Update Appointment
function* updateAppointmentSaga(action: any) {
    try {
        const { id, data } = action.payload;
        const response = yield call(axios.put, `${API_URL}/${id}`, data);
        yield put(updateAppointmentSuccess(response.data));
    } catch (error) {
        yield put(updateAppointmentFailure(error.message));
    }
}

// Delete Appointment
function* deleteAppointmentSaga(action: any) {
    try {
        yield call(axios.delete, `${API_URL}/${action.payload}`);
        yield put(deleteAppointmentSuccess(action.payload));
    } catch (error) {
        yield put(deleteAppointmentFailure(error.message));
    }
}

export default function* appointmentsSaga() {
    yield takeEvery(fetchAppointmentsRequest.type, fetchAppointmentsSaga);
    yield takeEvery(addAppointmentRequest.type, addAppointmentSaga);
    yield takeEvery(updateAppointmentRequest.type, updateAppointmentSaga);
    yield takeEvery(deleteAppointmentRequest.type, deleteAppointmentSaga);
}