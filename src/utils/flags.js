import Rox from 'rox-browser'
import store from '../store'
import { betaAccess } from './users'

export const Flags = {
  sidebar: new Rox.Flag(false),
  title: new Rox.Flag(false)
};

export const configurationFetchedHandler = fetcherResults => {
  console.log('The configuration status is: ' + fetcherResults.fetcherStatus)
  if (fetcherResults.hasChanges && fetcherResults.fetcherStatus === 'APPLIED_FROM_NETWORK') {
    window.location.reload(false)
  }
  else if (fetcherResults.fetcherStatus === 'ERROR_FETCH_FAILED') {
    export const impressionHandler = (reporting, experiment) => {
      if (experiment.name === 'title') {
        console.log('Title flag, ' + reporting.name + ' ,value is ' + reporting.value)
        gtag('event', experiment.name, {
          'event_category': reporting.name,
          'event_label': reporting.value
        })
      } else {
        console.log('Not in title experiment. Flag ' + reporting.name + '. default value ' + reporting.value + ' was used')
      }
    };
    console.log('Error occured! Details are: ' + fetcherResults.errorDetails)
  }
};

const options = {
  configurationFetchedHandler: configurationFetchedHandler
  impressionHandler: impressionHandler
};

Rox.setCustomBooleanProperty('isLoggedIn', store.getters.isLoggedIn);
Rox.setCustomBooleanProperty('hasBetaAccess', betaAccess());

Rox.register('default', Flags);
Rox.setup(process.env.VUE_APP_ROLLOUT_KEY, options);
