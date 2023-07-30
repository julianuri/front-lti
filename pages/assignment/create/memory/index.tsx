import GameEnum from '../../../../src/types/enums/GameEnum';
import MemoryCreator from '../../../../src/components/GamesWorkShop/Creator/Memory/MemoryCreator';

function CreateQuizPage() {

  return <MemoryCreator gameId={GameEnum.memory}/>;
}

export default CreateQuizPage;
