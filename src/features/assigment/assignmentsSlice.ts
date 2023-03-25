import { createSlice } from '@reduxjs/toolkit';
import { getFromLocalStorage, saveInLocalStorage } from '../../utils/LocalStorage';

const assignmentsSlice = createSlice({
    name: 'assignments',
    initialState: {
      assignments: getFromLocalStorage('assignments', []),
    },
    reducers: {
      saveAssignments: (state: any, action) => {
        saveInLocalStorage({ key: 'assignments', value: action.payload });
        state.assignments = action.payload;
      },
    }
  }
);

export default assignmentsSlice;
