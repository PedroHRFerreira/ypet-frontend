<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "MoleculesSelectsSimple",
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
		message: {
			type: String,
			default: null,
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
		currentColor: {
			type: String,
			default: "var(--greys-colors-900)",
		},
		placeholderPadding: {
			type: String,
			default: "16px",
		},
		placeholderText: {
			type: String,
			default: "Selecione",
		},
	},
	emits: ["item-selected"],
	setup(props, { emit }) {
		const isStateActivated = ref(false);
		const isFilled = ref(false);
		const status = ref("default");
		const optionsData = ref([] as IOption[]);
		const option = ref({} as IOption);
		const wrapper = ref<HTMLElement | null>(null);
		const isMessageError = computed(() => {
			return !!props.messageError;
		});
		const isMessage = computed(() => {
			return !!props.message;
		});
		const isDisabled = computed(() => {
			return props.state === "disabled";
		});
		const isOptionSelected = computed(() => {
			const optionEmpty = Object.keys(option.value).length === 0;
			const optionIdEmpty = option.value.id === "";
			return !optionEmpty && !optionIdEmpty;
		});

		const handleClickOutside = (event: MouseEvent) => {
			if (wrapper.value && !wrapper.value.contains(event.target as Node)) {
				isStateActivated.value = false;
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

		const updateOptionsDataWithOptionSelected = (option: IOption) => {
			const options = props.options.map((opt) => {
				const item = opt as IOption;
				return {
					...item,
					state: item.id === option.id ? "activated" : "default",
				};
			});
			optionsData.value = options as IOption[];
		};

		const removeOptionSelected = (): void => {
			status.value = "default";
			isFilled.value = false;
			option.value = {} as IOption;
		};

		const addOptionSelected = (opt: IOption): void => {
			isFilled.value = true;
			handleStateActivated();
			option.value = opt;
		};

		watch(
			() => props.options,
			(newOptions) => {
				optionsData.value = newOptions.map((opt) => {
					const item = opt as IOption;
					if (item.state === "activated") {
						option.value = { ...item, state: "default" };
						isFilled.value = true;
					}
					return { ...item };
				});

				const isAllOptionsDefault = optionsData.value.every(
					(opt) => opt.state === "default",
				);

				if (isAllOptionsDefault) {
					option.value = {} as IOption;
					isFilled.value = false;
				}
			},
			{ immediate: true },
		);

		onMounted(() => {
			document.addEventListener("click", handleClickOutside);
		});
		onBeforeUnmount(() => {
			document.removeEventListener("click", handleClickOutside);
		});

		return {
			handleStateActivated,
			handleOptionSelected,
			isStateActivated,
			isOptionSelected,
			isMessageError,
			optionsData,
			isDisabled,
			isMessage,
			isFilled,
			wrapper,
			option,
			status,
		};
	},
});
</script>
<template>
	<div ref="wrapper" class="wrapper-selects-simple anim-loading">
		<div :class="['selects-simple', state, { error: isMessageError }]">
			<div class="selects-simple__box-label">
				<AtomsTypography
					type="text-p5"
					weight="medium"
					:text="label"
					color="var(--brand-color-dark-blue-600)"
				/>
			</div>
			<div
				:class="['selects-simple__box-text', { error: isMessageError }]"
				@click="handleStateActivated"
			>
				<div
					:class="[
						'selects-simple__box-text--content',
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
				<div class="selects-simple__box-text--icon">
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
		<div v-if="isStateActivated" class="wrapper-selects-simple__dropdown">
			<AtomsDropdownItem
				v-for="(opt, index) in optionsData"
				:key="index"
				:text="opt?.text"
				:state="opt?.state"
				@on-click="handleOptionSelected(opt)"
			/>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";
.wrapper-selects-simple {
	max-width: v-bind(maxWidth);
	width: v-bind(maxWidth);
	max-height: v-bind(maxHeight);

	.placeholder {
		color: v-bind(currentColor);
		padding: v-bind(placeholderPadding);
	}

	&__box-text {
		border-color: v-bind(currentColor);
	}
}
</style>
