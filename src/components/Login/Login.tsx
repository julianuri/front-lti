import { SubmitHandler, useForm } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../redux/store';
import { registerUser, verifyUserCredentials } from '../../service/AuthService';
import { AuthState } from '../../features/auth/authSlice';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { Box, Button, Paper, Popover, Progress, Text } from '@mantine/core';
import { PasswordInput, TextInput } from 'react-hook-form-mantine';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [popoverOpened, setPopoverOpened] = useState(false);

  const [strength, setStrength] = useState(0);
  const [color, setColor] = useState('red');

  const schema = object().shape({
    email: string().required().email(),
    password: string().required()
  });
  const {
    control,
    getValues,
    formState: { errors, isValid }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const requirements = [
    { re: /[0-9]/, label: 'Incluye un número' },
    { re: /[a-z]/, label: 'Incluye una minúscula' },
    { re: /[A-Z]/, label: 'Incluye una mayúscula' },
    { re: /^.{6,}$/, label: 'Incluye al menos 6 caracteres' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Incluye un carácter especial' }
  ];

  const passwordRequirement = function() {
    return requirements.map((requirement, index) => {
      return <Text
        key={index}
        color={requirement.re.test(getValues('password')) ? 'teal' : 'red'}
        sx={{ display: 'flex', alignItems: 'center' }}
        mt={7}
        size='sm'
      >
        {requirement.re.test(getValues('password')) ? <IconCheck size='0.9rem' /> : <IconX size='0.9rem' />} <Box
        ml={10}>{requirement.label}</Box>
      </Text>;
    });
  };

  const [checks, setChecks] = useState<any>(passwordRequirement());

  function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }

  const logInUser: SubmitHandler<UserForm> = (data) => {
    verifyUserCredentials(data)
      .then(async (response) => {
        if (!response.ok) {
          const message = `Un error con estado: ${response.status} ha ocurrido`;
          throw new Error(message);
        }
        const data: AuthState = await response.json();
        dispatch(
          authSliceActions.saveLoginInfo({
            isLoggedIn: true,
            userId: data.userId,
            role: 'ADMIN'
          })
        );

        router.replace('lti-config').then(() => {
          notifications.show({ message: 'Inicio de sesión exitoso', autoClose: 3000 });
        });
      })
      .catch((error) => {
        if (error.message.includes('403')) {
          notifications.show({ message: 'Credenciales Incorrectas', autoClose: false, color: 'red' });
        } else {
          notifications.show({ message: error.message, autoClose: false, color: 'red' });
        }
      });
  };

  const registerU: SubmitHandler<UserForm> = (data) => {
    registerUser(data)
      .then(async (response: AuthState) => {
        dispatch(
          authSliceActions.saveLoginInfo({
            isLoggedIn: true,
            userId: response.id,
            role: 'ADMIN'
          })
        );

        void router.push('lti-config').then(() => {
          notifications.show({ message: 'Usuario Registrado' });
        });
      })
      .catch((error) => {
        notifications.show({ message: 'No se pudo registrar el usuario', autoClose: false, color: 'red' });
      });
  };

  const checkPassword = function() {
    setChecks(passwordRequirement());
    const newStrength = getStrength(getValues('password'));
    setStrength(newStrength);
    setColor(newStrength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red');
  };


  return (
    <Paper style={{
      top: '50%',
      left: '50%',
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      width: '30rem',
      padding: '1rem',
      margin: '1rem'
    }}>

      <TextInput
        style={{ padding: '1rem' }}
        maxLength={80}
        placeholder='Ej: amo.protocolo.lti@gmail.com'
        control={control}
        name='email'
        label='Email'
        error={errors.email !== undefined ? 'Introduzca email' : null}
        withAsterisk={errors.email !== undefined} />

      <Popover opened={popoverOpened} position='bottom' width='target' transitionProps={{ transition: 'pop' }}>
        <Popover.Target>
          <div
            onFocusCapture={() => setPopoverOpened(true)}
            onBlurCapture={() => setPopoverOpened(false)}
          >
            <PasswordInput
              style={{ padding: '1rem' }}
              control={control}
              name={'password'}
              label='Contraseña'
              onChange={checkPassword}
              error={errors.password !== undefined ? 'Introduzca contraseña' : null}
              withAsterisk={errors.password !== undefined}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress color={color} value={strength} size={5} mb='xs' />
          {checks}
        </Popover.Dropdown>
      </Popover>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button disabled={!isValid || color != 'teal'}
                onClick={() => logInUser({ password: getValues('password'), email: getValues('email') })}
                style={{ margin: '1rem' }}>Iniciar Sesión</Button>
        <Button disabled={!isValid || color != 'teal'}
                onClick={() => registerU({ password: getValues('password'), email: getValues('email') })}
                style={{ margin: '1rem' }}>Registrar</Button>
      </div>
    </Paper>
  );
};

export default LoginForm;
