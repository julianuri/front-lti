import HangmanCreator from './HangmanCreator';
import { renderWithProviders } from '../../../../utils/TestUtils';

test('render hangman creator', () => {
  const component = renderWithProviders(<HangmanCreator/>);
  component.getByText('Intentos');
});
