import { useDialog } from 'src/composable/AlertDialog';
import { isAxiosError } from 'axios';

export const useHandleErrorMessage = () => {
  const { confirmMessage } = useDialog();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleErrorDetail(ex: any) {
    if (isAxiosError(ex)) {
      await confirmMessage({
        type: 'negative',
        deleteConfirmStatus: true,
        message: '錯誤',
        content: ex.response?.data.detail ?? ex.response?.data.error ?? '',
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleErrorMessage(ex: any) {
    if (isAxiosError(ex)) {
      await confirmMessage({
        type: 'negative',
        deleteConfirmStatus: true,
        message: '錯誤',
        content: ex.message,
      });
    }
  }

  async function handleErrorMessageByText(text: string) {
    await confirmMessage({
      type: 'negative',
      deleteConfirmStatus: true,
      message: '錯誤',
      content: text,
    });
  }

  return {
    handleErrorDetail,
    handleErrorMessage,
    handleErrorMessageByText,
  };
};
