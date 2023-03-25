import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../src/redux/store';

function RedirectPage() {

  const router = useRouter();
  const [isStudent, setIsStudent] = useState(false);
  const { user_id, is_student, is_instructor, context_id } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    if (is_student === 'True') {
      setIsStudent(true);
      dispatchUser();
      router.push({ pathname: 'student', query: { ...router.query } });
    } else if (is_instructor === 'True') {
      dispatchUser();
      router.push('instructor');
    }
    console.table(router.query);
  }, [router.isReady]);

  function dispatchUser() {
    dispatch(authSliceActions.ltiLogin({
      userId: user_id,
      isStudent: is_student,
      isInstructor: is_instructor,
      contextId: context_id,
    }));
  }

  return (
    <>
      {(isStudent) ?
        <div>estudiante</div> :
        <div>No eres estudiante</div>
      }
    </>
  );
}

export default RedirectPage;
