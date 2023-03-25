import '../src/styles/globals.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster
        position='top-right'
        reverseOrder={false} />
    </Provider>);
}
