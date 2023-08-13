import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../src/redux/store';
import RoleEnum from '../../src/types/enums/RoleEnum';

function RedirectPage() {
	const router = useRouter();
	const { user_id, role, context_id, launch_id, session_id, resource_id, lineitem} = router.query;
	const dispatch = useDispatch();

	useEffect(() => {
		if (role === RoleEnum.STUDENT) {
			dispatchUser();
			void router.push({ pathname: 'student', query: { ...router.query } });
		} else if (role === RoleEnum.TEACHER) {
			dispatchUser();
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
			lineitemUrl: lineitem
		}));
	}
}

export default RedirectPage;
