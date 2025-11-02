<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFinancialStatementsStore } from "~/stores/financial-statements/useFinancialStatementsStore";

export default defineComponent({
	name: "OrganismsFinancialStatementsAdmin",

	props: {
		entityType: {
			type: String as () => "Collaborator" | "Veterinarian" | "Supplier",
			required: true,
		},
		entityId: {
			type: [Number, String],
			required: true,
		},
	},

	setup(props) {
		const store = useFinancialStatementsStore();
		const selectedYear = ref(new Date().getFullYear());
		const uploadingMonth = ref<number | null>(null);
		const selectedFile = ref<File | null>(null);

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

		const loadMonthsStatus = async () => {
			await store.fetchStatements({
				statementable_type: props.entityType,
				statementable_id: props.entityId,
				year: selectedYear.value,
			});
		};

		onMounted(() => {
			loadMonthsStatus();
		});

		const getMonthStatus = (monthNumber: number) => {
			const monthData = store.monthsStatus.find((m) => m.month === monthNumber);
			return monthData || null;
		};

		const handleFileSelect = (month: number, event: Event) => {
			const input = event.target as HTMLInputElement;
			const file = input.files?.[0];

			if (!file) return;

			if (file.type !== "application/pdf") {
				alert("Apenas arquivos PDF são permitidos");
				return;
			}

			if (file.size > 10 * 1024 * 1024) {
				alert("Arquivo muito grande. Tamanho máximo: 10MB");
				return;
			}

			selectedFile.value = file;
			uploadFile(month, file);
		};

		const uploadFile = async (month: number, file: File) => {
			uploadingMonth.value = month;

			const response = await store.uploadStatement({
				statementable_type: props.entityType,
				statementable_id: props.entityId,
				year: selectedYear.value,
				month,
				file,
			});

			if (response?.status === 201) {
				await loadMonthsStatus();
			}

			uploadingMonth.value = null;
			selectedFile.value = null;
		};

		const handleDownload = async (uuid: string) => {
			await store.downloadStatement(uuid);
		};

		const handleYearChange = (direction: "prev" | "next") => {
			if (direction === "prev") {
				selectedYear.value -= 1;
			}
			if (direction === "next") {
				selectedYear.value += 1;
			}
			loadMonthsStatus();
		};

		return {
			store,
			months,
			selectedYear,
			uploadingMonth,
			getMonthStatus,
			handleFileSelect,
			handleDownload,
			handleYearChange,
		};
	},
});
</script>

<template>
	<div class="financial-statements-admin">
		<div class="header">
			<AtomsTypography
				type="text-p2"
				text="Histórico de Extratos Mensais"
				weight="medium"
				color="var(--brand-color-dark-blue-900)"
			/>

			<div class="year-selector">
				<button class="year-btn" @click="handleYearChange('prev')">
					<span>←</span>
				</button>
				<AtomsTypography
					type="text-p3"
					:text="String(selectedYear)"
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
					<template v-if="getMonthStatus(month.number)?.status === 'available'">
						<button
							class="btn-link"
							@click="
								handleDownload(
									getMonthStatus(month.number)?.statement?.uuid || '',
								)
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
						<label class="btn-upload">
							<input
								type="file"
								accept=".pdf,application/pdf"
								hidden
								:disabled="uploadingMonth === month.number"
								@change="handleFileSelect(month.number, $event)"
							/>
							<AtomsTypography
								v-if="uploadingMonth !== month.number"
								type="text-p5"
								text="Adicionar extrato"
								weight="medium"
								color="var(--brand-color-blue-500)"
							/>
							<AtomsTypography
								v-if="uploadingMonth === month.number"
								type="text-p5"
								text="Enviando..."
								weight="medium"
								color="var(--brand-color-blue-300)"
							/>
						</label>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.financial-statements-admin {
	display: flex;
	width: 100%;
	padding: 28px 60px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 24px;
	border-radius: 4px;
	background: var(
		--white,
		linear-gradient(
			0deg,
			rgba(255, 255, 255, 0.2) 0%,
			rgba(255, 255, 255, 0.2) 100%
		),
		#fff
	);
	box-shadow: 0 1px 0 0 rgba(17, 17, 17, 0.08);

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-self: stretch;
		width: 100%;

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
		align-self: stretch;
		width: 100%;

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

				.btn-upload {
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
}
</style>
