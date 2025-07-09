export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
		// handle error, e.g. report to a service
		/* eslint-disable no-console */
		console.error("Error occurred:", error, instance, info);
	};

	// Also possible
	nuxtApp.hook("vue:error", (error, instance, info) => {
		// handle error, e.g. report to a service
		/* eslint-disable no-console */
		console.error("Vue error hook:", error, instance, info);
	});
});
