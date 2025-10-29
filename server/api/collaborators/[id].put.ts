import { apiPut } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const path = `/collaborators/${id}`;

		// Detecta o tipo de conteúdo e monta payload adequadamente
		const contentType = getRequestHeader(event, "content-type") || "";
		let payload: Record<string, any> = {};

		if (
			contentType.includes("multipart/form-data") ||
			contentType.includes("application/x-www-form-urlencoded")
		) {
			const formData = await readFormData(event);
			for (const [key, value] of formData.entries()) {
				const maybeFile = value as any;
				const isFile =
					maybeFile &&
					typeof maybeFile === "object" &&
					"name" in maybeFile &&
					"size" in maybeFile &&
					"type" in maybeFile;
				const normalized = isFile
					? {
							filename: maybeFile.name,
							size: maybeFile.size,
							type: maybeFile.type,
						}
					: value;

				if (payload[key] !== undefined) {
					payload[key] = Array.isArray(payload[key])
						? [...payload[key], normalized]
						: [payload[key], normalized];
				} else {
					payload[key] = normalized;
				}
			}
		} else {
			payload = (await readBody(event)) || {};
		}

		return await apiPut<IResponse>(path, event, payload);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao atualizar",
			data: error,
		} as IResponse;
	}
});
