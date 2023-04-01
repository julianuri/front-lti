interface QuestionForm {
  question: string
  answers: Option[]
  order: number
  answer: number

}

interface Option {
  option: string
}

export default QuestionForm;
