import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getAssignments } from '../service/AssignmentService';
import { notifications } from '@mantine/notifications';
import { assignmentSliceActions } from '../redux/store';
import IAssignment from '../types/IAssignment';
import { useDispatch } from 'react-redux';

function useAssignments(userId: string, contextId: string): ([IAssignment[],  Dispatch<SetStateAction<IAssignment[]>>]) {
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState<IAssignment[]>([]);

  useEffect(() => {
    if (userId != undefined) {
      getAssignments(userId, contextId, false)
        .then(async (response) => {
          if (response.data?.length == 0) {
            notifications.show({message: 'El profesor no ha creado ninguna tarea', autoClose: 3000});
          } else {
            dispatch(
              assignmentSliceActions.saveAssignments(
                response.data.map((a: IAssignment) => {
                  return { ...a };
                }),
              ),
            );
            setAssignments(response.data);
          }
        })
        .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
    }
  }, [userId]);

  return [assignments, setAssignments];
}

export default useAssignments;
