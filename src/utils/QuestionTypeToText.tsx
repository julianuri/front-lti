import QuestionTypeEnum from '../types/enums/QuestionTypeEnum';

const getQuestionTypeText = function(questionType: QuestionTypeEnum) {
  if (questionType === QuestionTypeEnum.SIMPLE) return 'Simple';
  else if (questionType === QuestionTypeEnum.MULTIPLE) return 'Multiple';
  else if (questionType === QuestionTypeEnum.TRUE_OR_FALSE) return 'Verdadero o Falso';
};

export default getQuestionTypeText;
