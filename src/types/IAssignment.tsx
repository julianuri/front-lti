interface IAssignment {
  id: number;
  name: string;
  gameId: number;
  inProgress: boolean;
  attemptsLeft: number;
  requiredAssignment: number;
  requiredAssignmentSatisfied: boolean;
}

export default IAssignment;
