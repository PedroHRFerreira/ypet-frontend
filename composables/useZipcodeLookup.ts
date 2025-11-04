import { ref } from "vue";

export type ZipcodeAddress = {
	zip_code: string;
	street: string;
	district: string;
	city: string;
	state: string; // UF, e.g., 'SP'
	complement?: string;
	unidade?: string;
	estado?: string; // full state name if available
	regiao?: string;
	ibge?: string;
	gia?: string;
	ddd?: string;
	siafi?: string;
};

export function useZipcodeLookup() {
	const isLoading = ref(false);
	const error = ref("");

	async function fetchAddress(cep: string): Promise<ZipcodeAddress | null> {
		const digits = (cep || "").replace(/\D/g, "");
		if (digits.length !== 8) return null;

		isLoading.value = true;
		error.value = "";

		try {
			const data: any = await $fetch(
				`https://viacep.com.br/ws/${digits}/json/`,
			);
			if (data?.erro) {
				error.value = "CEP não encontrado.";
				return null;
			}

			return {
				zip_code: digits,
				street: data?.logradouro || "",
				district: data?.bairro || "",
				city: data?.localidade || "",
				state: data?.uf || "",
				complement: data?.complemento || "",
				unidade: data?.unidade || "",
				estado: data?.estado || "",
				regiao: data?.regiao || "",
				ibge: data?.ibge || "",
				gia: data?.gia || "",
				ddd: data?.ddd || "",
				siafi: data?.siafi || "",
			} as ZipcodeAddress;
		} catch {
			error.value = "Erro ao buscar CEP.";
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	return { isLoading, error, fetchAddress };
}
