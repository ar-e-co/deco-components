import { ComponentChildren } from "preact";

export interface Props {
  message?: ComponentChildren;
  verticalPosition?: "toast-top" | "toast-middle" | "toast-bottom";
  horizontalPosition?: "toast-start" | "toast-center" | "toast-end";
}

export default function Toast(props: Props) {
  const { message, verticalPosition, horizontalPosition } = props;

  return (
    <div className={`toast ${verticalPosition} ${horizontalPosition}`}>
      <div className="alert alert-info">
        <span>{message}</span>
      </div>
    </div>
  );
}
