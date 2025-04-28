import { configureStore } from '@reduxjs/toolkit';
import builderReducer from '../features/templateSlice'

const store = configureStore({
    reducer: {
        resumeBuilder: builderReducer,
    },
})

export default store;

