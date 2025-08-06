import { reactive } from "vue";

export const useForm = (params: string[] = []) => {
	const form = reactive<Record<string, FormFieldType>>({});

	if (params.length == 0) {
		return form;
	}

	params.forEach((param) => {
		form[param] = {
			value: null,
			errorMessages: [],
		};
	});

	return form;
};
