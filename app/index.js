
import Expo from 'expo'
import React from 'react'
import Sentry from 'sentry-expo'
import { Provider } from 'react-redux'

import storeFactory from '@store'

import App from '@containers/app'

const initialState = {}
const store = storeFactory(initialState)

const Index = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

Sentry.enableInExpoDevelopment = true

Sentry
  .config('https://577e0a8ab9124013aaa3c43b6209d0b5:9af1ee2a9e234a7a8f4686bfeceffe04@sentry.io/212109')
  .install()

Expo.registerRootComponent(Index)
