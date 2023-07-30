import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../redux/store';
import { getAssignments } from '../../service/AssignmentService';
import { useEffect } from 'react';
import IAssignment from '../../types/IAssignment';
import { Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';

const InstructorHome = () => {
  const dispatch = useDispatch();
  const { userId, contextId } = useSelector(
    (state: RootState) => state.auth,
  );

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
                  return { id: a.id, name: a.name, gameId: a.gameId };
                }),
              ),
            );
          }
        })
        .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
    }
  }, [userId]);

  return (
    <Stack
      h={300}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      })}
    >
      <Button variant="outline">Createssss Assignments</Button>
      <Button variant="outline">Edit Assignments</Button>
      <Button variant="outline">Delete Assignments</Button>
    </Stack>
  );
};

export default InstructorHome;
