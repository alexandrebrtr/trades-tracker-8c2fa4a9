
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialisation immédiate pour éviter un flash de contenu
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  })

  React.useEffect(() => {
    // Pour assurer que la détection soit correcte sur différents appareils
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Utiliser matchMedia pour une meilleure performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Utiliser les événements appropriés selon le navigateur
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Vérification initiale
    handleMediaChange(mql)
    
    // Ajouter le listener approprié selon la compatibilité du navigateur
    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange)
      return () => mql.removeEventListener('change', handleMediaChange)
    } else {
      // Fallback pour les anciens navigateurs
      mql.addListener(handleMediaChange as any)
      return () => mql.removeListener(handleMediaChange as any)
    }
  }, [])

  return isMobile
}
