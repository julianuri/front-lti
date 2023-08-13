import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Button, Container, Grid, Group, Paper } from '@mantine/core';
import { NativeSelect, NumberInput, TextInput } from 'react-hook-form-mantine';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import IAssignment from '../../../../types/IAssignment';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import { saveAssignment } from '../../../../service/AssignmentService';
import { getAllQuestionBanks } from '../../../../service/QuestionBankService';
import { notifications } from '@mantine/notifications';
import gameEnum from '../../../../types/enums/GameEnum';
import { useRouter } from 'next/router';
import useDifferentAssignments from '../../../../hooks/useDifferentAssignments';

interface RouteAssignment {
  assignmentId: number | typeof NaN;
}

const QuizCreator = ({ assignmentId }: RouteAssignment) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, userId, resourceId, lineitemUrl } = useSelector((state: RootState) => state.auth);
  const [questionBanks, setQuestionBanks] = useState([]);
  const editAssignment = !Number.isNaN(assignmentId);

  const schema = object().shape({
    assignmentName: string().required(),
    attempts: number().min(1).max(20),
    requiredAssignmentId: string()
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      assignmentName: '',
      attempts: 1,
      requiredAssignmentId: '',
      questionBankId: ''
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const transformedAssignments = useDifferentAssignments(assignments, editAssignment, assignmentId);

  useEffect(() => {
    if (editAssignment) {
      const assignment = (assignments as IAssignment[])
        .find(a => a.id === assignmentId) as IAssignment;

      setValue('assignmentName', assignment.name);
      setValue('attempts', assignment.attempts);
      setValue('requiredAssignmentId', assignment.requiredAssignment);
      setValue('questionBankId', assignment.questionBank);
    }

    getAllQuestionBanks(userId).then((data) => {
      setQuestionBanks(data.data);
    });
  }, []);

  const onSubmit = (data: any) => {
    setLoading(true);
    const request = {
      assignmentName: data.assignmentName,
      attempts: data.attempts,
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

    if (data.requiredAssignmentId != '') {
      request.requiredAssignmentId = data.requiredAssignmentId;
    }


    saveAssignment(request)
      .then(async (response) => {
        dispatch(
          assignmentSliceActions.saveAssignment({
            ...response.data
          })
        );
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

              <Grid.Col span={4}>
                <TextInput
                  maxLength={50}
                  name='assignmentName'
                  control={control}
                  label='Nombre de la Tarea'
                  error={errors.assignmentName !== undefined ? 'Introduzca nombre' : null}
                  withAsterisk={errors.assignmentName !== undefined} />
              </Grid.Col>

              <Grid.Col span={2}>
                <NumberInput
                  name='attempts'
                  control={control}
                  min={1}
                  max={20}
                  label='Intentos'
                  error={errors.attempts !== undefined ? 'Introduzca número válido' : null}
                  withAsterisk={errors.attempts !== undefined}
                />
              </Grid.Col>

              <Grid.Col span={3}>
                <NativeSelect
                  name='requiredAssignmentId'
                  control={control}
                  data={[{ value: '', label: 'No seleccionada' }, ...transformedAssignments]}
                  label='Tarea asociada'
                />
              </Grid.Col>

              <Grid.Col span={3}>
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
