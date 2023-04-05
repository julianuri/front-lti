import IQuestionProps from './IQuestionProps';

interface QuestionFormProps {
  questions: IQuestionProps[]
  setQuestions: (questions: IQuestionProps[]) => void
  setShowModal: (showModal: boolean) => void
}

export default QuestionFormProps;
