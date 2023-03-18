import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../app/store'

export interface ActionMessageSlice {
  value: string
}

const initialState: ActionMessageSlice = {
  value: ''
}

export const actionMessageSlice = createSlice({
  name: 'actionMessage',
  initialState,
  reducers: {
    setActionMessage: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    }
  }
})

export const { setActionMessage } = actionMessageSlice.actions

export const selectActionMessage = (state: RootState) => state.actionMessage.value

export default actionMessageSlice.reducer
