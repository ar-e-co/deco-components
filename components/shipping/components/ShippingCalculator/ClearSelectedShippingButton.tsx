import { ComponentChildren } from "preact";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";
import Icon, {
  Props as IconProps,
} from "deco-components/components/ui/Icon.tsx";
import Spinner from "deco-components/components/ui/Spinner.tsx";

import { clearShippingOptions } from "../../sdk/chooseShippingOption.ts";
import { useShippingCalculator } from "../../sdk/useShippingCalculator.ts";

const anatomy = [
  "container",
] as const;

type Styles = AnatomyClasses<typeof anatomy[number]>;

export type ClearSelectedShippingButtonProps = {
  classes?: Styles;
  hideIfNoSelectedShipping?: boolean;
  children?: ComponentChildren;
  iconProps?: Partial<IconProps>;
};

function ClearSelectedShippingButton({
  classes,
  hideIfNoSelectedShipping = true,
  children,
  iconProps,
}: ClearSelectedShippingButtonProps) {
  const { selectedSlaSignal, loadingSignal } = useShippingCalculator();

  const hasSelectedSla = Boolean(selectedSlaSignal.value?.__id);
  const loading = loadingSignal.value;

  function handleClearShippingOptions(e: Event) {
    e.stopPropagation();
    clearShippingOptions();
  }

  if (!hasSelectedSla && hideIfNoSelectedShipping) {
    return null;
  }

  if (loading) {
    return (
      <div class={handleClasses("p-2", classes?.container)}>
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <div
      class={handleClasses("cursor-pointer", classes?.container)}
      onClick={handleClearShippingOptions}
    >
      {children ?? (
        <Icon
          id="XMark"
          width={14}
          height={14}
          strokeWidth={1}
          {...iconProps}
        />
      )}
    </div>
  );
}

export default ClearSelectedShippingButton;
