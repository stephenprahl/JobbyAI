// Clear any existing service workers from other apps
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      // Only unregister service workers that are not from our app
      if (!registration.scope.includes('resume-plan-ai')) {
        console.log('Unregistering foreign service worker:', registration.scope);
        registration.unregister();
      }
    }
  });
}
