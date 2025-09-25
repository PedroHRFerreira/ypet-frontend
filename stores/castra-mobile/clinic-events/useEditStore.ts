import { useForm } from "~/composables/useForm";

export const useEditStore = defineStore("clinic-event-edit", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const form = useForm([
			"name",
			"description",
			"location",
			"start_date",
			"end_date",
			"status",
			"species",
			"gender",
			"max_registrations",
		]);

		return {
			form,
			isLoading,
			errorMessage,
			successMessage,
		};
	},
	actions: {
		async update(id: number | string): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			const formData = this.getFormJson();

			await useFetch(`/api/clinic-events/${id}`, {
				method: "PUT",
				body: formData,
				headers: {
					"Content-Type": "multipart/form-data",
					Accept: "multipart/form-data",
				},
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage = result.message || "Event updated successfully.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = response._data.message;
						return;
					}

					this.errorMessage = response._data.message;
				},
			});
		},
		setFormField(field: string, value: any): void {
			this.form[field].value = value;
			this.setFormError(field, []);
		},
		setFormError(field: string, errorMessages: string[]): void {
			this.form[field].errorMessages = errorMessages;
		},
		getFormJson(): Record<string, any> {
			const json: Record<string, any> = {};
			for (const key in this.form) {
				if (Object.prototype.hasOwnProperty.call(this.form, key)) {
					const value = this.form[key].value as string | IOption;

					if (value === null || value === undefined) {
						continue;
					}
					if (typeof value === "object") {
						if (Object.prototype.hasOwnProperty.call(value, "id")) {
							json[key] = value.id;
							continue;
						}
					}

					json[key] = value;
				}
			}

			return json;
		},
		resetForm() {
			for (const key in this.form) {
				if (Object.prototype.hasOwnProperty.call(this.form, key)) {
					this.form[key].value = null;
					this.form[key].errorMessages = [];
				}
			}
			this.errorMessage = "";
			this.successMessage = "";
		},
	},
});
