import { createSlice } from '@reduxjs/toolkit';
import {
  getFromSessionStorage,
  saveInSessionStorage,
} from '../../utils/SessionStorage';

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: getAssignments(),
    launchedAssignmentId: 0,
    launchedGameId: 0,
    linkedAssignmentId: 0
  },
  reducers: {
    saveAssignments: (state: any, action) => {
      saveInSessionStorage({
        key: 'assignments',
        value: JSON.stringify(action.payload),
      });
      state.assignments = action.payload;
    },
    saveAssignment: (state: any, action) => {
      saveInSessionStorage({
        key: 'assignments',
        value: JSON.stringify([...state.assignments, action.payload]),
      });
      state.assignments = [...state.assignments, action.payload];
    },
    saveLaunchedAssignment: (state: any, action) => {
      saveInSessionStorage(
        { key: 'launchedAssignmentId', value: action.payload.launchedAssignmentId },
        { key: 'launchedGameId', value: action.payload.launchedGameId });
      state.launchedAssignmentId = action.payload.launchedAssignmentId;
      state.launchedGameId = action.payload.launchedGameId;
    },
    saveLinkedAssignment: (state: any, action) => {
      saveInSessionStorage(
        { key: 'linkedAssignmentId', value: action.payload.linkedAssignmentId });
      state.linkedAssignmentId = action.payload.linkedAssignmentId;
    }
  },
});

function getAssignments() {
  const item = getFromSessionStorage('assignments', []);
  if (item != null && item.length !== 0) {
    return JSON.parse(item);
  } else {
    return [];
  }
}

export default assignmentsSlice;
