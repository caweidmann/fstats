'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { getUsers } from '@/m-user/api'
import { getUserDefaults, useMutateAddUser } from '@/m-user/service'
import { initStorage } from '@/lib/localforage'

type StorageProps = {
  children: ReactNode
}

const Component = ({ children }: StorageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const { mutateAsync: addUser } = useMutateAddUser()

  useEffect(() => {
    const init = async () => {
      await initStorage()

      const existingUsers = await getUsers()
      if (!existingUsers.length) {
        await addUser(getUserDefaults())
      }

      setIsLoading(false)
    }
    init()
  }, [])

  if (isLoading) {
    return null
  }

  return children
}

export default Component
