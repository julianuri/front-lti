import styles from './HangmanForm.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import IHangmanQuestion from '../../../../types/props/IHangmanQuestion';
import { Button, Grid, Group, Paper } from '@mantine/core';
import { TextInput } from 'react-hook-form-mantine';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

interface HangmanFormProps {
  items: IHangmanQuestion[];
  setItems: (words: IHangmanQuestion[]) => void;
  closeModal: () => void;
}

interface HangmanFormValues {
  word: string
  clue: string
}

const HangmanForm = ({ items, setItems, closeModal }: HangmanFormProps) => {

  const schema = object().shape({
    word: string().required(),
    clue: string().required()
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm(
    {
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
        word: '',
        clue: ''
      }
    }
  );

  const onSubmit: SubmitHandler<HangmanFormValues> = (data: HangmanFormValues) => {
    const newData = {
      wordToGuess: data.word.toUpperCase(),
      order: items.length,
      clue: data.clue
    };

    setItems([...items, { ...newData }]);
  };

  return (
    <Paper p={30} mt={30} radius='md' style={{ marginTop: 0, padding: 0 }}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput name='word' control={control} label='Palabra a Adivinar'
                       error={errors.word !== undefined ? 'Introduzca palabra' : null}
                         withAsterisk={errors.word !== undefined}/>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput name='clue' control={control} label='Pista'
                       error={errors.clue !== undefined ? 'Introduzca pista' : null}
                       withAsterisk={errors.clue !== undefined}/>
          </Grid.Col>
          <Grid.Col span={12}>
            <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>
              <Button type='submit' disabled={!isValid} variant='outline' onClick={closeModal}>Agregar</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Paper>
  );
};

export default HangmanForm;
