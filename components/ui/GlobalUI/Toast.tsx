import ToastUI, {
  Props as ToastProps,
} from "deco-components/components/ui/Toast.tsx";
import { useToast } from "deco-components/sdk/ui/useToast.ts";

export type Props = {
  [key in keyof ToastProps]?: ToastProps[key];
};

function Toast(props: Props) {
  const { displayToast } = useToast();

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
