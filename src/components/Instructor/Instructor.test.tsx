import Instructor from './Instructor';
import { renderWithProviders } from '../../utils/TestUtils';

test('render instructor', () => {
  const component = renderWithProviders(<Instructor/>);
  console.log(component);
});
