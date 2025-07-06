<script lang="ts">
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export default defineComponent({
	name: "TemplatesLogin",
	setup() {
		const route = useRoute();
		const isForgotPassword = route.query?.hash === "forgot-password";
		const isResetPassword = route.query?.hash === "reset-password";

    const useAuthLogin = useAuthLoginStore();
    useAuthLogin.setEmail('marcus@ypet.com');
    useAuthLogin.setPassword('password');

		return {
			isForgotPassword,
			isResetPassword,
      useAuthLogin,
		};
	},
});
</script>
<template>
  <OrganismsAuthLogin />
</template>
