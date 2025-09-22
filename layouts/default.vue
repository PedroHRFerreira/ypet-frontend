<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "LayoutsDefault",
});
</script>
<template>
	<main class="layout">
		<aside class="aside">
			<OrganismsSidebarNav />
		</aside>
		<div class="content">
			<OrganismsHeader />
			<slot />
		</div>
	</main>
</template>
<style scoped lang="scss">
.layout {
	display: grid;
	grid-template-areas: "aside content";
	grid-template-columns: 290px auto;
	min-height: 100vh;
	background: var(--neutralLightGrey1);
}
.content {
	grid-area: content;
	display: flex;
	flex-direction: column;
	background-color: var(--greys-colors-100);
}

@media (max-width: 991.98px) {
	.layout {
		grid-template-columns: 0 auto;
	}
	.aside {
		display: none;
	}
}
</style>
