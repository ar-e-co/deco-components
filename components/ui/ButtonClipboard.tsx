import { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "preact/hooks";

import { clx } from "deco-components/sdk/clx.ts";

import Icon, {
  AvailableIcons,
  Props as IconProps,
} from "deco-components/components/ui/Icon.tsx";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const classes = [
  "button",
  "content",
  "feedback",
  "show",
  "hide",
] as const;

type Classes = AnatomyClasses<typeof classes[number]>;

export interface Props
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "ref"> {
  label: string;
  valueToCopy: string;
  icon?: AvailableIcons;
  iconProps?: Partial<IconProps>;
  children?: ComponentChildren;
  feedback?: string;
  feedbackTimeout?: number;
  classes?: Partial<Classes>;
  bindClickToId?: string;
}

export type Handle = {
  copyToClipboard: () => Promise<void>;
};

const ButtonClipboard = forwardRef<Handle, Props>(function ButtonClipBoard({
  label,
  valueToCopy,
  icon = "Clipboard",
  iconProps = {},
  children,
  feedback = "Copiado",
  feedbackTimeout = 1500,
  classes,
  bindClickToId,
  ...props
}, ref) {
  const [showFeedback, setShowFeedback] = useState(false);

  const styles = {
    span: handleClasses(
      "items-center justify-center w-full h-full transition-opacity duration-250 text-16 leading-normal text-gray-1000",
      classes?.content,
    ),
    hide: handleClasses("hidden opacity-0", classes?.hide),
    show: handleClasses("flex opacity-100", classes?.show),
  };

  const copyToClipboard = useCallback(async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setShowFeedback(true);
    } finally {
      setTimeout(() => {
        setShowFeedback(false);
      }, feedbackTimeout);
    }
  }, [valueToCopy]);

  useImperativeHandle(ref, () => ({
    copyToClipboard,
  }));

  // Bind click event to element with id
  // Avoids the need to make the parent an island as well
  useEffect(() => {
    if (!bindClickToId) {
      return;
    }

    const element = document.getElementById(bindClickToId);
    element?.addEventListener("click", copyToClipboard);

    return () => {
      element?.removeEventListener("click", copyToClipboard);
    };
  }, [bindClickToId, copyToClipboard]);

  return (
    <button
      {...props}
      class={handleClasses("flex items-center justify-center", classes?.button)}
      onClick={() => copyToClipboard()}
    >
      <span
        class={clx(
          styles.span,
          showFeedback
            ? `animate-fade-out-up ${styles.hide}`
            : `animate-fade-in-down ${styles.show}`,
        )}
      >
        {children ?? (
          <>
            {label}

            <Icon
              class="ml-1.5"
              id={icon}
              size={16}
              strokeWidth={1}
              {...iconProps}
            />
          </>
        )}
      </span>

      <span
        class={clx(
          styles.span,
          classes?.feedback,
          showFeedback
            ? `animate-fade-in-up ${styles.show}`
            : `animate-fade-out-down ${styles.hide}`,
        )}
      >
        {feedback}
      </span>
    </button>
  );
});

export default ButtonClipboard;
