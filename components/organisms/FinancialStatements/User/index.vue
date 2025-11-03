<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFinancialStatementsStore } from "~/stores/financial-statements/useFinancialStatementsStore";

export default defineComponent({
	name: "OrganismsFinancialStatementsUser",

	setup() {
		const store = useFinancialStatementsStore();
		const currentYear = ref(new Date().getFullYear());

		const months = [
			{ number: 1, name: "Janeiro" },
			{ number: 2, name: "Fevereiro" },
			{ number: 3, name: "Março" },
			{ number: 4, name: "Abril" },
			{ number: 5, name: "Maio" },
			{ number: 6, name: "Junho" },
			{ number: 7, name: "Julho" },
			{ number: 8, name: "Agosto" },
			{ number: 9, name: "Setembro" },
			{ number: 10, name: "Outubro" },
			{ number: 11, name: "Novembro" },
			{ number: 12, name: "Dezembro" },
		];

		const loadMyStatements = async () => {
			await store.fetchMyStatements({
				per_page: 100,
				order_by_column: "year",
				order_by_direction: "desc",
			});
		};

		onMounted(() => {
			loadMyStatements();
		});

		const getStatementForMonth = (monthNumber: number) => {
			if (!store.statements || !Array.isArray(store.statements)) {
				return null;
			}
			return store.statements.find(
				(s) => s.month === monthNumber && s.year === currentYear.value,
			);
		};

		const handleDownload = async (uuid: string) => {
			await store.downloadStatement(uuid);
		};

		const handleYearChange = (direction: "prev" | "next") => {
			if (direction === "prev") {
				currentYear.value -= 1;
			}
			if (direction === "next") {
				currentYear.value += 1;
			}
		};

		return {
			store,
			months,
			currentYear,
			getStatementForMonth,
			handleDownload,
			handleYearChange,
		};
	},
});
</script>

<template>
	<div class="financial-statements-user">
		<div class="header">
			<AtomsTypography
				type="text-p2"
				text="Meus Extratos Mensais"
				weight="medium"
				color="var(--brand-color-dark-blue-900)"
			/>

			<div class="year-selector">
				<button class="year-btn" @click="handleYearChange('prev')">
					<span>←</span>
				</button>
				<AtomsTypography
					type="text-p3"
					:text="String(currentYear)"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
				<button class="year-btn" @click="handleYearChange('next')">
					<span>→</span>
				</button>
			</div>
		</div>

		<div v-if="store.isLoading" class="loading">
			<AtomsTypography
				type="text-p4"
				text="Carregando..."
				color="var(--brand-color-dark-blue-300)"
			/>
		</div>

		<div v-if="!store.isLoading" class="months-grid">
			<div v-for="month in months" :key="month.number" class="month-item">
				<div class="month-label">
					<AtomsTypography
						type="text-p4"
						:text="month.name"
						weight="medium"
						color="var(--brand-color-dark-blue-700)"
					/>
				</div>

				<div class="month-action">
					<template v-if="getStatementForMonth(month.number)">
						<button
							class="btn-link"
							@click="
								handleDownload(getStatementForMonth(month.number)?.uuid || '')
							"
						>
							<AtomsTypography
								type="text-p5"
								text="Abrir extrato"
								weight="medium"
								color="var(--brand-color-blue-500)"
							/>
						</button>
					</template>

					<template v-else>
						<AtomsTypography
							type="text-p5"
							text="Sem extrato"
							weight="regular"
							color="var(--brand-color-gray-400)"
						/>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.financial-statements-user {
	width: 100%;
	padding: 24px;
	background: var(--brand-color-white);
	border-radius: 8px;
	border: 1px solid var(--brand-color-gray-200);

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;

		.year-selector {
			display: flex;
			align-items: center;
			gap: 16px;

			.year-btn {
				width: 32px;
				height: 32px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--brand-color-gray-100);
				border: 1px solid var(--brand-color-gray-300);
				border-radius: 4px;
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background: var(--brand-color-gray-200);
				}

				span {
					font-size: 18px;
					color: var(--brand-color-dark-blue-700);
				}
			}
		}
	}

	.loading {
		padding: 40px;
		text-align: center;
	}

	.months-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;

		.month-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 12px 16px;
			background: var(--brand-color-gray-50);
			border-radius: 6px;
			border: 1px solid var(--brand-color-gray-200);

			.month-label {
				flex: 0 0 100px;
			}

			.month-action {
				flex: 1;
				display: flex;
				justify-content: flex-end;

				.btn-link {
					background: none;
					border: none;
					padding: 0;
					cursor: pointer;
					transition: opacity 0.2s;

					&:hover {
						opacity: 0.7;
					}
				}
			}
		}
	}

	.empty-state {
		padding: 60px 20px;
		text-align: center;
	}
}
</style>
