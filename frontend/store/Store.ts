import { configureStore } from '@reduxjs/toolkit'
import cassoReducer from './casso/Slice'
import appReducer from './app/Slice'

export const store = configureStore({
    reducer: {
        casso: cassoReducer,
        app: appReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch