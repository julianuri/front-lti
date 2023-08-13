import IAssignment from '../types/IAssignment';

function useDifferentAssignments(assignments: IAssignment[], editAssignment: boolean, assignmentId: number | typeof NaN) {

  return assignments.map((a: IAssignment) =>
  { return {value: a.id, label: a.name};}).filter(a => {
    if (editAssignment) {
      return a.value !== assignmentId;
    } else {
      return true;
    }
  });
}

export default useDifferentAssignments;
