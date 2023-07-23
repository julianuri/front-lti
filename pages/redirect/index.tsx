import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../src/redux/store';

function RedirectPage() {

	const router = useRouter();
	const { user_id, is_student, is_instructor, context_id, launch_id, session_id, resource_id, lineitem} = router.query;
	const dispatch = useDispatch();
	console.log('query', router.query);

	useEffect(() => {
		if (is_student === 'True') {
			dispatchUser();
			void router.push({ pathname: 'student', query: { ...router.query } });
		} else if (is_instructor === 'True') {
			dispatchUser();
			void router.push({ pathname: 'instructor', query: { ...router.query } });
		}
	}, [router.isReady]);

	function dispatchUser() {
		dispatch(authSliceActions.ltiLogin({
			userId: user_id,
			isStudent: is_student,
			isInstructor: is_instructor,
			contextId: context_id,
			launchId: launch_id,
			sessionId: session_id,
			resourceId: resource_id,
			lineitemUrl: lineitem
		}));
	}
}

export default RedirectPage;
