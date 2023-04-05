import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './DeleteAssignment.module.scss';
import Link from 'next/link';
import { assignmentSliceActions } from '../../../redux/store';
import { dropAssignment } from '../../../service/AssignmentService';
import toast from 'react-hot-toast';
import IAssignment from '../../../types/IAssignment';

const DeleteAssignment = () => {
	const dispatch = useDispatch();
	const { assignments } = useSelector((state) => state.assignment);
	const [currentAssignments, setAssignments] = useState<IAssignment[]>([]);

	useEffect(() => {
		if (assignments != undefined) {
			setAssignments(assignments);
		}
	}, [assignments]);

	const deleteAssignment = (id: number) => {
		const newAssignments = currentAssignments.filter(x => x.id != id);
		dropAssignment(id).then(async () => {
			dispatch(assignmentSliceActions.saveAssignments(newAssignments));
			toast.success('Assignment deleted');
		}
		).catch((error) =>
			toast.error(error.message)
		);
	};

	return (
		<div className={styles.page}>
			<div className={styles.cardsContainer}>
				{currentAssignments.map(assignment => {
					return (
						<div
							key={assignment.id} className={styles.card}
							onClick={() => deleteAssignment(assignment.id)}
						>{assignment.name}
						</div>
					);
				})}
			</div>
			<Link className={styles.button} href='/instructor'>Back</Link>
		</div>
	);
};

export default DeleteAssignment;
