interface IQuizQuestion {
  question: string
  options: Option[]
  order: number
  answer: number
}

interface Option {
  option: string
}

export default IQuizQuestion;
