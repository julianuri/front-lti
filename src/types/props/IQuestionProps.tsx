interface IQuestionProps {
  question: string
  options: Option[]
  order: number
  answer: number
}

interface Option {
  option: string
}

export default IQuestionProps;
