// ~/plugins/global-mixins.ts
import { defineNuxtPlugin } from "#app";
import { useDayjs } from "~/composables/useDayjs";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.mixin({
		methods: {
			$formatDate(
				date: string | number | Date | undefined,
				template = "DD/MM/YYYY",
			): string {
				if (!date) return "---";

				const d = useDayjs(date);

				return d.format(template);
			},
			$formatDateTime(
				date: string | number | Date | undefined,
				template = "DD/MM/YYYY [às] HH:mm",
			): string {
				return this.$formatDate(date, template);
			},
			$formatDateTimeFromNow(date: string | number | Date | undefined): string {
				if (!date) return "---";

				const d = useDayjs(date);

				return d.fromNow();
			},
			$booleanToSimNao(value: boolean | undefined): string {
				if (value === undefined) return "---";

				return value ? "Sim" : "Não";
			},
		},
	});
});
