import styles from './Stats.module.scss';

type LeaderboardItemProps = {
  index: number;
  name: string;
  value: number;
}

const LeaderboardItem = ({ index, name, value }: LeaderboardItemProps) => {
  return (
    <div className={styles.leaderboardItem}>
      <div className={styles.leaderboardItemIndex}>{index}</div>
      <div className={styles.leaderboardItemName}>{name}</div>
      <div className={styles.leaderboardItemValue}>{value}</div>
    </div>
  );
};

export default LeaderboardItem;
