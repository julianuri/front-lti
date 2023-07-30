import { Button, Paper, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import { dropBank, getAllQuestionBanks } from '../../service/QuestionBankService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IconPencil, IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';

interface QuestionBank {
  id: number,
  name: string;
  created_at: string;
  updated_at: string;
}


const QuestionBanks = () => {

  const router = useRouter();
  const { userId } = useSelector((state: RootState) => state.auth);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);

  useEffect(() => {
    getAllQuestionBanks(userId).then((response) => {
      const banks = response.data.map((bank: QuestionBank) => {
        const newBank = {...bank};
        newBank.created_at = new Date(bank.created_at).toLocaleDateString(
          'es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
        newBank.updated_at = new Date(bank.updated_at).toLocaleDateString(
          'es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

        return newBank;
        }
      );
      setQuestionBanks(banks);
    });
  }, []);

  const deleteQuestion = function(id: number) {
    dropBank(id)
      .then(async () => {
        setQuestionBanks([...questionBanks.filter(bank => bank.id !== id)]);
        notifications.show({ message: 'El banco fue borrado exitosamente', autoClose: false});
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
  };

  return <Paper style={{backgroundColor: 'white',
    gap: '2rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    textAlign: 'center'
  }}>
    <Button
      onClick={() => router.replace('/banks/create')}
      style={{
      width: '25%',
      alignSelf: 'end'
    }} leftIcon={<IconPlaylistAdd
      size={20}
      strokeWidth={1.5}
      color={'#407fbf'}
    />} variant='outline'>
      {'Agregar Banco'}
    </Button>

  <Table striped highlightOnHover withBorder withColumnBorders>
    <thead>
    <tr>
      <th style={{color: '#228be6', textAlign: 'center'}}>Nombre del Banco</th>
      <th style={{color: '#228be6', textAlign: 'center'}}>Fecha de Creación</th>
      <th style={{color: '#228be6', textAlign: 'center'}}>Fecha de Actualización</th>
      <th style={{color: '#228be6', textAlign: 'center'}}>Acciones</th>
    </tr>
    </thead>
    <tbody>{questionBanks.map((element) => (
      <tr key={element.id}>
        <td>{element.name}</td>
        <td>{element.created_at}</td>
        <td>{element.updated_at}</td>
        <td style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
          <IconPencil
            style={{cursor: 'pointer'}}
            size={20}
            strokeWidth={2}
            color={'rgb(64, 127, 191)'}
            onClick={() => void router.replace({pathname: '/banks/create', query: {bankId: element.id, bankName: element.name}})}
          />
          <IconTrash
            style={{cursor: 'pointer'}}
            size={20}
            strokeWidth={2}
            color={'#e81a27'}
            onClick={() => deleteQuestion(element.id)}
          />
        </td>
      </tr>
    ))}</tbody>
  </Table>
  </Paper>;
};

export default QuestionBanks;
