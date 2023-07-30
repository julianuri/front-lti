import QuestionTypeEnum from './enums/QuestionTypeEnum';

interface ICard {
  id?: number,
  question: string;
  options: Array<{ option: string }>;
  type: QuestionTypeEnum
}

export default ICard;
