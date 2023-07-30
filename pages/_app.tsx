import '../src/styles/globals.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import { MantineProvider } from '@mantine/core';
import Layout from '../src/components/Layout';
import { RouterTransition } from '../src/components/RouterTransition';
import { Notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MantineProvider>
        <RouterTransition />
        <Notifications position="top-right"/>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </Provider>
  );
}
