import { useEffect, useState } from "react";
import { getAssignmentStats } from "../../service/AssignmentService";
import { Histogram } from "./Histogram";
import Leaderboard from "./Leaderboard";
import styles from './Stats.module.scss';

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
      setLeaderboard(response['leaderboard']['data'].map((p) => ({name: p['user'], value: p['score__max']})))

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
    <div className={styles.stats}>
      <Leaderboard items={leaderboard} title="Leaderboard" />
      <Histogram
        title="Histograma de puntajes"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        data={scoreData}
        resolution={scoreDataResolution}
        domainMin={scoreDomainMin}
        domainMax={scoreDomainMax}
      />
      <Histogram
        title="Histograma de tiempo"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        data={timeData}
        resolution={timeDataResolution}
        domainMin={timeDomainMin}
        domainMax={timeDomainMax}
      />
      <Histogram
        title="Histograma de intentos"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        data={triesData}
        resolution={triesDataResolution}
        domainMin={triesDomainMin}
        domainMax={triesDomainMax}
      />
    </div>
  );
};

export default Stats;
