import { useEffect, useRef } from "react"

interface DidMountEffectProps {
  func: () => void;
  deps: any[];
  cleanup: () => void
}
export const useDidMountEffect = (func: () => void, deps: any[], cleanup?: () => void) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
    () => {
      if (cleanup) cleanup();
    }
  }, deps)
}