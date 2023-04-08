import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../redux/store';
import Link from 'next/link';
import { getAssignments } from '../../service/AssignmentService';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import styles from './Instructor.module.scss';
import IAssignment from '../../types/IAssignment';

const InstructorHome = () => {

	const dispatch = useDispatch();
	const { userId, contextId, isStudent } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (userId != undefined) {
			getAssignments(userId, contextId, isStudent).then(async (response) => {
				if (response.data?.length == 0) {
					toast.success('Teacher has not created any assigment yet');
				} else {
					dispatch(assignmentSliceActions.saveAssignments(response.data.map((a: IAssignment) => {
						return { id: a.id, name: a.name, gameId: a.gameId };
					})));
				}
			}
			).catch((error) =>
				toast.error(error.message)
			);
		}
	}, [userId]);

	return (
		<div className={styles.cardsContainer}>
			<Link className={styles.card} href='assignment/create'>Create Assignments</Link>
			<div className={styles.card}>Edit Assignments</div>
			<Link className={styles.card} href='assignment/delete'>Delete Assignments</Link>
		</div>
	);
};

export default InstructorHome;
