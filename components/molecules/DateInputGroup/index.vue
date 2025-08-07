<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "MoleculesDateInputGroup",
	props: {
		label: {
			type: String,
			default: "Data de nascimento",
		},
		modelValue: {
			type: Object as () => {
				day: string;
				month: string;
				year: string;
			},
			required: true,
		},
	},
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		const handleChange = (field: "day" | "month" | "year", value: string) => {
			emit("update:modelValue", {
				...props.modelValue,
				[field]: value,
			});
		};

		const days = Array.from({ length: 31 }, (_, i) =>
			String(i + 1).padStart(2, "0"),
		);
		const months = [
			"01",
			"02",
			"03",
			"04",
			"05",
			"06",
			"07",
			"08",
			"09",
			"10",
			"11",
			"12",
		];
		const years = Array.from({ length: 100 }, (_, i) =>
			String(new Date().getFullYear() - i),
		);

		return {
			handleChange,
			days,
			months,
			years,
		};
	},
});
</script>

<template>
	<div class="date-input-group">
		<label class="label">{{ label }}</label>
		<div class="fields">
			<select
				class="field select-day"
				:value="modelValue.day"
				@change="handleChange('day', $event.target.value)"
			>
				<option disabled value="">Dia</option>
				<option v-for="day in days" :key="day" :value="day">{{ day }}</option>
			</select>

			<select
				class="field select-month"
				:value="modelValue.month"
				@change="handleChange('month', $event.target.value)"
			>
				<option disabled value="">Mês</option>
				<option v-for="month in months" :key="month" :value="month">
					{{ month }}
				</option>
			</select>

			<select
				class="field select-year"
				:value="modelValue.year"
				@change="handleChange('year', $event.target.value)"
			>
				<option disabled value="">Ano</option>
				<option v-for="year in years" :key="year" :value="year">
					{{ year }}
				</option>
			</select>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
