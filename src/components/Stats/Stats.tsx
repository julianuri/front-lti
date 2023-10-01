import { useEffect, useState } from 'react';
import { getAssignmentStats } from '../../service/AssignmentService';
import { Histogram } from './Histogram';
import Leaderboard from './Leaderboard';
import styles from './Stats.module.scss';
import { Divider, Paper } from '@mantine/core';

type StatsProps = {
  assignmentId: number;
}

const GRAPH_HEIGHT = 400;
const GRAPH_WIDTH = GRAPH_HEIGHT * 1;

const Stats = ({assignmentId}: StatsProps) => {
  const [leaderboard, setLeaderboard] = useState([]);

  const [scoreData, setScoreData] = useState([]);
  const [scoreDataResolution, setScoreDataResolution] = useState(1);
  const [scoreDomainMin, setScoreDomainMin] = useState(0);
  const [scoreDomainMax, setScoreDomainMax] = useState(100);

  const [timeData, setTimeData] = useState([]);
  const [timeDataResolution, setTimeDataResolution] = useState(1);
  const [timeDomainMin, setTimeDomainMin] = useState(0);
  const [timeDomainMax, setTimeDomainMax] = useState(100);

  const [triesData, setTriesData] = useState([]);
  const [triesDataResolution, setTriesDataResolution] = useState(1);
  const [triesDomainMin, setTriesDomainMin] = useState(0);
  const [triesDomainMax, setTriesDomainMax] = useState(5);

  useEffect(() => {
    console.log(assignmentId, typeof assignmentId);
    if (typeof assignmentId === 'undefined' || Number.isNaN(assignmentId)) {
      return;
    }

    getAssignmentStats(assignmentId).then((response) => {
      setLeaderboard(response['leaderboard']['data'].map((p) => ({
        name: p['user__name'],
        value: p['score__max'],
        avatar: p['avatar_config']})));

      // Score histogram
      setScoreData(response['score_histogram']['raw']);
      setScoreDataResolution(response['score_histogram']['resolution']);
      setScoreDomainMin(response['score_histogram']['x_min']);
      setScoreDomainMax(response['score_histogram']['x_max'] + response['score_histogram']['resolution']);

      // Time histogram
      setTimeData(response['time_histogram']['raw']);
      setTimeDataResolution(response['time_histogram']['resolution']);
      setTimeDomainMin(response['time_histogram']['x_min']);
      setTimeDomainMax(response['time_histogram']['x_max'] + response['time_histogram']['resolution']);      

      // Tries histogram
      setTriesData(response['tries_histogram']['raw']);
      setTriesDataResolution(response['tries_histogram']['resolution']);
      setTriesDomainMin(response['tries_histogram']['x_min']);
      setTriesDomainMax(response['tries_histogram']['x_max'] + response['tries_histogram']['resolution']);      
    });
  }, [assignmentId]);

  return (
    <Paper className={styles.stats}>
      <Leaderboard items={leaderboard} title='Tabla Clasificatoria' />
      <Divider size={'xs'} className={styles.divider} />
      <Histogram
        title='Histograma de puntajes'
        description={'Cantidad de estudiantes que han obtenido puntajes dentro de cada rango'}
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        data={scoreData}
        resolution={scoreDataResolution}
        domainMin={scoreDomainMin}
        domainMax={scoreDomainMax}
        xLabel='Puntos'
        yLabel='Cantidad de estudiantes'
      />
      <Divider size={'xs'} className={styles.divider} />
      <Histogram
        title='Histograma de tiempo'
        description={'Cantidad de estudiantes que han finalizado la actividad agrupados por minutos'}
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        data={timeData}
        resolution={timeDataResolution}
        domainMin={timeDomainMin}
        domainMax={timeDomainMax}
        xLabel='Minutos'
        yLabel='Cantidad de estudiantes'
      />
      <Divider size={'xs'} className={styles.divider} />
      <Histogram
        title='Histograma de intentos'
        description={'Cantidad de estudiantes agrupados por numero de intentos realizados'}
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        data={triesData}
        resolution={triesDataResolution}
        domainMin={triesDomainMin}
        domainMax={triesDomainMax}
        xLabel='Intentos'
        yLabel='Cantidad de estudiantes'
      />
    </Paper>
  );
};

export default Stats;
