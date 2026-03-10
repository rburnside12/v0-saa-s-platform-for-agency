'use client'

import { createContext, useContext, useState } from 'react'

type Role = 'super_admin' | 'campaign_manager' | 'account_executive' | 'coordinator'

interface UserRoleContextType {
  role: Role
  setRole: (r: Role) => void
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: 'campaign_manager',
  setRole: () => {},
})

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('campaign_manager')
  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole() {
  return useContext(UserRoleContext)
}
