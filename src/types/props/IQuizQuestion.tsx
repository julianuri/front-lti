import QuestionTypeEnum from '../enums/QuestionTypeEnum';

interface IQuizQuestion {
  id?: number,
  question: string;
  options: Option[];
  order: number;
  answer: number | boolean | boolean[];
  type: QuestionTypeEnum
}

interface Option {
  option: string;
}

export default IQuizQuestion;
