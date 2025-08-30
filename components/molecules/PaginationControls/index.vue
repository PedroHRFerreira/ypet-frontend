<template>
	<div class="pagination-controls">
		<div class="info">
			<span>Mostrando</span>
			<select
				v-if="totalItems > 10"
				v-model="selectedPerPage"
				@change="emitPerPage"
			>
				<option v-for="option in perPageOptions" :key="option" :value="option">
					{{ option }}
				</option>
			</select>
			<span v-if="totalItems > 10">de {{ totalItems }}</span>
			<span v-else>{{ totalItems }} itens</span>
		</div>

		<div class="pages">
			<button
				v-for="page in totalPages"
				:key="page"
				:class="{ active: currentPage === page }"
				@click="emitPageChange(page)"
			>
				{{ page }}
			</button>
			<button
				v-if="currentPage < totalPages"
				@click="emitPageChange(currentPage + 1)"
			>
				Próximo
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";

export default defineComponent({
	name: "MoleculesPaginationControls",
	props: {
		totalItems: {
			type: Number,
			required: true,
		},
		currentPage: {
			type: Number,
			required: true,
		},
		perPage: {
			type: Number,
			required: true,
		},
		perPageOptions: {
			type: Array as PropType<number[]>,
			default: () => [10, 25, 50],
		},
	},
	emits: ["pageChange", "perPageChange"],
	setup(props, { emit }) {
		const selectedPerPage = ref(props.perPage);

		const totalPages = computed(() =>
			Math.ceil(props.totalItems / selectedPerPage.value),
		);

		watch(selectedPerPage, (val) => {
			emit("perPageChange", val);
		});

		const emitPageChange = (page: number) => {
			emit("pageChange", page);
		};

		const emitPerPage = () => {
			emit("perPageChange", selectedPerPage.value);
		};

		return {
			selectedPerPage,
			totalPages,
			emitPageChange,
			emitPerPage,
		};
	},
});
</script>

<style lang="scss">
.pagination-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 0;
	font-size: 0.95rem;
	color: #94a3b8;

	.info {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		select {
			border: none;
			background: transparent;
			font-weight: bold;
			color: #94a3b8;
			cursor: pointer;

			&:focus {
				outline: none;
			}
		}
	}

	.pages {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		button {
			background: transparent;
			border: none;
			color: #64748b;
			padding: 6px 12px;
			border-radius: 6px;
			cursor: pointer;

			&.active {
				background: #3b82f6;
				color: white;
				font-weight: bold;
			}
		}
	}
}
</style>
