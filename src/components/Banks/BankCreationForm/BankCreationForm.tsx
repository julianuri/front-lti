import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { RootState } from '../../../redux/store';
import IQuizQuestion from '../../../types/props/IQuizQuestion';
import { Button, Container, Divider, Grid, Group, Modal, Paper, Table } from '@mantine/core';
import { TextInput } from 'react-hook-form-mantine';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconPencil, IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import QuizForm from './Question/QuizForm';
import { getBankQuestions, saveQuestionBank } from '../../../service/QuestionBankService';
import getQuestionTypeText from '../../../utils/QuestionTypeToText';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';


type SaveQuestionBankRQ = {
  id?: number,
  bankName: string,
  questions: IQuizQuestion[],
  userId: string,
}

const BankCreationForm = ({ bankId, bankName }: { bankId: string | undefined, bankName: string | undefined }) => {

  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { userId } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<IQuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IQuizQuestion>();

  const schema = object().shape({
    bankName: string().required()
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      bankName: ''
    }
  });

  useEffect(() => {
    if (bankId !== undefined && bankName !== undefined) {
      getBankQuestions(+bankId).then((response) => {
        setValue('bankName', bankName);
        void trigger();
        setItems([...response.data]);
      }).catch((error) => {
        notifications.show({ message: error.message, autoClose: false, color: 'red'});
      });
    }
  }, []);

  const editQuestion = function(item: IQuizQuestion) {
    setSelectedItem(item);
    open();
  };

  const newQuestionHandler = function() {
    setSelectedItem(undefined);
    open();
  };

  const onSubmit = (data: any) => {
    setLoading(true);
    const request: SaveQuestionBankRQ = {
      bankName: data.bankName,
      questions: [...items],
      userId: userId
    };

    if (bankId !== undefined) {
      request.id = +bankId;
    }

    saveQuestionBank(request)
      .then(async () => {
        void router.push('/banks');
        notifications.show({ message: '¡Banco guardado!', });
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
          <form onSubmit={handleSubmit(onSubmit, (errors) => console.table(errors))}>
            <Grid>

              <Grid.Col span={12}>
                <TextInput
                  maxLength={50}
                  name='bankName'
                  control={control}
                  label='Nombre del Banco'
                  error={errors.bankName !== undefined ? 'Introduzca nombre' : null}
                  withAsterisk={errors.bankName !== undefined} />
              </Grid.Col>

              <Grid.Col span={12}>
                <Divider size='xs' />
                <Container style={{ 'margin': '1rem 0', 'padding': 0 }}>
                  <Table striped highlightOnHover withBorder withColumnBorders style={{ textAlign: 'center' }}>
                    <thead>
                    <tr>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Pregunta</th>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Tipo</th>
                      <th style={{ color: '#228be6', textAlign: 'center' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>{items.map((element, index) => (
                      <tr key={index}>
                        <td>{element.question}</td>
                        <td>{getQuestionTypeText(element.type)}</td>
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
                    {'Agregar Pregunta'}
                  </Button>

                  <Button loading={loading} type='submit' disabled={items.length == 0 || !isValid} variant='outline'>
                    {(bankId !== undefined) ? 'Modificar Banco' : 'Crear Banco'}
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
             title={(bankId !== undefined) ? 'Modificar Pregunta' : 'Agregar Pregunta'}
             centered>

        <QuizForm
          items={items}
          setItems={setItems}
          closeModal={close}
          selectedItem={selectedItem}
        />
      </Modal>

    </>
  );
};

export default BankCreationForm;
