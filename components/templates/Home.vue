<script lang="ts">
import { defineComponent } from "vue";
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";
export default defineComponent({
	name: "TemplatesHome",
  setup() {
    const useAuthLogin = useAuthLoginStore();

    return {
      useAuthLogin,
    };
  },
});
</script>

<template>
	<div class="section">
		<h1>Hello World</h1>
    <MoleculesButtonsCommon
      type="primary"
      text="Logout"
      @onclick="useAuthLogin.logout"
    />
	</div>
</template>
<style scoped lang="scss">
.section {
	padding: 6rem 1rem;
}
</style>
