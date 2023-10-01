import styles from './Stats.module.scss';
import Avatar from 'react-nice-avatar';

type LeaderboardItemProps = {
  index: number;
  name: string;
  value: number;
  avatarConfig: object;
}

const LeaderboardItem = ({ index, name, value, avatarConfig }: LeaderboardItemProps) => {
  return (
    <div className={styles.leaderboardItem}>
      <div className={styles.leaderboardItemIndex}>{index}</div>

      <div className={styles.avatar}><Avatar className={styles.avatarConfig}
        {...avatarConfig}
      /></div>
      <div className={styles.leaderboardItemName}>{name}</div>
      <div className={styles.leaderboardItemValue}>{value}</div>
    </div>
  );
};

export default LeaderboardItem;
