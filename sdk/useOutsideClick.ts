import { useCallback, useEffect, useRef } from "preact/hooks";

type SupportedEvents = MouseEvent;

export function useOutsideClick<T extends HTMLDivElement>(
  callback: (event: SupportedEvents) => void,
) {
  const ref = useRef<T>(null);

  const handleClickOutside = useCallback(
    function handleClickOutside(event: SupportedEvents) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
      // We don't want this to change.. if we need more complex behaviour we can change this
    },
    [],
  );

  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    // document.addEventListener('touchend', handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      // document.removeEventListener('touchend', handleClickOutside);
    };
  }, [handleClickOutside]);

  return ref;
}

export default useOutsideClick;
