import ToastUI, {
  Props as ToastProps,
} from "deco-components/components/ui/Toast.tsx";
import { useToastUI } from "deco-components/sdk/ui/useToast.ts";

export type Props = {
  [key in keyof ToastProps]?: ToastProps[key];
};

function Toast(props: Props) {
  const { displayToast } = useToastUI();

  const isOpen = displayToast.open.value;
  const message = displayToast.message.value;

  if (!isOpen || !message) {
    return null;
  }

  return (
    <ToastUI
      message={message}
      {...props}
    >
    </ToastUI>
  );
}

export default Toast;
