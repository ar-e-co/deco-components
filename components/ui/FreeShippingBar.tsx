import Icon, {
  Props as IconProps,
} from "deco-components/components/ui/Icon.tsx";
import { formatPrice } from "deco-components/sdk/format.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";
import { formatMessage } from "deco-components/components/shipping/sdk/helpers.tsx";

const anatomy = [
  "container",
  "content",
  "message",
  "message--remaining",
  "freeShippingMessage",
  "progress",
] as const;

type FreeShippingStyles = AnatomyClasses<typeof anatomy[number]>;

interface Props {
  classes?: FreeShippingStyles;
  current: number;
  target: number;
  locale: string;
  currency: string;
  icon?: boolean;
  iconProps?: Partial<IconProps>;
  message?: string;
  freeShippingMessage?: string;
}

function FreeShippingProgressBar({
  target,
  current,
  currency,
  locale,
  icon = false,
  iconProps,
  classes,
  message = "Faltam {{remaining}} para ganhar frete grátis!",
  freeShippingMessage = "Você ganhou frete grátis!",
}: Props) {
  const remaining = target - current;
  const percent = Math.floor((current / target) * 100);

  return (
    <div class={handleClasses("flex flex-col w-full", classes?.container)}>
      <progress
        class={handleClasses(
          "bg-white w-full h-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-white [&::-webkit-progress-value]:bg-green [&::-moz-progress-bar]:bg-green",
          classes?.progress,
        )}
        value={percent}
        max={100}
      />

      <div
        class={handleClasses(
          "flex justify-center items-center text-primary mt-1",
          classes?.content,
        )}
      >
        {icon && <Icon id={"Truck"} size={24} {...iconProps} />}

        {remaining > 0
          ? (
            <span class={handleClasses(classes?.message)}>
              {formatMessage(message, {
                "{{remaining}}": {
                  value: String(formatPrice(remaining, currency, locale)),
                  classes: classes?.["message--remaining"] ?? "",
                },
              })}
            </span>
          )
          : (
            <p
              class={handleClasses(
                "bg-green-600 w-full text-white text-14 leading-tight text-center font-bold pt-1 pb-2",
                classes?.message,
                classes?.freeShippingMessage,
              )}
            >
              {freeShippingMessage}
            </p>
          )}
      </div>
    </div>
  );
}

export default FreeShippingProgressBar;
