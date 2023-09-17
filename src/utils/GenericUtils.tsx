import GameEnum from '../types/enums/GameEnum';
import GamesNames from '../types/consts/GamesNames';
import MemoryTypesNames from '../types/consts/MemoryTypesNames';
import MemoryAnswerType from '../types/enums/MemoryAnswerType';

function stringToDate(date: string) {
  return new Date(date).toLocaleDateString(
    'es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
}

function getGameName(id: number) {
  return GamesNames[Object.values(GameEnum)[id - 1]];
}

function getMemoryAnswerTypeName(id: number) {
  console.table(Object.values(MemoryAnswerType)[id]);
  return MemoryTypesNames[Object.values(MemoryAnswerType)[id]];
}

async function createFile(url) {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type: 'image/png',
  };
  return new File([data], url.split('/').pop(), metadata);
}

export { stringToDate, getGameName, getMemoryAnswerTypeName, createFile };
