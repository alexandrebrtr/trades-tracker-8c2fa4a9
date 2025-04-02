
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialization without flash of content
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  })

  React.useEffect(() => {
    // Function to handle viewport changes and set mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Use matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handle media query list events
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Initial check
    handleMediaChange(mql)
    
    // Add proper event listener based on browser compatibility
    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange)
      return () => mql.removeEventListener('change', handleMediaChange)
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize, { passive: true })
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
