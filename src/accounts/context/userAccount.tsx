// Libraries
import React, {FC, useCallback, useEffect, useState} from 'react'
// import {useParams, useHistory} from 'react-router-dom'
import {useDispatch} from 'react-redux'

// Utils
import {getAccounts} from 'src/client/unityRoutes'
// import {notify} from 'src/shared/actions/notifications'
// import {
//     getAccountError,
//     deleteAccountError,
// } from 'src/shared/copy/notifications'

// todo:  talk to randy, about making this a real type, like OperatorAccount in unityRoutes.ts
// for now: defining it here (duck typing)
export interface UserAccount {
  id: number
  isActive: boolean
  isDefault: boolean
  name: string
}
export type Props = {
  children: JSX.Element
}

export interface UserAccountContextType {
  userAccounts: UserAccount[]
  handleGetAccounts: () => void
  setDefaultAccountId: (id: number) => void
  defaultAccountId: number
}

// hmm...you know from the MeContext which is the account that is currently logged into.....

export const DEFAULT_CONTEXT: UserAccountContextType = {
  userAccounts: [],
  defaultAccountId: -1,
  handleGetAccounts: () => {},
  setDefaultAccountId: (id: number) => {
    console.log('would set id here....', id)
  },
}

export const UserAccountContext = React.createContext<UserAccountContextType>(
  DEFAULT_CONTEXT
)


//todo:  put in dependency array:  whenever the default account changes, should redo the call.

export const UserAccountProvider: FC<Props> = React.memo(({children}) => {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(null)
  const [defaultAccountId, setDefaultAccountId] = useState<number>(null)
    const dispatch = useDispatch()

  const handleGetAccounts = useCallback(async () => {
    try {
      const resp = await getAccounts({})
      if (resp.status !== 200) {
        // set user account status to error;...TODO
        throw new Error(resp.data.message)
      }
      console.log('got the data response!', resp.data)
      const arghh = resp.data
      if (Array.isArray(arghh)) {
        setUserAccounts(resp.data)

        const defaultAcctArray = resp.data.filter(line => line.isDefault)
        if (defaultAcctArray && defaultAcctArray.length === 1) {
          const defaultId = defaultAcctArray[0].id
          console.log('got the default id....', defaultId)
          setDefaultAccountId(defaultId)
        }
      } else {
        console.log('arghh!  did not get an array.... :(')
      }
    } catch (error) {
      console.log('caught error...', error)
    }
  }, [dispatch])

  useEffect(() => {
    handleGetAccounts()
  }, [handleGetAccounts, defaultAccountId])

  return (
    <UserAccountContext.Provider
      value={{
        userAccounts,
        defaultAccountId,
        setDefaultAccountId,
        handleGetAccounts,
      }}
    >
      {children}
    </UserAccountContext.Provider>
  )
})

export default UserAccountProvider
