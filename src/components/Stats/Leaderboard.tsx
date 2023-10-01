import LeaderboardItem from './LeaderboardItem';
import styles from './Stats.module.scss';

type LeaderboardItem = {
  name: string;
  value: number;
}

type LeaderboardProps = {
  items: LeaderboardItem[];
  title?: string;
}

const Leaderboard = ({ items, title }: LeaderboardProps) => {
  const itemsDoms = items.map((item, i) =>
    <LeaderboardItem key={i} index={i + 1} name={item.name} value={item.value} avatarConfig={item.avatar}/>);

  return (
    <div className={styles.leaderboard}>
      <div className={styles.statsSubTitle}>
        {title}
      </div>
      <div className={styles.leaderboardContent}>
        {itemsDoms}
      </div>
    </div>
  );
};

export default Leaderboard;
