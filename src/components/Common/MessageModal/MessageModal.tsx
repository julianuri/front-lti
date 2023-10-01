import { Modal } from '@mantine/core';
import styles from './MessageModal.module.scss';
import { ReactNode } from 'react';

type MessageModalType = {
  message: ReactNode,
  title: string,
  isOpen: boolean,
  close: () => void,
}

const MessageModal = ({message, title, isOpen, close}: MessageModalType) => {

  return <Modal opened={isOpen}
                styles={{title: { color: '#228be6', fontWeight: 'bold' }}}
                onClose={close}
                className={styles.modal}
                title={title}
                centered>
    {message}
  </Modal>;
};

export default MessageModal;
