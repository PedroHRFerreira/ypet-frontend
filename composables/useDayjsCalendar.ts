import calendar from "dayjs/plugin/calendar";
import dayjs, { locale, extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ptBR from "dayjs/locale/pt-br";

locale(ptBR);
extend(relativeTime);
extend(utc);
extend(timezone);
extend(calendar);
dayjs.tz.setDefault("America/Sao_Paulo");

export function useDayjsCalendar() {
	const formatDate = (value: string | Date | undefined): string => {
		if (!value) return "";

		const rule = {
			sameDay: "[Hoje] dddd",
			nextDay: "dddd DD [de] MMMM",
			nextWeek: "DD [de] MMMM",
			lastDay: "[Ontem] HH:mm",
			lastWeek: "DD [de] MMMM",
			sameElse: "DD/MM/YYYY",
		};

		return dayjs(value).tz("America/Sao_Paulo").calendar(undefined, rule);
	};

	return { formatDate };
}
