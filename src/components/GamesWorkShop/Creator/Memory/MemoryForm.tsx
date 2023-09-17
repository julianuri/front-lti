import { useForm } from 'react-hook-form';
import IMemoryMatch from '../../../../types/props/IMemoryMatch';
import { useEffect, useState } from 'react';
import MemoryAnswerType from '../../../../types/enums/MemoryAnswerType';
import { notifications } from '@mantine/notifications';
import { Button, Grid, Group, Paper, rem } from '@mantine/core';
import { FileInput, Radio, TextInput } from 'react-hook-form-mantine';
import { yupResolver } from '@hookform/resolvers/yup';
import {  mixed, number, object, string } from 'yup';
import { IconUpload } from '@tabler/icons-react';

interface MemoryFormProps {
  items: IMemoryMatch[];
  setItems: (words: any[]) => void;
  closeModal: () => void;
  selectedItem: IMemoryMatch | undefined;
}

const MemoryForm = ({ items, setItems, closeModal, selectedItem }: MemoryFormProps) => {

  const schema = {
    imageType: number(),
    concept: string().required(),
  };

  const [schemaConfig, setSchemaConfig] = useState(object().shape({
    ...schema
  }));

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm({
      mode: 'all',
      resolver: yupResolver(schemaConfig),
      defaultValues: {
        answerType: MemoryAnswerType.TEXT.toString(),
        concept: '',
        answer: '',
        fileInput: null,
      }
    }

  );

  useEffect(() => {
    if (selectedItem !== undefined) {
      setValue('concept', selectedItem.firstMatch);
      if (selectedItem.type === MemoryAnswerType.TEXT) {
        setValue('answer', selectedItem.secondMatch);
      } else {
        setValue('fileInput', selectedItem.secondMatch);
      }
      setValue('answerType', selectedItem.type.toString());
    }
  }, [selectedItem]);

  useEffect(() => {
    void trigger();
  }, [getValues('answerType')]);

  const changeAnswerType = function () {

    if (getValues('answerType') === MemoryAnswerType.TEXT.toString()) {

      setSchemaConfig(object({
        ...schema,
        answer: string().required(),
      }));
    } else {
      setSchemaConfig(object({
        ...schema,
        fileInput: mixed().test('fileSize', 'The file is too large', (value) => {
          if (!validFileSize(value)) {
            setValue('fileInput', null);
            notifications.show({  message: 'Imagen no debería pesar más de un mega', autoClose: 3000, color: 'red'});
            return null;
          }
          return validFileSize(value);
        }),
      }));
    }

  };

  const onSubmit = (data: any) => {
    const newData = {
      id: items.length,
      firstMatch: data.concept,
      secondMatch:
        data.answerType === MemoryAnswerType.TEXT.toString() ? data.answer : data.fileInput,
      fileName:
        data.answerType === MemoryAnswerType.IMAGE.toString() ? data.fileInput.name : null,
      type: +data.answerType,
    };

    if (selectedItem === undefined) {
      setItems([...items, { ...newData }]);
    } else {
      const index = items.findIndex(item => item.id === selectedItem.id);
      newData.id = index;
      const newItems = [...items.slice(0, index), {...newData}, ...items.slice(index + 1)];
      setItems([...newItems]);
    }

    closeModal();
  };

  const validFileSize = function (file: File) {
    return file.size <= 1_048_576;
  };

  return (
    <Paper p={30} mt={30} radius='md' style={{ marginTop: 0, padding: 0 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>

          <Grid.Col span={12}>
          <Radio.Group
            name="answerType"
            control={control}
            label="Llena los datos de la pareja"
            onChange={changeAnswerType}
          >
            <Group mt="xs">
              <Radio.Item value={MemoryAnswerType.TEXT.toString()} label="Texto" />
              <Radio.Item value={MemoryAnswerType.IMAGE.toString()} label="Imagen" />
            </Group>
          </Radio.Group>
        </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              maxLength={50}
              name='concept'
              control={control}
              label='Concepto'
              error={errors.concept !== undefined ? 'Introduzca concepto' : null}
              withAsterisk={errors.concept !== undefined} />
          </Grid.Col>

          {getValues('answerType') === MemoryAnswerType.TEXT.toString() ? (
            <Grid.Col span={12}>
              <TextInput
                maxLength={50}
                name='answer'
                control={control}
                label='Pareja'
                error={errors.answer !== undefined ? 'Introduzca pareja' : null}
                withAsterisk={errors.answer !== undefined} />
            </Grid.Col>
          ) : (
            <Grid.Col span={12}>
              <FileInput
                control={control}
                icon={<IconUpload size={rem(14)} color={'#228be6'} />}
                name={'fileInput'}
                placeholder='Elige Imagen'
                label='Imagen'
                error={errors.fileInput !== undefined ? 'Elige Imagen' : null}
                withAsterisk={errors.fileInput !== undefined}
              />
            </Grid.Col>
          )}

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

export default MemoryForm;
