import { Paper } from '@mantine/core';
import { useRouter } from 'next/router';

const Student = () => {
  const router = useRouter();
  const {
    launchedGameId,
    attemptsLimitHasBeenReached,
    timeHasRunOut,
  } = router.query;

  const getMessage = function() {
    if (launchedGameId === undefined) {
      return 'Su profesor ha publicado una tarea sin configurar';
    } else if (timeHasRunOut !== undefined) {
      return 'El tiempo para realizar la tarea se ha acabado';
    }
    else if (attemptsLimitHasBeenReached !== undefined) {
      return 'Ha llegado al límite de intentos para la tarea';
    }
  };

  const message = getMessage();


  return (
    <Paper styles={{
      title: { color: '#228be6', fontWeight: 'bold' }
    }}
           style={{
             display: 'flex',
             minHeight: '100%',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '1rem',
             padding: '1rem',
             color: '#228be6',
             fontWeight: 'bold'
           }}>
      <p>{message}</p>
    </Paper>
  );
};

export default Student;
