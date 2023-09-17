import { SubmitHandler, useForm } from 'react-hook-form';
import IHangmanQuestion from '../../../../types/props/IHangmanQuestion';
import { Button, Grid, Group, Paper } from '@mantine/core';
import { TextInput } from 'react-hook-form-mantine';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useEffect } from 'react';

interface HangmanFormProps {
  items: IHangmanQuestion[];
  setItems: (words: IHangmanQuestion[]) => void;
  closeModal: () => void;
  selectedItem: IHangmanQuestion | undefined;
}

interface HangmanFormValues {
  word: string
  clue: string
}

const HangmanForm = ({ items, setItems, closeModal, selectedItem }: HangmanFormProps) => {

  const schema = object().shape({
    word: string().required().matches(/^[a-zA-Z]+$/, 'La palabra solo puede tener letras'),
    clue: string().required()
  });

  const {
    control,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (selectedItem !== undefined) {
      setValue('word', selectedItem.wordToGuess);
      setValue('clue', selectedItem.clue);
    }
  }, [selectedItem]);


  const onSubmit: SubmitHandler<HangmanFormValues> = (data: HangmanFormValues) => {
    const newData = {
      wordToGuess: data.word.toUpperCase(),
      order: items.length,
      clue: data.clue
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

  return (
    <Paper p={30} mt={30} radius='md' style={{ marginTop: 0, padding: 0 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput maxLength={50} name='word' control={control} label='Palabra a Adivinar'
                       error={errors.word !== undefined ? 'Introduzca palabra' : null}
                         withAsterisk={errors.word !== undefined}/>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput maxLength={50} name='clue' control={control} label='Pista'
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
