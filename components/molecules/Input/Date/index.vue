<script lang="ts">
import { defineComponent, computed } from "vue";
import AtomsDatePicker from "~/components/atoms/DatePicker/Index.vue";

type Model = string | Date | null;

function toYMD(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function parseToDate(value: string | Date): Date | null {
	if (value instanceof Date) {
		return isNaN(value.getTime()) ? null : value;
	}
	if (typeof value === "string" && value.trim() !== "") {
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			const [y, m, d] = value.split("-").map(Number);
			const dt = new Date(y, (m as number) - 1, d);
			return isNaN(dt.getTime()) ? null : dt;
		}
		const dt = new Date(value);
		return isNaN(dt.getTime()) ? null : dt;
	}
	return null;
}

export default defineComponent({
	name: "MoleculesInputDate",
	components: { AtomsDatePicker },
	props: {
		modelValue: {
			type: [String, Date, null] as unknown as () => Model,
			default: null,
		},
		label: {
			type: String,
			default: "Data",
		},
		name: {
			type: String,
			default: "date",
		},
		placeholder: {
			type: String,
			default: "",
		},
		min: {
			type: String,
			default: "",
		},
		max: {
			type: String,
			default: "",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		required: {
			type: Boolean,
			default: false,
		},
		errorMessages: {
			type: Array as () => string[],
			default: () => [],
		},
		outputAsDate: {
			type: Boolean,
			default: false,
		},
		id: {
			type: String,
			default: "",
		},
		width: {
			type: String,
			default: "100%",
		},
	},
	emits: ["update:modelValue", "blur", "focus", "change"],
	setup(props, { emit }) {
		const uid = computed(() => props.id || `date-input-${props.name}`);

		const dateValue = computed<Date | null>({
			get() {
				return parseToDate(props.modelValue as string | Date);
			},
			set(v: Date | null) {
				if (props.outputAsDate) {
					emit("update:modelValue", v ?? null);
					emit("change", v);
				} else {
					const out = v ? toYMD(v) : "";
					emit("update:modelValue", out);
					emit("change", out);
				}
			},
		});

		const hasError = computed(() => props.errorMessages.length > 0);
		const describedBy = computed(() =>
			hasError.value ? `${uid.value}-errors` : undefined,
		);

		function onBlur(e: FocusEvent) {
			emit("blur", e);
		}
		function onFocus(e: FocusEvent) {
			emit("focus", e);
		}

		return {
			uid,
			dateValue,
			hasError,
			describedBy,
			onBlur,
			onFocus,
		};
	},
});
</script>

<template>
	<div
		class="date-input"
		:class="{ 'date-input--error': hasError, 'date-input--disabled': disabled }"
	>
		<label class="date-input__label" :for="uid">
			{{ label }}
			<span v-if="required" aria-hidden="true" class="date-input__required"
				>*</span
			>
		</label>

		<AtomsDatePicker
			v-model="dateValue"
			:placeholder="placeholder || 'XX/XX/XXXX'"
		/>

		<ul v-if="hasError" :id="`${uid}-errors`" class="date-input__errors">
			<li v-for="(err, i) in errorMessages" :key="i">{{ err }}</li>
		</ul>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
.date-input {
	width: v-bind(width);
}
</style>
