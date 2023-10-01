import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { saveMemoryAssignment } from '../../../../service/AssignmentService';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import IAssignment from '../../../../types/IAssignment';
import IMemoryMatch from '../../../../types/props/IMemoryMatch';
import MemoryForm from './MemoryForm';
import MemoryAnswerType from '../../../../types/enums/MemoryAnswerType';
import { notifications } from '@mantine/notifications';
import GameEnum from '../../../../types/enums/GameEnum';
import { useRouter } from 'next/router';
import { Button, Container, Divider, Grid, Group, Modal, Paper, Table } from '@mantine/core';
import { IconInfoCircle, IconPencil, IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import { createFile, getMemoryAnswerTypeName } from '../../../../utils/GenericUtils';
import { useDisclosure } from '@mantine/hooks';
import MessageModal from '../../../Common/MessageModal/MessageModal';

interface RouteAssignment {
  assignmentId: number | typeof NaN;
}

const MemoryCreator = ({ assignmentId }: RouteAssignment) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, resourceId, lineitemUrl, resourceName, attempts } = useSelector((state: RootState) => state.auth);

  const {
    handleSubmit,
    formState: { isValid },
    trigger
  } = useForm();
  const [items, setItems] = useState<IMemoryMatch[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const editAssignment = !Number.isNaN(assignmentId);
  const [selectedItem, setSelectedItem] = useState<IMemoryMatch>();
  const [areInstructionsOpen, instructions] = useDisclosure(false);

  useEffect(() => {
    if (editAssignment) {
      const assignment = (assignments as IAssignment[])
        .find(a => a.id === assignmentId) as IAssignment;

      const newMatches = [];
      const info = assignment.game_data[0].info.cards;
      const promises = [];
      for (let i = 0; i < info.length; i = i+2) {

        if (info[i + 1].type === MemoryAnswerType.IMAGE) {
          promises.push(createFile(info[i + 1].match));
          newMatches.push({id: info[i].id, 'firstMatch': info[i].match, 'secondMatch': info[i + 1].match,
            type: info[i + 1].type});

        } else {
          newMatches.push({id: info[i].id, 'firstMatch': info[i].match, 'secondMatch': info[i + 1].match,
            type: info[i + 1].type});
        }

      }

      if (promises.length > 0) {
        Promise.all(promises).then(results => {
          let counter = 0;
          newMatches.forEach(e => {
            if (e.type === MemoryAnswerType.IMAGE) {
              e.secondMatch = results[counter];
              counter++;
            }
          });
          setItems([...newMatches]);
          void trigger();

        });
      } else {
        setItems([...newMatches]);
        void trigger();
      }

    }
  }, []);

  const editQuestion = function(item: IMemoryMatch) {
    setSelectedItem(item);
    open();
  };

  const newQuestionHandler = function() {
    setSelectedItem(undefined);
    open();
  };

  const onSubmit = (data: any) => {
    setIsLoading(true);
    const formData = new FormData();

    items.forEach((item) => {
      if (item.type === MemoryAnswerType.IMAGE) {
        formData.append('files', item.secondMatch);
      }
    });

    if (editAssignment) {
      formData.append('id', assignmentId.toString());
    }

    formData.append('assignmentName', resourceName);
    formData.append('attempts', attempts);
    formData.append('courseId', contextId);
    formData.append('gameId', GameEnum.memory.toString());
    formData.append('resourceId', resourceId);
    formData.append('lineitemUrl', lineitemUrl);

    const newArray = items.map(({ secondMatch, ...keepAttrs }) => {
      if (keepAttrs.type === MemoryAnswerType.IMAGE) {
        return keepAttrs;
      } else {
        return { secondMatch, ...keepAttrs };
      }
    });

    formData.set('questions', JSON.stringify(newArray));

    saveMemoryAssignment(formData)
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
                  <p>Existen dos modalidades para una pareja de tarjetas.</p>
                  <p>Una pareja tipo texto se conforma por dos tarjetas con texto.</p>
                  <p>Una pareja tipo imagen se conforma por una tarjeta con texto vinculada a una imagen.</p>
                  <p>
                    <IconPencil
                      size={20}
                      strokeWidth={2}
                      color={'rgb(64, 127, 191)'}
                    /> te permite editar la pareja de tarjetas.</p>
                  <p>
                    <IconTrash
                      size={20}
                      strokeWidth={2}
                      color={'#e81a27'}
                    /> te permite eliminar pareja de tarjetas.</p>
                </div>} isOpen={areInstructionsOpen} close={instructions.close}></MessageModal>}

              <Grid.Col span={12}>
                <Container style={{ 'margin': '1rem 0', 'padding': 0 }}>
                  <Table striped highlightOnHover withBorder withColumnBorders style={{ textAlign: 'center' }}>
                    <thead>
                    <tr>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Concepto</th>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Tipo de Tarjeta</th>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>{items.map((element, index) => (
                      <tr key={index}>
                        <td>{element.firstMatch}</td>
                        <td>{getMemoryAnswerTypeName(element.type)}</td>
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

              <Grid.Col span={12} style={{paddingTop: 0}}>
                <Divider size='xs' />
                <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>

                  <Button disabled={items.length >= 12} leftIcon={<IconPlaylistAdd
                    size={20}
                    strokeWidth={1.5}
                    color={'#407fbf'}
                  />} variant='outline' onClick={newQuestionHandler}>
                    {'Agregar Pareja'}
                  </Button>
                  <Button loading={isLoading} type='submit' disabled={items.length < 2 || !isValid } variant='outline'>
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
             styles={{title: { color: '#228be6', fontWeight: 'bold' }}}
             title={(editQuestion) ? 'Modificar Pareja' : 'Agregar Pareja'}
             centered>
        {
          <MemoryForm
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

export default MemoryCreator;
