import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import styles from './HangmanForm.module.scss';
import { saveAssignment } from '../../../../service/AssignmentService';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import IAssignment from '../../../../types/IAssignment';
import IHangmanQuestion from '../../../../types/props/IHangmanQuestion';
import { Button, Card, CloseButton, Container, Divider, Flex, Grid, Group, Modal, Paper } from '@mantine/core';
import { NativeSelect, NumberInput, TextInput } from 'react-hook-form-mantine';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import GameEnum from '../../../../types/enums/GameEnum';
import { notifications } from '@mantine/notifications';
import HangmanForm from './HangmanForm';

const HangmanCreator = () => {

  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, resourceId, lineitemUrl  } = useSelector((state: RootState) => state.auth);

  const schema = object().shape({
    assignmentName: string().required(),
    attempts: number().min(1).max(20),
    requiredAssignmentId: string(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      assignmentName: '',
      attempts: 1,
      requiredAssignmentId: '',
    }
  });

  const [items, setItems] = useState<IHangmanQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const transformedAssignments = assignments.map((a: IAssignment) =>  { return {value: a.id, label: a.name};});
  const onSubmit = (data: any) => {
    setLoading(true);
    const request = {
      assignmentName: data.assignmentName,
      attempts: data.attempts,
      questions: [...items],
      courseId: contextId,
      gameId: GameEnum.hangman,
      requiredAssignmentId: null,
      resourceId: resourceId,
      lineitemUrl: lineitemUrl,
    };

    if (data.requiredAssignmentId != '') {
      request.requiredAssignmentId = data.requiredAssignmentId;
    }

   saveAssignment(request)
      .then(async (response) => {
        dispatch(
          assignmentSliceActions.saveAssignment({
            id: response.data.id,
            name: response.data.name,
            gameId: response.data.gameId
          })
        );
        setLoading(false);
        setItems([]);
        reset();
        notifications.show({message: 'La tarea fue guardada exitosamente', autoClose: 3000});
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
  };

  const deleteItem = (index: number) => {
    const newItems = (items as never[]).filter(
      (q: unknown, i: number) => i != index
    );
    setItems([...newItems]);
  };

  return (
    <>
      <Container size={1000}>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md' style={{ marginTop: 0 }}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit, (errors)=> console.table(errors))}>
            <Grid>

              <Grid.Col span={5}>
                <TextInput
                  name='assignmentName'
                  control={control}
                  label='Nombre de la Tarea'
                  error={errors.assignmentName !== undefined ? 'Introduzca nombre' : null}
                  withAsterisk={errors.assignmentName !== undefined}/>
              </Grid.Col>

              <Grid.Col span={3}>
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

              <Grid.Col span={4}>
                <NativeSelect
                  name='requiredAssignmentId'
                  control={control}
                  data={[{value: '' , label: 'No seleccionada'}, ...transformedAssignments]}
                  label='Tarea asociada'
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Divider size='xs' />
                <Container style={{ 'margin': '1rem 0', 'padding': 0 }}>
                  <Flex
                    mih={'10rem'}
                    bg='rgb(149 217 212 / 30%)'
                    gap='md'
                    justify='flex-start'
                    align='flex-start'
                    direction='row'
                    wrap='wrap'
                    style={{ 'justifyContent': 'center', 'alignItems': 'center' }}
                  >
                    {items.map((item, id) =>
                      <Card style={{position: 'relative', minWidth: '8rem', textAlign: 'center', color: '#228be6'}} shadow="sm" key={item.wordToGuess}>
                        <CloseButton style={{position: 'absolute', padding: 0, right: 0, top: 0, color: 'rgb(64, 127, 191)'}} iconSize={18} onClick={() => deleteItem(id)} aria-label="Close modal" />
                        {item.wordToGuess}
                      </Card>
                    )}
                  </Flex>
                </Container>
              </Grid.Col>


              <Grid.Col span={12} style={{paddingTop: 0}}>
                <Divider size='xs' />
                <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>

                  <Button leftIcon={<IconPlaylistAdd
                    size={20}
                    strokeWidth={1.5}
                    color={'#407fbf'}
                  />} variant='outline' onClick={open}>
                    {'Agregar Palabra'}
                  </Button>

                  <Button loading={loading} type='submit' disabled={items.length == 0 || !isValid } variant='outline'>
                    Crear Tarea
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Modal opened={opened}
             onClose={close}
             title={'Agregar Palabra'}
             centered>
        {
          <HangmanForm
          items={items}
          setItems={setItems}
          closeModal={close}
          />
        }
      </Modal>

    </>
  );
};

export default HangmanCreator;
