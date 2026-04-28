import { useState, useEffect, useCallback } from 'react'

// Detect scroll position
export function useScrollPosition() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return scrolled
}

// Hover with delay to prevent accidental triggers
export function useHoverDelay(delay = 500) {
  const [hovered, setHovered] = useState(false)
  let timer = null

  const onMouseEnter = useCallback(() => {
    timer = setTimeout(() => setHovered(true), delay)
  }, [delay])

  const onMouseLeave = useCallback(() => {
    clearTimeout(timer)
    setHovered(false)
  }, [])

  return { hovered, onMouseEnter, onMouseLeave }
}

// Window size for responsive logic
export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return size
}
