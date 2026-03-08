'use client'

import React, { createContext, useContext, useState } from 'react'

interface PresentationModeContextType {
  presentationMode: boolean
  setPresentationMode: (value: boolean) => void
}

const PresentationModeContext = createContext<PresentationModeContextType>({
  presentationMode: false,
  setPresentationMode: () => {},
})

export function PresentationModeProvider({ children }: { children: React.ReactNode }) {
  const [presentationMode, setPresentationMode] = useState(false)

  return (
    <PresentationModeContext.Provider value={{ presentationMode, setPresentationMode }}>
      {children}
    </PresentationModeContext.Provider>
  )
}

export function usePresentationMode() {
  return useContext(PresentationModeContext)
}
