import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { saveAssignment } from '../../../../service/AssignmentService';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import IAssignment from '../../../../types/IAssignment';
import IHangmanQuestion from '../../../../types/props/IHangmanQuestion';
import { Button, Container, Divider, Grid, Group, Modal, Paper, Table } from '@mantine/core';
import { IconInfoCircle, IconPencil, IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import GameEnum from '../../../../types/enums/GameEnum';
import { notifications } from '@mantine/notifications';
import HangmanForm from './HangmanForm';
import { useRouter } from 'next/router';
import MessageModal from '../../../Common/MessageModal/MessageModal';

interface RouteAssignment {
  assignmentId: number | typeof NaN;
}

const HangmanCreator = ({ assignmentId }: RouteAssignment) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, resourceId, lineitemUrl, resourceName, attempts } = useSelector((state: RootState) => state.auth);
  const editAssignment = !Number.isNaN(assignmentId);
  const [areInstructionsOpen, instructions] = useDisclosure(false);

  const {
    handleSubmit,
    formState: { isValid },
    trigger
  } = useForm();

  const [items, setItems] = useState<IHangmanQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IHangmanQuestion>();

  useEffect(() => {
    if (editAssignment) {
      const assignment = (assignments as IAssignment[])
        .find(a => a.id === assignmentId) as IAssignment;
      setItems(assignment.game_data.map(g => {
          return {
            id: g.info.id, wordToGuess: g.info.word_to_guess, clue: g.info.clue, order: g.info.order
          };
        }
      ));
      void trigger();
    }
  }, []);

  const onSubmit = (data: any) => {
    setLoading(true);
    const request = {
      assignmentName: resourceName,
      attempts: +attempts,
      questions: [...items],
      courseId: contextId,
      gameId: GameEnum.hangman,
      requiredAssignmentId: null,
      resourceId: resourceId,
      lineitemUrl: lineitemUrl
    };

    if (editAssignment) {
      request.id = assignmentId;
    }

    saveAssignment(request)
      .then(async (response) => {
        dispatch(
          assignmentSliceActions.saveAssignment({
            ...response.data
          })
        );
        dispatch(assignmentSliceActions.saveLinkedAssignment({
          linkedAssignmentId: response.data.id
        }));
        void router.replace({ pathname: '/assignment' });
        notifications.show({ message: 'La tarea fue guardada exitosamente', autoClose: 3000 });
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red' }));
  };

  const deleteItem = (index: number) => {
    const newItems = (items as never[]).filter(
      (q: unknown, i: number) => i != index
    );
    setItems([...newItems]);
  };

  const editQuestion = function(item: IHangmanQuestion) {
    setSelectedItem(item);
    open();
  };

  const newQuestionHandler = function() {
    setSelectedItem(undefined);
    open();
  };

  return (
    <>
      <Container size={1000}>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md' style={{ marginTop: 0 }}>
          <form onSubmit={handleSubmit(onSubmit, (errors) => console.table(errors))}>
            <Grid>
              <Grid.Col span={12}>
                <div style={{position: 'relative'}}>
                  <IconInfoCircle
                    size={24}
                    strokeWidth={2}
                    style={{ position: 'absolute', color: 'rgb(34, 139, 230)', right: 0, top: 0 }}
                    onClick={() => instructions.open()}
                  />
                </div>
              </Grid.Col>

              {<MessageModal title={'Instrucciones'} message={
                <div style={{fontWeight: 'normal'}}>
                  <p>Introduce la palabra a adivinar junto a una pista para el
                  estudiante. Solo se permiten carácteres del alfabeto Español.</p>
                  <p>
                    <IconPencil
                      size={20}
                      strokeWidth={2}
                      color={'rgb(64, 127, 191)'}
                    /> te permite editar la palabra.</p>
                  <p>
                    <IconTrash
                      size={20}
                      strokeWidth={2}
                      color={'#e81a27'}
                    /> te permite eliminar la palabra.</p>
                </div>} isOpen={areInstructionsOpen} close={instructions.close}></MessageModal>}

              <Grid.Col span={12}>
                <Container style={{ 'margin': '1rem 0', 'padding': 0 }}>
                  <Table striped highlightOnHover withBorder withColumnBorders style={{ textAlign: 'center' }}>
                    <thead>
                    <tr>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Palabra a Adivinar</th>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Pista</th>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>{items.map((element, index) => (
                      <tr key={index}>
                        <td>{element.wordToGuess}</td>
                        <td>{element.clue}</td>
                        <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <IconPencil
                            style={{ cursor: 'pointer' }}
                            size={20}
                            strokeWidth={2}
                            color={'rgb(64, 127, 191)'}
                            onClick={() => editQuestion(element)}
                          />
                          <IconTrash
                            style={{ cursor: 'pointer' }}
                            size={20}
                            strokeWidth={2}
                            color={'#e81a27'}
                            onClick={() => deleteItem(index)}
                          />
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>

                </Container>
              </Grid.Col>


              <Grid.Col span={12} style={{ paddingTop: 0 }}>
                <Divider size='xs' />
                <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>

                  <Button leftIcon={<IconPlaylistAdd
                    size={20}
                    strokeWidth={1.5}
                    color={'#407fbf'}
                  />} variant='outline' onClick={newQuestionHandler}>
                    {'Agregar Palabra'}
                  </Button>
                  <Button loading={loading} type='submit' disabled={items.length == 0 || !isValid} variant='outline'>
                    {(editAssignment) ? 'Editar Tarea' : 'Crear Tarea'}
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Modal opened={opened}
             onClose={close}
             styles={{ title: { color: '#228be6', fontWeight: 'bold' } }}
             title={(editQuestion) ? 'Modificar Palabra' : 'Agregar Palabra'}
             centered>
        {
          <HangmanForm
            items={items}
            setItems={setItems}
            closeModal={close}
            selectedItem={selectedItem}
          />
        }
      </Modal>

    </>
  );
};

export default HangmanCreator;
