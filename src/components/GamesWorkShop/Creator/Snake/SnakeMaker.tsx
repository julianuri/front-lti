import { useEffect, useState } from 'react';
import { getAllQuestionBanks } from '../../../../service/QuestionBankService';
import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import { useForm } from 'react-hook-form';
import { saveAssignment } from '../../../../service/AssignmentService';
import BOARDS from '../../../../types/consts/BoardsEnum';
import { Carousel } from '@mantine/carousel';
import { notifications } from '@mantine/notifications';
import { number, object, string } from 'yup';
import GameEnum from '../../../../types/enums/GameEnum';
import { Button, Container, Divider, Grid, Group, Paper, Image } from '@mantine/core';
import { NativeSelect, NumberInput, TextInput } from 'react-hook-form-mantine';
import useDifferentAssignments from '../../../../hooks/useDifferentAssignments';
import { yupResolver } from '@hookform/resolvers/yup';
import IAssignment from '../../../../types/IAssignment';
import { useRouter } from 'next/router';

interface RouteAssignment {
  assignmentId: number | typeof NaN;
}

const SnakeMaker = function({ assignmentId }: RouteAssignment) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId } = useSelector((state: RootState) => state.auth);
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, resourceId, lineitemUrl } = useSelector((state: RootState) => state.auth);
  const [questionBanks, setQuestionBanks] = useState([]);
  const schema = object().shape({
    assignmentName: string().required(),
    attempts: number().min(1).max(20),
    rolls: number().min(5).max(30),
    requiredAssignmentId: string()
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm(
    {
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
        assignmentName: '',
        attempts: 1,
        rolls: 10,
        requiredAssignmentId: '',
        questionBankId: ''
      }
    }
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCarouselItem, setSelectedCarouselItem] = useState(0);
  const editAssignment = !Number.isNaN(assignmentId);
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
      gameId: GameEnum.snakes,
      requiredAssignmentId: null,
      questionBankId: data.questionBankId,
      rollsToShowQuestion: data.rolls,
      board: selectedCarouselItem,
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

  const handleClick = function(id: number) {
    setSelectedCarouselItem(id);
  };

  return (
    <Container size={1200}>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md' style={{ marginTop: 0 }}>
        <form onSubmit={handleSubmit(onSubmit, (errors) => console.table(errors))}>
          <Grid>

            <Grid.Col span={3}>
              <TextInput
                maxLength={50}
                name='assignmentName'
                control={control}
                label='Nombre de la tarea'
                error={errors.assignmentName !== undefined ? 'Introduzca nombre' : null}
                withAsterisk={errors.assignmentName !== undefined} />
            </Grid.Col>

            <Grid.Col span={1}>
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

            <Grid.Col span={2}>
              <NumberInput
                name='rolls'
                control={control}
                min={1}
                max={20}
                label='Frecuencia'
                error={errors.rolls !== undefined ? 'Introduzca número válido' : null}
                withAsterisk={errors.rolls !== undefined}
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

            <Grid.Col span={12}>
              <Divider size='xs' />
              <Container style={{ 'margin': '1rem 0', 'padding': 0 }}>
                <Carousel maw={320} mx='auto' withIndicators height={320}>

                  {BOARDS.map(board => {
                    return (<Carousel.Slide key={board.id} onClick={() => handleClick(board.id)}>
                      <Image src={board.image} />
                    </Carousel.Slide>);
                  })}

                </Carousel>

              </Container>
              <Divider size='xs' />
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
  );
};

export default SnakeMaker;
