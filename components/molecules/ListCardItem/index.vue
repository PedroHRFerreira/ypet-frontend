<script lang="ts">
import { defineComponent, computed } from "vue";

type TypeColunm = {
	value: string;
	style?: Record<string, string>;
};

export default defineComponent({
	name: "MoleculesListCardItem",
	props: {
		data: {
			type: Array as PropType<TypeColunm[]>,
			required: true,
		},
		padding: {
			type: String,
			default: "0",
		},
	},
	setup(props) {
		const paginatedData = computed(() => {
			return props.data;
		});

		return {
			paginatedData,
		};
	},
});
</script>

<template>
	<div class="list-card-item">
		<div
			v-for="(column, key) in paginatedData"
			:key="key"
			class="list-card-item__content"
			:style="{ ...column.style }"
		>
			<slot :key="key" :name="column.value" />
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";

.list-card-item__content {
	padding: v-bind(padding);
}
</style>
