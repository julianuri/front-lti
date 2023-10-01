import { Button, Modal, Paper, Table, Tooltip } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { getAllQuestionBanks } from '../../service/QuestionBankService';
import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../redux/store';
import { IconPencil, IconPlaylistAdd, IconTrash, IconReportAnalytics, IconInfoCircle } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import { Carousel } from '@mantine/carousel';
import { getGames } from '../../service/GameService';
import IGame from '../../types/IGame';
import GameCard from './Creator/GameCard/GameCard';
import useAssignments from '../../hooks/useAssignments';
import { getGameName, stringToDate } from '../../utils/GenericUtils';
import { useDisclosure } from '@mantine/hooks';
import { dropAssignment } from '../../service/AssignmentService';
import GameEnum from '../../types/enums/GameEnum';
import MessageModal from '../Common/MessageModal/MessageModal';

const GamesWorkShop = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const { userId, contextId } = useSelector((state: RootState) => state.auth);
  const { linkedAssignmentId } = useSelector((state: RootState) => state.assignment);
  const [assignments, setAssignments] = useAssignments(userId, contextId);
  const [opened, { open, close }] = useDisclosure(false);
  const [areInstructionsOpen, instructions] = useDisclosure(false);
  const effectRan = useRef(false);
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    if (effectRan.current || process.env.NODE_ENV !== 'development') {
      Promise.all([getGames(), getAllQuestionBanks(userId)])
        .then(([gamesRS, questionBanksRS]) => {
          if (questionBanksRS.data.length === 0) {
            const newGames = gamesRS.data.filter((game: IGame) => game.id !== GameEnum.quiz && game.id !== GameEnum.snakes);
            setGames(newGames);
            notifications.show({
              message: 'Agrega un banco de preguntas para crear tareas con los juegos de "Quiz" y "Serpientes y Escaleras"',
              autoClose: 10000,
            });
          } else {
            setGames(gamesRS.data);
          }
        })
        .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  const deleteQuestion = function(id: number) {
    dropAssignment(id)
      .then(async () => {
        setAssignments([...assignments.filter(assignment => assignment.id !== id)]);
        dispatch(assignmentSliceActions.saveAssignments(
          [...assignments.filter(assignment => assignment.id !== id)]
          ),
        );

        if (+linkedAssignmentId === id) {
          dispatch(assignmentSliceActions.saveLinkedAssignment({
            linkedAssignmentId: 0,
          }));
        }
        notifications.show({ message: 'La tarea fue borrada exitosamente', autoClose: 2000,});
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
  };

  const getLinkedAssignmentName = function() {
    if (+linkedAssignmentId !== 0) {
      return assignments.find(a => a.id === +linkedAssignmentId)?.name;
    }
    return '';
  };

  const redirectToAssignmentCreation = function(gameId: number, assignmentId: number) {
    if (gameId === GameEnum.quiz) {
      void router.replace({pathname: '/assignment/create/quiz', query: {assignmentId}});
    } else if (gameId === GameEnum.hangman) {
        void router.replace({pathname: '/assignment/create/hangman', query: {assignmentId}});
    } else if (gameId === GameEnum.memory) {
      void router.replace({pathname: '/assignment/create/memory', query: {assignmentId}});
    } else if (gameId === GameEnum.snakes) {
      void router.replace({pathname: '/assignment/create/snakes', query: {assignmentId}});
    }
  };

  const redirectToAssignmentStats = function(assignmentId: number) {
    void router.replace({pathname: '/stats', query: {assignmentId}});
  };

  return <Paper style={{backgroundColor: 'white',
    gap: '2rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    textAlign: 'center'
  }}>

    <div style={{position: 'relative'}}>
    <Tooltip label={`Ya enlanzaste esta tarea de Canvas con ${getLinkedAssignmentName()}`}
             style={{display: (linkedAssignmentId === 0) ? 'none' : 'inherit' }}>
      <span>
      <Button
        onClick={() => open()}
        disabled={linkedAssignmentId !== 0}
        style={{
          width: '30%',
          alignSelf: 'center'
        }} leftIcon={<IconPlaylistAdd
        size={20}
        strokeWidth={1.5}
        color={(linkedAssignmentId === 0) ? '#407fbf' : 'grey'}
      />} variant='outline'>
        {'Agregar Tarea'}
      </Button>
        </span>
    </Tooltip>

    <IconInfoCircle
      size={24}
      strokeWidth={2}
      style={{position: 'absolute', color: 'rgb(34, 139, 230)', right: 0}}
      onClick={() => instructions.open()}
    />
    </div>

    {<MessageModal title={'Instrucciones'} message={
      <div style={{fontWeight: 'normal'}}>
        <p>Pulsa el botón de agregar tarea para vincular la tarea de canvas con alguno de los juegos.</p>
        <p>Tienes tres posibles acciones de interacción con una tarea vinculada:</p>
        <p>
        <IconReportAnalytics
          size={20}
          strokeWidth={2}
          color={'rgb(64, 127, 191)'}
        /> te permite acceder a las estadísticas asociadas a la tarea.</p>
        <p>
          <IconPencil
          size={20}
          strokeWidth={2}
          color={'rgb(64, 127, 191)'}
        /> te permite editar la tarea.</p>
        <p>
          <IconTrash
          size={20}
          strokeWidth={2}
          color={'#e81a27'}
        /> te permite desvincular la tarea.</p>
    </div>} isOpen={areInstructionsOpen} close={instructions.close}></MessageModal>}


    {(opened) ?
      <Modal opened={opened}
             onClose={close} title='Elige Juego' size={'50%'} styles={{title: { color: '#228be6', fontWeight: 'bold' }}}
      >
        <Carousel loop={true}>
          {games.map((game: IGame) => {
            return (
              <GameCard
                key={game.id}
                id={game.id}
                description={game.description}
                name={game.name}
                setGame={() => void router.replace(`/assignment/create/${game.name}`)}
                svgImage={game.svgRoute}
              />
            );
          })}
        </Carousel>
      </Modal> : null}

    <Table striped highlightOnHover withBorder withColumnBorders>
      <thead>
      <tr>
        <th style={{color: '#228be6', textAlign: 'center'}}>Nombre de la Tarea</th>
        <th style={{color: '#228be6', textAlign: 'center'}}>Fecha de Creación</th>
        <th style={{color: '#228be6', textAlign: 'center'}}>Juego</th>
        <th style={{color: '#228be6', textAlign: 'center'}}>Acciones</th>
      </tr>
      </thead>
      <tbody>{assignments.map((element) => (
        <tr key={element.id}>
          <td>{element.name}</td>
          <td>{stringToDate(element.registerDate)}</td>
          <td>{getGameName(element.gameId)}</td>
          <td style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
            <IconReportAnalytics
              style={{cursor: 'pointer'}}
              size={20}
              strokeWidth={2}
              color={'rgb(64, 127, 191)'}
              onClick={() => redirectToAssignmentStats(element.id)}
            />
            <IconPencil
              style={{cursor: 'pointer'}}
              size={20}
              strokeWidth={2}
              color={'rgb(64, 127, 191)'}
              onClick={() => redirectToAssignmentCreation(element.gameId, element.id)}
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

export default GamesWorkShop;
