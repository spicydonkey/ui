// Actions
import {
  setCurrentOrgDetails,
  setCurrentBillingProvider,
  setQuartzIdentity,
  setQuartzIdentityStatus,
} from 'src/identity/actions/creators'

// Types
import {RemoteDataState, GetState, NotificationAction} from 'src/types'
import {Actions as MeActions} from 'src/me/actions/creators'
import {Actions as IdentityActions} from 'src/identity/actions/creators'
import {Dispatch} from 'redux'

type ActionTypes = IdentityActions | MeActions | NotificationAction

// Utilities
import {
  fetchQuartzIdentity,
  fetchAccountDetails,
  fetchOrgDetails,
} from 'src/identity/apis/auth'

// Error Reporting
import {reportErrorThroughHoneyBadger} from 'src/shared/utils/errors'

export const getQuartzIdentityThunk =
  () => async (dispatch: Dispatch<any>, getState: GetState) => {
    try {
      dispatch(setQuartzIdentityStatus(RemoteDataState.Loading))

      const quartzIdentity = await fetchQuartzIdentity()

      dispatch(setQuartzIdentity(quartzIdentity))

      dispatch(setQuartzIdentityStatus(RemoteDataState.Done))
    } catch (err) {
      dispatch(setQuartzIdentityStatus(RemoteDataState.Error))

      reportErrorThroughHoneyBadger(err, {
        name: 'Failed to fetch /quartz/identity',
        context: {state: getState()},
      })
    }
  }

export const getBillingProviderThunk =
  () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
    try {
      dispatch(setQuartzIdentityStatus(RemoteDataState.Loading))

      const currentState = getState()
      const accountId = currentState.identity.currentIdentity.account.id

      const accountDetails = await fetchAccountDetails(accountId)

      dispatch(setCurrentBillingProvider(accountDetails.billingProvider))
      dispatch(setQuartzIdentityStatus(RemoteDataState.Done))
    } catch (err) {
      dispatch(setQuartzIdentityStatus(RemoteDataState.Error))

      reportErrorThroughHoneyBadger(err, {
        name: 'Failed to fetch /quartz/accounts/',
        context: {state: getState()},
      })
    }
  }

export const getCurrentOrgDetailsThunk =
  (orgId: string) => async (dispatch: any, getState: GetState) => {
    try {
      dispatch(setQuartzIdentityStatus(RemoteDataState.Loading))

      const orgDetails = await fetchOrgDetails(orgId)

      dispatch(setCurrentOrgDetails(orgDetails))
      dispatch(setQuartzIdentityStatus(RemoteDataState.Done))
    } catch (err) {
      dispatch(setQuartzIdentityStatus(RemoteDataState.Error))

      reportErrorThroughHoneyBadger(err, {
        name: 'Failed to fetch /quartz/orgs/:orgId',
        context: {state: getState()},
      })
    }
  }
