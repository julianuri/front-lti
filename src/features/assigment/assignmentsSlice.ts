import { createSlice } from '@reduxjs/toolkit';
import { getFromSessionStorage, saveInSessionStorage } from '../../utils/LocalStorage';

const assignmentsSlice = createSlice({
	name: 'assignments',
	initialState: {
		assignments: getFromSessionStorage('assignments', [])
	},
	reducers: {
		saveAssignments: (state: any, action) => {
			saveInSessionStorage({ key: 'assignments', value: action.payload });
			state.assignments = action.payload;
		},
		saveAssignment: (state: any, action) => {
			saveInSessionStorage({ key: 'assignments', value: [...state.assignments, action.payload] });
			state.assignments = [...state.assignments, action.payload];
		}
	}
}
);

export default assignmentsSlice;
