import { useEffect, useState } from 'react';
import styles from './LtiConfig.module.scss';
import { useForm } from 'react-hook-form';
import {
  getAdminConfig,
  updateAdminConfig
} from '../../service/AdminConfigService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { notifications } from '@mantine/notifications';
import {
  ActionIcon,
  Button,
  Container,
  CopyButton,
  Divider,
  Grid,
  Group,
  Paper,
  Tooltip,
  MultiSelect as MantineMS,
  Anchor, Textarea
} from '@mantine/core';
import { JsonInput, MultiSelect, TextInput } from 'react-hook-form-mantine';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { array, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const LtiConfig = () => {

  const schema = object().shape({
    openid_url: string(),
    redirect_uri: string(),
    target_uri: string(),
    public_jwk: string(),
    domain: string().required(),
    client_id: string().required(),
    deployments: array().required(),
  });

  const { userId } = useSelector((state: RootState) => state.auth);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      openid_url: '',
      redirect_uri: '',
      target_uri: '',
      public_jwk: '',
      requiredAssignmentId: '',
      domain: '',
      client_id: '',
      deployments: [],
    }
  });

  const [activeWindow, setActiveWindow] = useState('Tool');
  const [deployments, setDeployments] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const customVariables = `points=$Canvas.assignment.pointsPossible
available_until=$ResourceLink.available.endDateTime
student_attempts=$Canvas.assignment.submission.studentAttempts
assignment_attempts=$Canvas.assignment.allowedAttempts
submission_time_limit=$ResourceLink.submission.endDateTime`;

  const tabs = ['Tool', 'Canvas'];

  useEffect(() => {
    if (userId != 'undefined' && userId != undefined && userId != 0) {
      getAdminConfig(userId).then((res: any) => {
        setValue('openid_url', res.openid_url);
        setValue('public_jwk', res.public_jwk);
        setValue('redirect_uri', res.redirect_uri);
        setValue('target_uri', res.target_uri);
        setIsLoading(false);

        if (res.domain !== undefined) {
          setValue('domain', res.domain);
          setValue('client_id', res.client_id);
          setValue('deployments', res.deployments);
          setDeployments(res.deployments.map(d => {
            return {value: d, label: d};
          }));
        }
      });
    }
  }, [userId]);

  const changeTab = (step: number) => {
    const next = tabs.indexOf(activeWindow);
    setActiveWindow(tabs[next + step]);
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const adminConfig = {
      clientID: data.client_id,
      domain: data.domain,
      deployments: data.deployments,
      userId
    };

    updateAdminConfig(adminConfig)
      .then(async (response) => {
        if (!response.ok) {
          const message = `Ha ocurrido un error: ${response.status}`;
          throw new Error(message);
        }
        setIsLoading(false);
        notifications.show({ message: 'La configuración fue guardada exitosamente', autoClose: 3000 });
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red' }));
  };

  return (
      <div>
          {activeWindow === 'Tool' ? (
            <>
              <Container size={1000}>
                <Paper withBorder shadow='md' p={30} mt={30} radius='md' style={{ marginTop: 0 }}>
                  <div style={{ color: '#228be6', fontWeight: 'bold', gap: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Copia y pega estos valores en Canvas para configurar tu llave LTI </span>
                    <Anchor style={{justifySelf: 'center'}}
                            href="https://github.com/dmitry-viskov/pylti1.3/wiki/Configure-Canvas-as-LTI-1.3-Platform" target="_blank">
                      Enlace a Guía detallada
                    </Anchor>
                  </div>
                  <br />
                  <Divider size='xs' style={{ padding: '0.5rem 0.5rem' }} />
                  <Grid>
                    <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
                      <TextInput
                        style={{ flexGrow: 1 }}
                        name='redirect_uri'
                        readOnly
                        control={control}
                        label='Redirección URI'
                      />
                      <CopyButton value={getValues('redirect_uri')} timeout={1000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copiado' : 'Copia'} withArrow position='right'>
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                              {copied ? <IconCheck size='1rem' /> : <IconCopy size='1rem' />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Grid.Col>

                    <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
                      <TextInput
                        style={{ flexGrow: 1 }}
                        name='target_uri'
                        readOnly
                        control={control}
                        label='Enlace meta de URI'
                      />
                      <CopyButton value={getValues('target_uri')} timeout={1000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copiado' : 'Copia'} withArrow position='right'>
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                              {copied ? <IconCheck size='1rem' /> : <IconCopy size='1rem' />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Grid.Col>

                    <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
                      <TextInput
                        style={{ flexGrow: 1 }}
                        name='openid_url'
                        readOnly
                        control={control}
                        label='URL de iniciación de OpenID Connect'
                      />
                      <CopyButton value={getValues('openid_url')} timeout={1000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copiado' : 'Copia'} withArrow position='right'>
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                              {copied ? <IconCheck size='1rem' /> : <IconCopy size='1rem' />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Grid.Col>

                    <Grid.Col span={12} style={{ display: 'flex', alignItems: 'end' }}>
                      <JsonInput
                        style={{ flexGrow: 1 }}
                        name='public_jwk'
                        control={control}
                        label='JWK'
                        readOnly
                        autosize
                      />
                      <CopyButton value={getValues('public_jwk')} timeout={1000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copiado' : 'Copia'} withArrow position='right'>
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                              {copied ? <IconCheck size='1rem' /> : <IconCopy size='1rem' />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Grid.Col>

                    <Grid.Col span={12} style={{ display: 'flex', alignItems: 'end' }}>
                      <Textarea
                        style={{ flexGrow: 1 }}
                        label='Configuraciones Adicionales - Campos Personalizados'
                        defaultValue={customVariables}
                        readOnly
                        autosize
                      />
                      <CopyButton value={customVariables} timeout={1000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copiado' : 'Copia'} withArrow position='right'>
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                              {copied ? <IconCheck size='1rem' /> : <IconCopy size='1rem' />}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Grid.Col>

                    <Grid.Col span={12} style={{ display: 'flex', alignItems: 'end' }}>
                      <MantineMS
                        disabled
                        style={{ flexGrow: 1 }}
                        label="Ubicaciones"
                        data={[{ value: 'Assignment View', label: 'Assignment View' },
                          { value: 'Assignment Menu', label: 'Assignment Menu' },
                          { value: 'Assignment Selection', label: 'Assignment Selection' }]}
                        defaultValue={['Assignment View', 'Assignment Menu', 'Assignment Selection']}
                      />
                    </Grid.Col>

                    <Grid.Col span={12} style={{ paddingTop: 0 }}>
                      <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>
                        <Button type='submit' onClick={() => changeTab(1)}>
                          Siguiente
                        </Button>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Container>
            </>
          ) : null}

          {activeWindow === 'Canvas' ? (

            <Container size={1000}>
              <Paper withBorder shadow='md' p={30} mt={30} radius='md' style={{ marginTop: 0 }}>
                <div style={{ color: '#228be6', fontWeight: 'bold' }}>
                  Llena los datos que te da Canvas para configurar la conexión
                </div>
                <br />
                <Divider size='xs' style={{ padding: '0.5rem 0.5rem' }} />
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                  <Grid>

                    <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
                      <TextInput
                        style={{ flexGrow: 1 }}
                        placeholder='Ej: 10000000000007'
                        name='client_id'
                        control={control}
                        label='ID de Cliente'
                        error={null}
                        withAsterisk={errors.client_id !== undefined}/>
                    </Grid.Col>

                    <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
                      <TextInput
                        style={{ flexGrow: 1 }}
                        placeholder='Ej: https://mi-dominio-de-canvas.com'
                        name='domain'
                        control={control}
                        label='Dominio de tu instancia de Canvas'
                        error={null}
                        withAsterisk={errors.domain !== undefined}/>
                    </Grid.Col>

                    <Grid.Col span={12} style={{ display: 'flex', alignItems: 'end' }}>
                      <MultiSelect
                        style={{ flexGrow: 1 }}
                        label="IDs de las Implementaciones"
                        data={getValues('deployments')}
                        placeholder="Ej: 2:4dde05e8ca1973bcca9bffc13e1548820eee93a3"
                        name='deployments'
                        control={control}
                        creatable
                        searchable
                        onChange={(e) => setDeployments(e)}
                        getCreateLabel={(query) => `Agrega ${query}`}
                        onCreate={(query) => {
                          const item = { value: query, label: query };
                          setDeployments((current) => [...current, item]);
                          return item;
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <Group position='right' mt='md' style={{ 'marginTop': '1rem' }}>

                        <Button  onClick={() => changeTab(-1)}>
                          {'Regresar'}
                        </Button>
                        <Button loading={isLoading} type='submit' disabled={deployments.length == 0 || !isValid } variant='outline'>
                          Guardar Configuración
                        </Button>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </form>
              </Paper>
            </Container>
          ) : null}
      </div>
  );
};

export default LtiConfig;
