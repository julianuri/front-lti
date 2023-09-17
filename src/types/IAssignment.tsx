interface IAssignment {
  id: number;
  name: string;
  gameId: number;
  inProgress: boolean;
  registerDate: string;
  attempts: number;
  attemptsLeft: number;
  requiredAssignment: number;
  requiredAssignmentSatisfied: boolean;
}

export default IAssignment;
