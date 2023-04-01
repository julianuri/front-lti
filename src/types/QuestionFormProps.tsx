import Question from './Question';

interface QuestionFormProps {
  questions: Question[]
  setQuestions: (questions: Question[]) => Function
  setShowModal: (showModal: boolean) => Function
}

export default QuestionFormProps;
