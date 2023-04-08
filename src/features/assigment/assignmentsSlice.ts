import { createSlice } from '@reduxjs/toolkit';
import { getFromSessionStorage, saveInSessionStorage } from '../../utils/SessionStorage';

const assignmentsSlice = createSlice({
	name: 'assignments',
	initialState: {
		assignments: getAssignments(),
	},
	reducers: {
		saveAssignments: (state: any, action) => {
			saveInSessionStorage({ key: 'assignments', value:   JSON.stringify(action.payload) });
			state.assignments = action.payload;
		},
		saveAssignment: (state: any, action) => {
			saveInSessionStorage({ key: 'assignments', value:   JSON.stringify([...state.assignments, action.payload]) });
			state.assignments = [...state.assignments, action.payload];
		}
	}
}
);

function getAssignments() {
	const item = getFromSessionStorage('assignments', []);
	if (item != null && item.length !== 0) {
		return JSON.parse(item);
	} else {
		return [];
	}
}

export default assignmentsSlice;
