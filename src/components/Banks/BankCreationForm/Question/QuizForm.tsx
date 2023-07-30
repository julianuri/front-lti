import styles from './QuizForm.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { boolean, object, string, ValidationError } from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import IQuizQuestion from '../../../../types/props/IQuizQuestion';
import { Button, Grid, Group, Paper } from '@mantine/core';
import { Checkbox, Radio, Switch, TextInput } from 'react-hook-form-mantine';
import QuestionTypeEnum from '../../../../types/enums/QuestionTypeEnum';

type QuestionFormProps = {
  items: IQuizQuestion[];
  setItems: (questions: IQuizQuestion[]) => void;
  closeModal: () => void;
  selectedItem?: IQuizQuestion
};

const QuizForm = ({ items, setItems, closeModal, selectedItem }: QuestionFormProps) => {

  const [checkedIndex, setCheckedIndex] = useState<number>(-1);
  const [questionType, setQuestionType] = useState<string>(QuestionTypeEnum.SIMPLE);
  const shouldTrigger = useRef(false);

  const schema = {
    question: string().required(),
    firstOption: string().required(),
    secondOption: string().required(),
    thirdOption: string().required(),
    fourthOption: string().required(),
    type: string().required(),
  };

  const [schemaConfig, setSchemaConfig] = useState(object().shape({
    ...schema
  }));

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaConfig),
    defaultValues: {
      question: '',
      firstOption: '',
      switch: false,
      secondOption: '',
      thirdOption: '',
      fourthOption: '',
      firstMultiple: false,
      secondMultiple: false,
      thirdMultiple: false,
      fourthMultiple: false,
      type: QuestionTypeEnum.SIMPLE,
      checkbox: false,
    }
  });


  useEffect(() => {
    if (selectedItem !== undefined) {
      setQuestionType(selectedItem.type);
      setValue('type', selectedItem.type);
      setValue('question', selectedItem.question);
      switch (selectedItem.type) {
      case QuestionTypeEnum.SIMPLE:
        setValue('firstOption', selectedItem.options[0].option);
        setValue('secondOption', selectedItem.options[1].option);
        setValue('thirdOption', selectedItem.options[2].option);
        setValue('fourthOption', selectedItem.options[3].option);
        setValue('checkbox', true);
        setCheckedIndex(selectedItem.answer as number);
        break;
      case  QuestionTypeEnum.MULTIPLE:
        setValue('firstOption', selectedItem.options[0].option);
        setValue('secondOption', selectedItem.options[1].option);
        setValue('thirdOption', selectedItem.options[2].option);
        setValue('fourthOption', selectedItem.options[3].option);
        setValue('firstMultiple', (selectedItem.answer as boolean[])[0]);
        setValue('secondMultiple', (selectedItem.answer as boolean[])[1]);
        setValue('thirdMultiple', (selectedItem.answer as boolean[])[2]);
        setValue('fourthMultiple', (selectedItem.answer as boolean[])[3]);
        break;

      case QuestionTypeEnum.TRUE_OR_FALSE:
        setValue('switch', selectedItem.answer as boolean);
        break;
      }
    }
  }, [selectedItem]);

  const onSubmit = (data: any) => {
    let answer: any = '';

    switch (data.type) {
    case QuestionTypeEnum.SIMPLE:
      answer = checkedIndex;
      break;
    case QuestionTypeEnum.MULTIPLE:
      answer = [getValues('firstMultiple'), getValues('secondMultiple'), getValues('thirdMultiple'), getValues('fourthMultiple')];
      break;
    case QuestionTypeEnum.TRUE_OR_FALSE:
      answer = data.switch;
      break;
    }

    const newData = {
      question: data.question,
      options: [
        { option: data.firstOption },
        { option: data.secondOption },
        { option: data.thirdOption },
        { option: data.fourthOption }
      ],
      order: items.length,
      answer: answer,
      type: data.type
    };

    if (selectedItem === undefined) {
      setItems([...items, { ...newData }]);
    } else {
      const index = items.findIndex(item => item.id === selectedItem.id);
      newData.order = index;
      const newItems = [...items.slice(0, index), {...newData}, ...items.slice(index + 1)];
      setItems([...newItems]);
    }

  };

  const checkBoxChange = (index: any) => {
    if (!index.checked) {
      setCheckedIndex(-1);
    } else {
      setCheckedIndex(Number(index.value));
    }
  };

  useEffect(() => {
    if (shouldTrigger.current) {
      void trigger();
    }
  }, [schemaConfig]);

  const changeQuestionType = function(question: string) {
    setQuestionType(question);
    shouldTrigger.current = true;
    switch (question) {
    case QuestionTypeEnum.SIMPLE:
      setSchemaConfig(object({
        ...schema
      }));
      break;
    case QuestionTypeEnum.MULTIPLE:
      setSchemaConfig(object({
        ...schema,
        firstMultiple: boolean(),
        secondMultiple: boolean(),
        thirdMultiple: boolean(),
        fourthMultiple: boolean(),
      }).test(
        'myCustomTest',
        null,
        (obj) => {
          if ( obj.firstMultiple || obj.secondMultiple || obj.thirdMultiple || obj.fourthMultiple ) {
            return true; // everything is fine
          }

          return new ValidationError(
            'Please check one checkbox',
            null,
            'myCustomFieldName'
          );
        }
      ));
      break;
    case QuestionTypeEnum.TRUE_OR_FALSE:
      setSchemaConfig(object().shape({
        question: string().required(),
      }));
      break;
    }

  };

  const disableButton = function(): boolean {
    if (questionType === QuestionTypeEnum.SIMPLE) {
      return !isValid || !getValues('checkbox');
    } else if (questionType === QuestionTypeEnum.MULTIPLE) {
      return !isValid || (!getValues('firstMultiple') && !getValues('secondMultiple') && !getValues('thirdMultiple') &&
        !getValues('fourthMultiple'));
    } else {
      return !isValid;
    }
  };

  return (
    <Paper style={{height: '25rem', marginTop: 0, padding: 0 }} p={30} mt={30} radius='md'>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput name='question' control={control} label='Pregunta'
                       error={errors.question !== undefined ? 'Introduzca pregunta' : null}
                       withAsterisk={errors.question !== undefined}/>
          </Grid.Col>

          <Radio.Group
            style={{margin: '1rem auto'}}
            onChange={(e) => changeQuestionType(e)}
            name="type"
            control={control}
            label="Elige el tipo de pregunta"
          >
            <Group>
              <Radio.Item value={QuestionTypeEnum.SIMPLE} label="Selección Simple" />
              <Radio.Item value={QuestionTypeEnum.MULTIPLE} label="Selección Multiple" />
              <Radio.Item value={QuestionTypeEnum.TRUE_OR_FALSE} label="V/F" />
            </Group>
          </Radio.Group>

          { questionType === QuestionTypeEnum.TRUE_OR_FALSE ? <Switch
            name={'switch'}
            control={control}
            style={{margin: 'auto'}}
            label="¿Es verdadero?"
          /> : null}


          { questionType === QuestionTypeEnum.SIMPLE ? (<>
            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='firstOption' control={control} label='Primera Opción'
                           error={errors.firstOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.firstOption !== undefined} />
                <Checkbox name={'checkbox'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={0}
                          disabled={checkedIndex != -1 && checkedIndex != 0}
                          labelPosition='left' onChange={(e) => checkBoxChange(e.target)} />
              </Group>
            </Grid.Col>
            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='secondOption' control={control} label='Segunda Opción'
                           error={errors.secondOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.secondOption !== undefined}/>
                <Checkbox name={'checkbox'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={1}
                          disabled={checkedIndex != -1 && checkedIndex != 1}
                          labelPosition='left' onChange={(e) => checkBoxChange(e.target)} />
              </Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='thirdOption' control={control} label='Tercera Opción'
                           error={errors.thirdOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.thirdOption !== undefined}/>
                <Checkbox name={'checkbox'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={2}
                          disabled={checkedIndex != -1 && checkedIndex != 2}
                          labelPosition='left' onChange={(e) => checkBoxChange(e.target)} />
              </Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='fourthOption' control={control} label='Cuarta Opción'
                           error={errors.fourthOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.fourthOption !== undefined}/>
                <Checkbox name={'checkbox'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={3}
                          disabled={checkedIndex != -1 && checkedIndex != 3}
                          labelPosition='left' onChange={(e) => checkBoxChange(e.target)} />
              </Group>
            </Grid.Col></>) : null}


          { questionType === QuestionTypeEnum.MULTIPLE ? (<>
            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='firstOption' control={control} label='Primera Opción'
                           error={errors.firstOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.firstOption !== undefined} />
                <Checkbox name={'firstMultiple'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={0}
                          labelPosition='left'  />
              </Group>
            </Grid.Col>
            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='secondOption' control={control} label='Segunda Opción'
                           error={errors.secondOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.secondOption !== undefined}/>
                <Checkbox name={'secondMultiple'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={1}
                          labelPosition='left'  />
              </Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='thirdOption' control={control} label='Tercera Opción'
                           error={errors.thirdOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.thirdOption !== undefined}/>
                <Checkbox name={'thirdMultiple'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={2}
                          labelPosition='left'  />
              </Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Group style={{flexWrap: 'nowrap'}}>
                <TextInput name='fourthOption' control={control} label='Cuarta Opción'
                           error={errors.fourthOption !== undefined ? 'Introduzca opción' : null}
                           withAsterisk={errors.fourthOption !== undefined}/>
                <Checkbox name={'fourthMultiple'} style={{alignSelf: 'flex-end'}}
                          control={control}
                          value={3}
                          labelPosition='left' />
              </Group>
            </Grid.Col></>) : null}

          <Grid.Col span={12}>
            <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>
              <Button type='submit' disabled={disableButton()} variant='outline' onClick={closeModal}>
                Agregar
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Paper>);
};

export default QuizForm;
