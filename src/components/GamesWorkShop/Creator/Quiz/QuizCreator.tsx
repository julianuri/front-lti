import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Button, Container, Grid, Group, Paper } from '@mantine/core';
import { NativeSelect } from 'react-hook-form-mantine';
import IAssignment from '../../../../types/IAssignment';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import { saveAssignment } from '../../../../service/AssignmentService';
import { getAllQuestionBanks } from '../../../../service/QuestionBankService';
import { notifications } from '@mantine/notifications';
import gameEnum from '../../../../types/enums/GameEnum';
import { useRouter } from 'next/router';

interface RouteAssignment {
  assignmentId: number | typeof NaN;
}

const QuizCreator = ({ assignmentId }: RouteAssignment) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, userId, resourceId, lineitemUrl, resourceName, attempts } = useSelector((state: RootState) => state.auth);
  const [questionBanks, setQuestionBanks] = useState([]);
  const editAssignment = !Number.isNaN(assignmentId);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editAssignment) {
      const assignment = (assignments as IAssignment[])
        .find(a => a.id === assignmentId) as IAssignment;

      setValue('questionBankId', assignment.questionBank);
    }

    getAllQuestionBanks(userId).then((data) => {
      setQuestionBanks(data.data);
    });
  }, []);

  const onSubmit = (data: any) => {
    setLoading(true);
    const request = {
      assignmentName: resourceName,
      attempts: +attempts,
      courseId: contextId,
      gameId: gameEnum.quiz,
      questionBankId: data.questionBankId,
      requiredAssignmentId: null,
      resourceId: resourceId,
      lineitemUrl: lineitemUrl
    };

    if (editAssignment) {
      request.id = assignmentId;
    }

    if (data.questionBankId == '') {
      request.questionBankId = questionBanks[0].id;
    }

    saveAssignment(request)
      .then(async (response) => {
        dispatch(
          assignmentSliceActions.saveAssignment({
            ...response.data
          })
        );
        dispatch(assignmentSliceActions.saveLinkedAssignment({
          linkedAssignmentId: response.data.id,
        }));
        void router.replace({ pathname: '/assignment' });

        notifications.show({ message: 'La tarea fue guardada exitosamente', autoClose: 3000 });
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red' }));
  };

  return (
    <>
      <Container size={1000}>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md' style={{ marginTop: 0 }}>
          <form onSubmit={handleSubmit(onSubmit, (errors) => console.table(errors))}>
            <Grid>
              <Grid.Col span={12}>
                <NativeSelect
                  name='questionBankId'
                  control={control}
                  data={[...questionBanks.map((a: any) => {
                    return { value: a.id, label: a.name };
                  })]}
                  label='Selecciona un banco'
                />
              </Grid.Col>

              <Grid.Col span={12} style={{ paddingTop: 0 }}>
                <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>

                  <Button loading={loading} type='submit' disabled={!isValid} variant='outline'>
                    {(editAssignment) ? 'Editar Tarea' : 'Crear Tarea'}
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>
      </Container>


    </>
  );
};

export default QuizCreator;
