
import * as React from "react"

// Constante pour le breakpoint mobile, utilisée dans tout le projet
export const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialisation sans flash de contenu
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  })

  React.useEffect(() => {
    // Utilisation de matchMedia pour une meilleure performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Fonction de gestion des changements de media query
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Vérification initiale
    handleMediaChange(mql)
    
    // Utiliser la méthode appropriée selon la compatibilité du navigateur
    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange)
      return () => mql.removeEventListener('change', handleMediaChange)
    } else {
      // Fallback pour les navigateurs plus anciens
      const handleResize = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      window.addEventListener('resize', handleResize, { passive: true })
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
