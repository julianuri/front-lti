import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../src/redux/store';

function RedirectPage() {
	const router = useRouter();
	const { user_id, is_student, is_instructor, context_id, launch_id } = router.query;
	const dispatch = useDispatch();

	useEffect(() => {
		if (is_student === 'True') {
			dispatchUser();
			router.push({ pathname: 'student', query: { ...router.query } });
		} else if (is_instructor === 'True') {
			dispatchUser();
			router.push('instructor');
		}
	}, [router.isReady]);

	function dispatchUser() {
		dispatch(authSliceActions.ltiLogin({
			userId: user_id,
			isStudent: is_student,
			isInstructor: is_instructor,
			contextId: context_id,
			launchId: launch_id
		}));
	}
}

export default RedirectPage;
