import dayjs, { locale, extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ptBR from "dayjs/locale/pt-br";

locale(ptBR);
extend(relativeTime);
extend(utc);
extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");

export const useDayjs = dayjs;
