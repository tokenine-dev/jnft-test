import { useEffect, useRef, ComponentType, ReactNode, CSSProperties } from 'react'
import { useIntersectionObserver } from 'hooks/utils'

interface LazyLoadProps {
  tag?: ComponentType | keyof JSX.IntrinsicElements
  children: ReactNode
  style?: CSSProperties
  className?: string
  root?: Element | Document | null
  threshold?: number | number[]
  rootMargin?: string
  forward?: boolean
  onVisible?: () => any
}

export function LazyLoad(props: LazyLoadProps) {
  const { tag = 'div', children, style, className, onVisible } = props;
  const Tag: any = tag;
  const ref = useRef<Element>(null)
  const isIntersecting = useIntersectionObserver(ref, {
      root: props.root ?? null,
      threshold: props.threshold ?? 0,
      rootMargin: props.rootMargin
  }, props.forward);

  useEffect(() => {
    if (isIntersecting && onVisible) {
      onVisible()
    }
  }, [ isIntersecting ])

  return (
      <Tag
          ref={ref}
          style={style}
          className={className}
      >
        {isIntersecting ? children : null}
      </Tag>
  )
}
