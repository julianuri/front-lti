import Link from 'next/link';
import styles from './AvatarBuilder.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { avatarSliceActions, RootState } from '../../../redux/store';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import Avatar from 'react-nice-avatar';
import AvatarParts from '../../../types/enums/AvatarParts';
import { saveAvatarConfig } from '../../../service/AvatarService';
import { notifications } from '@mantine/notifications';

const AvatarBuilder = () => {
  const dispatch = useDispatch();
  const hairStyle = useRef([
    { name: 'normal', avatarName: 'normal' },
    { name: 'long', avatarName: 'womanLong' },
    { name: 'short', avatarName: 'womanShort' },
  ]);

  const shirtStyles = useRef(['hoody', 'short', 'polo']);
  const eyeStyles = useRef(['circle', 'oval', 'smile']);
  const hatStyles = useRef(['none', 'beanie', 'turban']);
  const glassesStyles = useRef(['none', 'round', 'square']);
  const mouthStyles = useRef(['laugh', 'smile', 'peace']);
  const earSizes = useRef(['small', 'big']);
  const noseStyles = useRef(['short', 'long', 'round']);

  const { userId } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { avatarConfig } = useSelector(
    (state: RootState) => state.avatarConfig,
  );
  const [avatarEditor, setAvatarEditor] = useState(avatarConfig);

  const onSubmit = (data: any) => {
    console.table(data);

    saveAvatarConfig(data, userId)
      .then(() => {
        dispatch(avatarSliceActions.saveConfig(data));
        notifications.show({ message: 'Tu avatar ha sido modificado', autoClose: false, });
      })
      .catch((error) => notifications.show({ message:error.message, autoClose: false, color: 'red'}));
  };

  useEffect(() => {
    reset({ ...avatarConfig });
  }, []);

  const modifyAvatar = (e: any, key: string) => {
    const aux = { ...avatarEditor };
    aux[key] = e;
    setAvatarEditor(aux);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Avatar
          style={{ width: '12rem', height: '12rem', gridColumn: '1/4' }}
          {...avatarEditor}
        />

        <div className={styles.field}>
          <label>Hair Style</label>
          <select
            {...register(AvatarParts.HAIR_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.HAIR_STYLE);
              },
            })}
          >
            {hairStyle.current.map((a: any) => {
              return (
                <option key={a.name} value={a.avatarName}>
                  {a.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Eyebrow Style</label>
          <select
            {...register(AvatarParts.EYEBROW_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.EYEBROW_STYLE);
              },
            })}
          >
            {[
              { name: 'normal', value: 'up' },
              { name: 'stylized', value: 'upWoman' },
            ].map((a: any) => {
              return (
                <option key={a.name} value={a.value}>
                  {a.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Shirt Style</label>
          <select
            {...register(AvatarParts.SHIRT_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.SHIRT_STYLE);
              },
            })}
          >
            {shirtStyles.current.map((a: any) => {
              return (
                <option className={styles.option} key={a} value={a}>
                  {a}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Nose Style</label>
          <select
            {...register(AvatarParts.NOSE_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.NOSE_STYLE);
              },
            })}
          >
            {noseStyles.current.map((a: string) => {
              return (
                <option className={styles.option} key={a} value={a}>
                  {a}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Hat Style</label>
          <select
            {...register(AvatarParts.HAT_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.HAT_STYLE);
              },
            })}
          >
            {hatStyles.current.map((a: string) => {
              return (
                <option key={a} value={a}>
                  {a}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Glasses Style</label>
          <select
            {...register(AvatarParts.GLASSES_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.GLASSES_STYLE);
              },
            })}
          >
            {glassesStyles.current.map((a: string) => {
              return (
                <option key={a} value={a}>
                  {a}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor={AvatarParts.EYE_STYLE}>Eye Style</label>
          <select
            id={AvatarParts.EYE_STYLE}
            {...register(AvatarParts.EYE_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.EYE_STYLE);
              },
            })}
          >
            {eyeStyles.current.map((item: string) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Ear Size</label>
          <select
            {...register(AvatarParts.EAR_SIZE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.EAR_SIZE);
              },
            })}
          >
            {earSizes.current.map((a: string) => {
              return (
                <option className={styles.option} key={a} value={a}>
                  {a}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Mouth Style</label>
          <select
            {...register(AvatarParts.MOUTH_STYLE, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.MOUTH_STYLE);
              },
            })}
          >
            {mouthStyles.current.map((a: string) => {
              return (
                <option key={a} value={a}>
                  {a}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Hat Color</label>
          <input
            type="color"
            {...register(AvatarParts.HAT_COLOR, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.HAT_COLOR);
              },
            })}
          />
        </div>

        <div className={styles.field}>
          <label>Hair Color</label>
          <input
            type="color"
            {...register(AvatarParts.HAIR_COLOR, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.HAIR_COLOR);
              },
            })}
          />
        </div>

        <div className={styles.field}>
          <label>Shirt Color</label>
          <input
            type="color"
            {...register(AvatarParts.SHIRT_COLOR, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.SHIRT_COLOR);
              },
            })}
          />
        </div>

        <div className={styles.field}>
          <label>Face Color</label>
          <input
            type="color"
            {...register(AvatarParts.FACE_COLOR, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.FACE_COLOR);
              },
            })}
          />
        </div>

        <div className={styles.field}>
          <label>Background Color</label>
          <input
            type="color"
            {...register(AvatarParts.BG_COLOR, {
              onChange: (e) => {
                modifyAvatar(e.target.value, AvatarParts.BG_COLOR);
              },
            })}
          />
        </div>

        <input
          className={styles.button + ' ' + styles.atTheEnd}
          value="Save Avatar"
          type="submit"
        />
      </form>
      <Link className={styles.button} href="/student">
        back
      </Link>
    </div>
  );
};

export default AvatarBuilder;
