
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
    
    // Vérification immédiate
    checkIfMobile()
    
    // Utiliser à la fois matchMedia et resize pour une meilleure fiabilité
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Fonction de callback pour les deux types d'événements
    const handleResize = () => checkIfMobile()
    const handleMediaChange = () => checkIfMobile()
    
    // Utiliser à la fois resize et mediaQuery pour plus de fiabilité
    window.addEventListener("resize", handleResize)
    mql.addEventListener("change", handleMediaChange)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      mql.removeEventListener("change", handleMediaChange)
    }
  }, [])

  return isMobile
}
