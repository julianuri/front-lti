import GameEnum from '../../../../src/types/enums/GameEnum';
import SnakeMaker from '../../../../src/components/GamesWorkShop/Creator/Snake/SnakeMaker';

function CreateQuizPage() {

  return <SnakeMaker gameId={GameEnum.snake}/>;
}

export default CreateQuizPage;
