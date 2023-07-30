import { createSlice } from '@reduxjs/toolkit';
import {
  getFromSessionStorage,
  saveInSessionStorage,
} from '../../utils/SessionStorage';

const avatarSlice = createSlice({
  name: 'avatarConfig',
  initialState: {
    avatarConfig: getAvatar(),
  },
  reducers: {
    saveConfig: (state: any, action) => {
      saveInSessionStorage({
        key: 'avatarConfig',
        value: JSON.stringify(action.payload),
      });
      state.avatarConfig = action.payload;
    },
  },
});

function getAvatar() {
  const item = getFromSessionStorage('avatarConfig', '');
  if (item != null && item != '') {
    return JSON.parse(item);
  }
  return '';
}

export default avatarSlice;
