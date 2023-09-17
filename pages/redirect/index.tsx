import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSliceActions, assignmentSliceActions } from '../../src/redux/store';
import RoleEnum from '../../src/types/enums/RoleEnum';

function RedirectPage() {
	const router = useRouter();
	const {
		user_id,
		role,
		context_id,
		launch_id,
		session_id,
		resource_id,
		lineitem,
		launchedGameId,
		launchedAssignmentId,
		linkedAssignmentId,
		resource_name,
		attemptsLimitHasBeenReached,
		attempts,
		timeHasRunOut,
	} = router.query;

	const dispatch = useDispatch();

	useEffect(() => {
		if (role === RoleEnum.STUDENT) {
			dispatchUser();
			if (launchedGameId === undefined || attemptsLimitHasBeenReached !== undefined || timeHasRunOut !== undefined) {
				void router.push({ pathname: 'student', query: { ...router.query } });
			} else {
				dispatchLaunchedAssignment();
				void router.push({ pathname: 'game', query: { gameId: launchedGameId, assignmentId: launchedAssignmentId } });
			}

		} else if (role === RoleEnum.TEACHER) {
			dispatchUser();
			if (linkedAssignmentId !== undefined) {
				dispatchLinkedAssignment();
			}
			void router.push({ pathname: 'assignment', query: { ...router.query } });
		}
	}, [router.isReady]);

	function dispatchUser() {
		dispatch(authSliceActions.ltiLogin({
			userId: user_id,
			role: role,
			contextId: context_id,
			launchId: launch_id,
			sessionId: session_id,
			resourceId: resource_id,
			lineitemUrl: lineitem,
			resourceName: resource_name,
			attempts: attempts,
		}));
	}

	function dispatchLaunchedAssignment() {
		dispatch(assignmentSliceActions.saveLaunchedAssignment({
			launchedAssignmentId: launchedAssignmentId,
			launchedGameId: launchedGameId
		}));
	}

	function dispatchLinkedAssignment() {
		dispatch(assignmentSliceActions.saveLinkedAssignment({
			linkedAssignmentId: linkedAssignmentId,
		}));
	}
}

export default RedirectPage;
