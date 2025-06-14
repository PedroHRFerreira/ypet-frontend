<script lang="ts">
export default defineComponent({
	name: "TemplatesLogin",
	setup() {
		const route = useRoute();
		const isForgotPassword = route.query?.hash === "forgot-password";
		const isResetPassword = route.query?.hash === "reset-password";

		return {
			isForgotPassword,
			isResetPassword,
		};
	},
});
</script>
<template>
	<h1>LOGIN</h1>
</template>
