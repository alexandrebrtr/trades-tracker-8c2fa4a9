
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialization without flash of content
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  })

  React.useEffect(() => {
    // Ensure correct detection on different devices
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Use matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use appropriate events based on browser
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Initial check
    handleMediaChange(mql)
    
    // Add appropriate listener based on browser compatibility
    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange)
      return () => mql.removeEventListener('change', handleMediaChange)
    } else {
      // Fallback for older browsers
      mql.addListener(handleMediaChange as any)
      return () => mql.removeListener(handleMediaChange as any)
    }
  }, [])

  return isMobile
}
