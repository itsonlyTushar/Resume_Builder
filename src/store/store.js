import { configureStore } from '@reduxjs/toolkit';
import builderReducer from '../state_templates/templateSlice'

const store = configureStore({
    reducer: {
        resumeBuilder: builderReducer,
    },
})

export default store;

