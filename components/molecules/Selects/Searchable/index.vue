<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "MoleculesSelectsSearchable",
	props: {
		state: {
			type: String,
			default: "default",
			validator: (value: string) =>
				["default", "activated", "filled", "error", "disabled"].includes(value),
		},
		label: {
			type: String,
			default: "",
		},
		options: {
			type: Array as PropType<IOption[]>,
			default: () => [] as IOption[],
		},
		messageError: {
			type: String,
			default: null,
		},
		maxWidth: {
			type: String,
			default: "100%",
		},
		maxHeight: {
			type: String,
			default: "400px",
		},
		placeholderText: {
			type: String,
			default: "Selecione",
		},
		searchPlaceholder: {
			type: String,
			default: "Buscar...",
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["item-selected", "search"],
	setup(props, { emit }) {
		const isStateActivated = ref(false);
		const isFilled = ref(false);
		const status = ref("default");
		const optionsData = ref([] as IOption[]);
		const option = ref({} as IOption);
		const wrapper = ref<HTMLElement | null>(null);
		const searchQuery = ref("");

		const isMessageError = computed(() => {
			return !!props.messageError;
		});

		const isDisabled = computed(() => {
			return props.state === "disabled";
		});

		const isOptionSelected = computed(() => {
			const optionEmpty = Object.keys(option.value).length === 0;
			const optionIdEmpty = option.value.id === "";
			return !optionEmpty && !optionIdEmpty;
		});

		const filteredOptions = computed(() => {
			if (!searchQuery.value) {
				return optionsData.value;
			}
			const query = searchQuery.value.toLowerCase();
			return optionsData.value.filter((opt) =>
				opt.text.toLowerCase().includes(query),
			);
		});

		const handleClickOutside = (event: MouseEvent) => {
			if (wrapper.value && !wrapper.value.contains(event.target as Node)) {
				isStateActivated.value = false;
				searchQuery.value = "";
			}
		};

		const handleStateActivated = (): void => {
			if (isDisabled.value) {
				return;
			}

			const isCurrentlyActivated = status.value === "activated";
			isStateActivated.value = !isCurrentlyActivated;

			if (isCurrentlyActivated) {
				const hasOptionSelected = option.value?.id !== "";
				status.value = hasOptionSelected ? "filled" : "default";
				searchQuery.value = "";
				return;
			}

			status.value = "activated";
		};

		const handleOptionSelected = (opt: IOption) => {
			const isOptionSelectedEqualOldOption = option?.value?.id === opt.id;
			updateOptionsDataWithOptionSelected(opt);
			emit("item-selected", opt);
			if (isOptionSelectedEqualOldOption) {
				return removeOptionSelected();
			}
			return addOptionSelected(opt);
		};

		const updateOptionsDataWithOptionSelected = (selectedOption: IOption) => {
			const options = props.options.map((opt) => {
				const item = opt as IOption;
				return {
					...item,
					state: item.id === selectedOption.id ? "activated" : "default",
				};
			});
			optionsData.value = options as IOption[];
		};

		const removeOptionSelected = (): void => {
			status.value = "default";
			isFilled.value = false;
			option.value = {} as IOption;
			searchQuery.value = "";
		};

		const addOptionSelected = (opt: IOption): void => {
			isFilled.value = true;
			handleStateActivated();
			option.value = opt;
			searchQuery.value = "";
		};

		const handleSearch = (value: string) => {
			searchQuery.value = value;
			emit("search", value);
		};

		onMounted(() => {
			document.addEventListener("click", handleClickOutside);
		});

		onBeforeUnmount(() => {
			document.removeEventListener("click", handleClickOutside);
		});

		return {
			handleStateActivated,
			handleOptionSelected,
			handleSearch,
			isStateActivated,
			isOptionSelected,
			isMessageError,
			filteredOptions,
			optionsData,
			isDisabled,
			searchQuery,
			isFilled,
			wrapper,
			option,
			status,
		};
	},
	watch: {
		options: {
			handler(newOptions: IOption[]) {
				this.optionsData = newOptions.map((opt: IOption) => {
					const item = opt as IOption;
					if (item.state === "activated") {
						this.option = { ...item, state: "default" };
						this.isFilled = true;
					}
					return { ...item };
				});

				const isAllOptionsDefault = this.optionsData.every(
					(opt: IOption) => opt.state === "default",
				);

				if (isAllOptionsDefault) {
					this.option = {} as IOption;
					this.isFilled = false;
				}
			},
			deep: true,
			immediate: true,
		},
	},
});
</script>

<template>
	<div ref="wrapper" class="wrapper-selects-searchable anim-loading">
		<div :class="['selects-searchable', state, { error: isMessageError }]">
			<div class="selects-searchable__box-label">
				<AtomsTypography
					type="text-p5"
					weight="medium"
					:text="label"
					color="var(--brand-color-dark-blue-600)"
				/>
			</div>
			<div
				:class="['selects-searchable__box-text', { error: isMessageError }]"
				@click="handleStateActivated"
			>
				<div
					:class="[
						'selects-searchable__box-text--content',
						{ error: isMessageError },
					]"
				>
					<AtomsDropdownItem
						v-if="isOptionSelected"
						:text="option.text"
						:state="option.state"
					/>
					<div v-else class="placeholder">
						<AtomsTypography
							type="text-p5"
							weight="regular"
							:text="placeholderText"
							color="var(--brand-color-dark-blue-200)"
						/>
					</div>
				</div>
				<div class="selects-searchable__box-text--icon">
					<AtomsIcon
						v-show="isStateActivated"
						filled
						name="chevron-up"
						width="20px"
						height="20px"
						current-color="var(--greys-colors-800)"
					/>
					<AtomsIcon
						v-show="!isStateActivated"
						filled
						name="chevron-down"
						width="20px"
						height="20px"
						current-color="var(--greys-colors-800)"
					/>
				</div>
			</div>
			<div v-if="isMessageError" class="error">
				<AtomsTypography
					type="text-p6"
					weight="regular"
					:text="messageError"
					color="var(--danger-colors-700)"
				/>
			</div>
		</div>
		<div v-if="isStateActivated" class="wrapper-selects-searchable__dropdown">
			<div class="search-box">
				<MoleculesInputCommon
					:value="searchQuery"
					:placeholder="searchPlaceholder"
					@on-input="handleSearch"
				/>
			</div>
			<div class="options-list">
				<div v-if="isLoading" class="loading">
					<AtomsTypography
						type="text-p5"
						weight="regular"
						text="Carregando..."
						color="var(--brand-color-dark-blue-400)"
					/>
				</div>
				<div v-else-if="filteredOptions.length === 0" class="no-results">
					<AtomsTypography
						type="text-p5"
						weight="regular"
						text="Nenhum resultado encontrado"
						color="var(--brand-color-dark-blue-400)"
					/>
				</div>
				<AtomsDropdownItem
					v-for="(opt, index) in filteredOptions"
					v-else
					:key="index"
					:text="opt?.text"
					:state="opt?.state"
					@on-click="handleOptionSelected(opt)"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.wrapper-selects-searchable {
	max-width: v-bind(maxWidth);
	width: v-bind(maxWidth);
	position: relative;

	.selects-searchable {
		display: flex;
		flex-direction: column;
		gap: 8px;

		&__box-label {
			display: flex;
			align-items: center;
		}

		&__box-text {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 1px solid var(--brand-color-dark-blue-200);
			border-radius: 8px;
			padding: 12px 16px;
			cursor: pointer;
			transition: all 0.2s ease;
			background-color: var(--white);

			&:hover {
				border-color: var(--brand-color-dark-blue-400);
			}

			&.error {
				border-color: var(--danger-colors-700);
			}

			&--content {
				flex: 1;
			}

			&--icon {
				display: flex;
				align-items: center;
			}
		}

		.placeholder {
			padding: 0;
		}

		.error {
			margin-top: 4px;
		}
	}

	&__dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--white);
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		max-height: v-bind(maxHeight);
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.search-box {
			padding: 12px;
			border-bottom: 1px solid var(--brand-color-dark-blue-100);
		}

		.options-list {
			overflow-y: auto;
			max-height: 300px;
		}

		.loading,
		.no-results {
			padding: 16px;
			text-align: center;
		}
	}
}
</style>
