import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import appointmentsReducer from './features/appointmentsSlice';
import appointmentsSaga from './sagas/appointmentsSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        appointments: appointmentsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(appointmentsSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;