import QuestionTypeEnum from '../enums/QuestionTypeEnum';

interface ISnakeQuestion {
  id: number;
  options: { option: string }[];
  question: string;
}

export default ISnakeQuestion;
