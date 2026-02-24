// for set-up redux: 1-create store
// store is an kind of library, slices is an kind of boxes that store specific kind of data
import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'

export const store = configureStore({
  reducer: {
    user:userSlice
  }, 
})
