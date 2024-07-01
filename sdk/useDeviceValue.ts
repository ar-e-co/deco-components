import { useDevice } from "deco/hooks/useDevice.ts";

type DeviceRecord<T> = {
  tablet?: T;
  mobile: T;
  desktop: T;
};

export type DeviceValue<T> = DeviceRecord<T> | T;

function valueIsRecord<T>(value: DeviceValue<T>): value is DeviceRecord<T> {
  return typeof value === "object";
}

export function useDeviceValue<T>(
  value: DeviceValue<T>,
  fallback: "mobile" | "desktop" = "mobile",
): T {
  const device = useDevice();
  console.log("device", device);

  if (valueIsRecord(value)) {
    return value[device] ?? value[fallback];
  }

  return value;
}

export function useDeviceValues<T>(
  values: Array<DeviceValue<T>>,
  fallback: "mobile" | "desktop" = "mobile",
): T[] {
  const device = useDevice();

  return values.map((value) => {
    if (valueIsRecord(value)) {
      return value[device] ?? value[fallback];
    }

    return value;
  });
}
