import { useState, useEffect, useRef, useCallback, MutableRefObject } from "react";

export const useInterval = (ref: any, callback: () => void, delay: number) => {
    const intervalId = ref;
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    });
    useEffect(() => {
        const tick = () => savedCallback.current();
        if (typeof delay === 'number') {
            intervalId.current = window.setInterval(tick, delay);
            return () => window.clearInterval(intervalId.current);
        }
    }, [ delay ]);
    return intervalId.current;
}

export function useIntersectionObserver(ref: MutableRefObject<Element | null>, options: IntersectionObserverInit = {}, forward: boolean = true) {
    const [element, setElement] = useState<Element | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observer = useRef<null | IntersectionObserver>(null);

    const cleanOb = () => {
        if (observer.current) {
            observer.current.disconnect()
        }
    }

    useEffect(() => {
        setElement(ref.current);
    }, [ref]);

    useEffect(() => {
        if (!element) return;
        cleanOb()
        const ob = observer.current = new IntersectionObserver(([entry]) => {
            const isElementIntersecting = entry.isIntersecting;
            if (!forward) {
                setIsIntersecting(isElementIntersecting)
            } else if (forward && !isIntersecting && isElementIntersecting) {
                setIsIntersecting(isElementIntersecting);
                cleanOb()
            };
        }, { ...options })
        ob.observe(element);
        return () => {
            cleanOb()
        }
    }, [element, options ])


    return isIntersecting;
}

export function useStateWithPromise (initialState: any) {
    const [state, setState] = useState(initialState);
    const resolverRef = useRef<any>(null);
  
    useEffect(() => {
      if (resolverRef.current) {
        resolverRef.current(state);
        resolverRef.current = null;
      }
      /**
       * Since a state update could be triggered with the exact same state again,
       * it's not enough to specify state as the only dependency of this useEffect.
       * That's why resolverRef.current is also a dependency, because it will guarantee,
       * that handleSetState was called in previous render
       */
    }, [resolverRef.current, state]);
  
    const handleSetState = useCallback((stateAction) => {
      setState(stateAction);
      return new Promise(resolve => {
        resolverRef.current = resolve;
      });
    }, [setState])
  
    return [state, handleSetState]
}
