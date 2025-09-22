<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
	name: "LayoutsDefault",
	setup() {
		const showMobileMenu = ref(false);

		const openMobileMenu = () => (showMobileMenu.value = true);
		const closeMobileMenu = () => (showMobileMenu.value = false);

		return { showMobileMenu, openMobileMenu, closeMobileMenu };
	},
});
</script>
<template>
	<main class="layout">
		<aside class="aside">
			<OrganismsSidebarNav />
		</aside>
		<div class="content">
			<OrganismsHeader @menu="openMobileMenu" />
			<slot />
		</div>

		<div
			v-if="showMobileMenu"
			class="mobile-menu__overlay"
			@click="closeMobileMenu"
		/>
		<nav class="mobile-menu" :class="{ open: showMobileMenu }">
			<OrganismsSidebarNav @onclick="closeMobileMenu" />
		</nav>
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

	.mobile-menu__overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 5;
	}
	.mobile-menu {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 290px;
		background: var(--white);
		transform: translateX(-100%);
		transition: transform 0.25s ease-in-out;
		z-index: 20;
	}
	.mobile-menu.open {
		transform: translateX(0);
	}
}
</style>
