<script lang="ts">
import { defineComponent, ref } from "vue";

type ActionType = {
	value: string;
	label: string;
	icon?: string;
};

export default defineComponent({
	name: "MoleculesActionDropdown",
	directives: {
		clickOutside: {
			mounted(el, binding) {
				const onClick = (e: Event) => {
					if (!el.contains(e.target as Node)) {
						binding.value();
					}
				};
				document.addEventListener("click", onClick);
				el._clickOutside = onClick;
			},
			unmounted(el) {
				document.removeEventListener("click", el._clickOutside);
			},
		},
	},
	props: {
		actions: {
			type: Array as () => ActionType[],
			default: () => [
				{ value: "details", label: "Detalhes", icon: "info" },
				{ value: "edit", label: "Editar", icon: "edit" },
				{ value: "delete", label: "Excluir", icon: "trash" },
			],
		},
		labelButton: {
			type: String,
			default: "Opções",
		},
	},
	emits: ["changeAction"],
	setup(_, { expose }) {
		const isOpen = ref(false);

		const toggleDropdown = () => {
			isOpen.value = !isOpen.value;
		};

		const closeDropdown = () => {
			isOpen.value = false;
		};

		expose({ closeDropdown });

		const clickOutside = {
			mounted(el: HTMLElement, binding: any) {
				const onClick = (e: Event) => {
					if (!el.contains(e.target as Node)) {
						binding.value();
					}
				};
				document.addEventListener("click", onClick);
				el._clickOutside = onClick;
			},
			unmounted(el: HTMLElement) {
				document.removeEventListener("click", el._clickOutside);
			},
		};

		return {
			isOpen,
			toggleDropdown,
			closeDropdown,
			vClickOutside: clickOutside,
		};
	},
});
</script>

<template>
	<div v-click-outside="closeDropdown" class="action-dropdown">
		<button class="dropdown-toggle" @click="toggleDropdown">
			<slot name="button">
				{{ labelButton }}
				<span class="chevron">▾</span>
			</slot>
		</button>

		<ul v-if="isOpen" class="dropdown-menu">
			<slot name="items">
				<li
					v-for="(action, index) in actions"
					:key="index"
					@click="$emit('changeAction', action.value)"
				>
					{{ action.label }}
				</li>
			</slot>
		</ul>
	</div>
</template>

<style lang="scss">
@use "styles.module";
</style>
