import ICard from '../../../../types/ICard';
import LoadingSpinner from '../../../Common/Spinner/Spinner';
import styles from './Card.module.scss';
import QuestionTypeEnum from '../../../../types/enums/QuestionTypeEnum';
import { useState } from 'react';
import { Checkbox, Radio, Switch } from 'react-hook-form-mantine';
import { Button, Card as MantineCard, Container, Grid } from '@mantine/core';
import { boolean, object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface CardProps {
  currentQuestion: ICard;
  handleQuizAnswer?: (answer: number | boolean | boolean[]) => void;
  handleSnakeAnswer?: (id: number, answer: number | boolean | boolean[]) => void;
  totalQuestions?: number;
  questionOrder?: number;
}

export default function Card(props: CardProps) {

  const showCard = props.currentQuestion !== undefined;
  const [checkedIndex, setCheckedIndex] = useState<number>(-1);
  const [disableButton, setDisableButton] = useState(true);

  const [schemaConfig, setSchemaConfig] = useState(object().shape({}));
  const cardStyle = (props.handleSnakeAnswer === undefined) ? styles['question-card'] : styles['question-card'] + ' ' + styles['snake-card'];

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isValid }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaConfig),
    defaultValues: {
      option0: false,
      option1: false,
      option2: false,
      option3: false,
      radio: ''
    }
  });

  const checkBoxChange = (index: any) => {
    checkButtonValidity();
    if (!index.checked) {
      setCheckedIndex(-1);
    } else {
      setCheckedIndex(Number(index.value));
    }
  };


  const checkButtonValidity = function(): void {
    if (props.currentQuestion.type === QuestionTypeEnum.SIMPLE || props.currentQuestion.type === QuestionTypeEnum.MULTIPLE) {
      setDisableButton(!isValid || (!getValues('option0') && !getValues('option1') && !getValues('option2') &&
        !getValues('option3')));
    } else {
      setDisableButton(!isValid);
    }
  };

  useState(() => {
    checkButtonValidity();
  }, []);

  const onSubmit = function(data: any) {
    reset();
    setDisableButton(true);
    let answer: any = '';
    if (props.currentQuestion.type === QuestionTypeEnum.SIMPLE) {
      answer = checkedIndex;
    } else if (props.currentQuestion.type === QuestionTypeEnum.MULTIPLE) {
      answer = [data.option0, data.option1, data.option2, data.option3];
    } else {
      answer = data.radio === 'V';
    }

    if (props.currentQuestion.id === undefined && props.handleQuizAnswer !== undefined) {
      props.handleQuizAnswer(answer);
    } else if(props.currentQuestion.id !== undefined&& props.handleSnakeAnswer !== undefined) {
      props.handleSnakeAnswer(props.currentQuestion.id, answer);
    }
  };


  const getCard = function() {
    switch (props.currentQuestion.type) {
    case QuestionTypeEnum.SIMPLE:
      return (
        <>
          <Grid.Col span={12} style={{ display: 'flex', flexDirection: 'column', marginLeft: '5rem', gap: '1rem' }}>
            {props.currentQuestion.options.map(
              (answerOption: { option: string }, index) => (
                <Checkbox styles={{ label: { color: 'white', '&:([data-disabled])': { color: 'red' } } }}
                          key={answerOption.option} name={`option${index}`}
                          control={control}
                          disabled={checkedIndex != -1 && checkedIndex != index}
                          value={index}
                          onChange={(e) => checkBoxChange(e.target)}
                          label={answerOption.option}
                          labelPosition='right' />


              )
            )}
          </Grid.Col>
          <Grid.Col span={12}>
            <Button type={'submit'} disabled={disableButton}>Avanzar</Button>
          </Grid.Col>
        </>);
    case QuestionTypeEnum.MULTIPLE:

      return (

        <>
          <Grid.Col span={12} style={{ display: 'flex', flexDirection: 'column', marginLeft: '5rem', gap: '1rem' }}>
            {props.currentQuestion.options.map(
              (answerOption: { option: string }, index) => (
                <Checkbox styles={{ label: { color: 'white', '&:([data-disabled])': { color: 'red' } } }}
                          labelPosition={'right'} key={answerOption.option} name={`option${index}`}
                          control={control}
                          label={answerOption.option}
                          onChange={() => checkButtonValidity()}
                />


              )
            )}
          </Grid.Col>
          <Grid.Col span={12}>
            <Button type={'submit'} disabled={disableButton}>Avanzar</Button>
          </Grid.Col>
        </>);
    case QuestionTypeEnum.TRUE_OR_FALSE:
      return (
        <>
          <Grid.Col span={12} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>


            <Radio.Group onChange={() => checkButtonValidity()} name={'radio'} control={control}
                         style={{ display: 'flex', gap: '1rem' }}>
              <Radio.Item styles={{ label: { color: 'white' } }} value={'V'} label={'Verdadero'} />
              <Radio.Item styles={{ label: { color: 'white' } }} value={'F'} label={'Falso'} />
            </Radio.Group>

          </Grid.Col>

          <Grid.Col span={12}>
            <Button type={'submit'} disabled={disableButton}>Avanzar</Button>
          </Grid.Col>
        </>);
    }
  };

  /*<Switch value={false} styles={{label: {color: 'white'}}} labelPosition={'right'} name={'checkbox'} control={control}
                    label={'Falso'} onChange={() => checkButtonValidity()}/>
            <Switch value={true} styles={{label: {color: 'white'}}} labelPosition={'right'} name={'checkbox'} control={control}
                    label={'Verdadero'} onChange={() => checkButtonValidity()}/>*/

  const card = getCard();

  return (
    <div>
      {showCard ? (
        <Container size={1000}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <Grid className={cardStyle}>
              <Grid.Col span={12}>
                <div className={styles.questionSection}>
                  { (props?.totalQuestions !== undefined && props?.questionOrder !== undefined) ?
                    (<div className={styles.questionCount}>
                      <span>
                        Pregunta{' '}
                        {props.questionOrder + 1 > props.totalQuestions
                          ? props.totalQuestions
                          : props.questionOrder + 1}
                      </span>
                            / {props.totalQuestions}
                    </div>) : null}
                    <div className={styles.questionText}>
                      {props.currentQuestion.question}
                    </div>
                </div>
              </Grid.Col>
              {card}
            </Grid>
          </form>
        </Container>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
