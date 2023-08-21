import styles from './AvatarBuilder.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { avatarSliceActions, RootState } from '../../../redux/store';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import Avatar from 'react-nice-avatar';
import AvatarParts from '../../../types/consts/AvatarParts';
import { saveAvatarConfig } from '../../../service/AvatarService';
import { notifications } from '@mantine/notifications';
import { Button, Grid, Paper } from '@mantine/core';
import { NativeSelect } from 'react-hook-form-mantine';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const AvatarBuilder = () => {
  const dispatch = useDispatch();
  const hairStyle = useRef([
    { name: 'Normal', value: 'normal' },
    { name: 'Largo', value: 'womanLong' },
    { name: 'Corto', value: 'womanShort' }
  ]);

  const shirtStyles = useRef([
    { name: 'Cuello', value: 'hoody' },
    { name: 'Corta', value: 'short' },
    { name: 'Polo', value: 'polo' }]);

  const eyeStyles = useRef([
    {name: 'Circulares', value: 'circle'},
    {name: 'Ovalados', value: 'oval'},
    {name: 'Entreabiertos', value: 'smile'}]);

  const hatStyles = useRef( [
    {name: 'Sin Sombrero', value: 'none'},
    {name: 'Gorro', value: 'beanie'},
    {name: 'Turbante', value: 'turban'}]);

  const glassesStyles = useRef([
    {name: 'Sin lentes', value: 'none'},
    {name: 'Redondos', value: 'round'},
    {name: 'Cuadrados', value: 'square'}]);
  const mouthStyles = useRef([
    {name: 'Sonrisa abierta', value: 'laugh'},
    {name: 'Sonrisa pequeña', value: 'smile'},
    {name: 'Sonrisa grande', value: 'peace'}]);

  const earSizes = useRef( [
    {name: 'Pequeñas', value: 'small'},
    {name: 'Grandes', value: 'big'}]);
  const noseStyles = useRef([
    {name: 'Corta', value: 'short'},
    {name: 'Normal', value: 'long'},
    {name: 'Redonda', value: 'round'}]);

  const { userId } = useSelector((state: RootState) => state.auth);

  const schema = object().shape({
    hairStyle: string(),
    eyeBrowStyle: string(),
    shirtStyle: string(),
    eyeStyle: string(),
    hatStyle: string(),
    glassesStyle: string(),
    mouthStyle: string(),
    earSize: string(),
    noseStyle: string(),
    shirtColor: string(),
    hairColor: string(),
    faceColor: string(),
    bgColor: string(),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      hairStyle: '',
      eyeBrowStyle: '',
      shirtStyle: '',
      eyeStyle: '',
      hatStyle: '',
      glassesStyle: '',
      mouthStyle: '',
      earSize: '',
      noseStyle: '',
      shirtColor: '',
      hairColor: '',
      faceColor: '',
      hatColor: '',
      bgColor: '',
    }
  });

  const { avatarConfig } = useSelector(
    (state: RootState) => state.avatarConfig
  );
  const [avatarEditor, setAvatarEditor] = useState(avatarConfig);

  const onSubmit = (data: any) => {
    const request = {sex: 'woman', ...data};
    saveAvatarConfig(request, userId)
      .then(() => {
        dispatch(avatarSliceActions.saveConfig(request));
        notifications.show({ message: 'Tu avatar ha sido modificado' });
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red' }));

  };

  useEffect(() => {
    setValue('hairStyle', avatarConfig.hairStyle);
    setValue('eyeBrowStyle', avatarConfig.eyeBrowStyle);
    setValue('shirtStyle', avatarConfig.shirtStyle);

    setValue('eyeStyle', avatarConfig.eyeStyle);
    setValue('hatStyle', avatarConfig.hatStyle);
    setValue('glassesStyle', avatarConfig.glassesStyle);
    setValue('mouthStyle', avatarConfig.mouthStyle);
    setValue('earSize', avatarConfig.earSize);
    setValue('noseStyle', avatarConfig.noseStyle);
    setValue('shirtColor', avatarConfig.shirtColor);

    setValue('hatColor', avatarConfig.hatColor);
    setValue('hairColor', avatarConfig.hairColor);
    setValue('faceColor', avatarConfig.faceColor);
    setValue('bgColor', avatarConfig.bgColor);
  }, []);

  const modifyAvatar = (e: any, key: string) => {
    console.log(e);
    const aux = { ...avatarEditor };
    aux[key] = e;
    setAvatarEditor(aux);
  };

  return (
    <Paper style={{minHeight: '100%', padding: '1rem' }}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Grid style={{gap: '1rem'}} align={'center'} justify={'center'}>

          <Grid.Col style={{
            display: 'flex',
            justifyContent: 'center'
          }} span={12}>
            <Avatar
              style={{ width: '10rem', height: '10rem', gridColumn: '1/4' }}
              {...avatarEditor}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='hairStyle'
                          control={control}
                          data={[...hairStyle.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Cabello'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.HAIR_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='eyeBrowStyle'
                          control={control}
                          data={[
                            { name: 'Normales', value: 'up' },
                            { name: 'Estilizadas', value: 'upWoman' }
                          ].map((a: any) => {
                            return { value: a.value, label: a.name };
                          })}
                          label='Pestañas'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.EYEBROW_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='shirtStyle'
                          control={control}
                          data={[...shirtStyles.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Camisa'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.SHIRT_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='noseStyle'
                          control={control}
                          data={[...noseStyles.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Nariz'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.NOSE_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='glassesStyle'
                          control={control}
                          data={[...glassesStyles.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Lentes'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.GLASSES_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='eyeStyle'
                          control={control}
                          data={[...eyeStyles.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Ojos'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.EYE_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='earSize'
                          control={control}
                          data={[...earSizes.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Orejas'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.EAR_SIZE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2}>
            <NativeSelect name='mouthStyle'
                          control={control}
                          data={[...mouthStyles.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Boca'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.MOUTH_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>


          <Grid.Col span={2}>
            <NativeSelect name='hatStyle'
                          control={control}
                          data={[...hatStyles.current.map((a: any) => {
                            return { value: a.value, label: a.name };
                          })]}
                          label='Sombrero'
                          onChange={(e) => {
                            modifyAvatar(e.target.value, AvatarParts.HAT_STYLE);
                          }}>
            </NativeSelect>
          </Grid.Col>

          <Grid.Col span={2} />


          <Grid.Col style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}} span={2}>
            <label>Color sombrero</label>
            <input
              type="color"
              {...register(AvatarParts.HAT_COLOR, {
                onChange: (e) => {
                  modifyAvatar(e.target.value, AvatarParts.HAT_COLOR);
                },
              })}
            />
          </Grid.Col>

          <Grid.Col style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}} span={2}>
            <label>Color cabello</label>
            <input
              type='color'
              {...register(AvatarParts.HAIR_COLOR, {
                onChange: (e) => {
                  modifyAvatar(e.target.value, AvatarParts.HAIR_COLOR);
                }
              })}
            />
          </Grid.Col>

          <Grid.Col style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}} span={2}>
            <label>Color camisa</label>
            <input
              type='color'
              {...register(AvatarParts.SHIRT_COLOR, {
                onChange: (e) => {
                  modifyAvatar(e.target.value, AvatarParts.SHIRT_COLOR);
                }
              })}
            />
          </Grid.Col>

          <Grid.Col style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}} span={2}>
            <label>Color cara</label>
            <input
              type='color'
              {...register(AvatarParts.FACE_COLOR, {
                onChange: (e) => {
                  modifyAvatar(e.target.value, AvatarParts.FACE_COLOR);
                }
              })}
            />
          </Grid.Col>

          <Grid.Col style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}} span={2}>
            <label>Color fondo</label>
            <input
              type='color'
              {...register(AvatarParts.BG_COLOR, {
                onChange: (e) => {
                  modifyAvatar(e.target.value, AvatarParts.BG_COLOR);
                }
              })}
            />
          </Grid.Col>

          <Grid.Col style={{
            display: 'flex',
            justifyContent: 'center'
          }} span={12}>
            <Button
              type='submit'
            >
              Guardar
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </Paper>
  );
};

export default AvatarBuilder;
