import { defineStore } from "pinia";

interface State {
	statements: IFinancialStatement[];
	monthsStatus: IFinancialStatementMonth[];
	currentYear: number;
	isLoading: boolean;
	isUploading: boolean;
	uploadProgress: number;
}

export const useFinancialStatementsStore = defineStore("financial-statements", {
	state: (): State => ({
		statements: [],
		monthsStatus: [],
		currentYear: new Date().getFullYear(),
		isLoading: false,
		isUploading: false,
		uploadProgress: 0,
	}),

	actions: {
		/**
		 * Busca lista de extratos de uma entidade
		 */
		async fetchStatements(params: IFinancialStatementListParams) {
			this.isLoading = true;
			try {
				const queryParams = new URLSearchParams();
				queryParams.append("statementable_type", params.statementable_type);
				queryParams.append("statementable_id", String(params.statementable_id));

				if (params.year) queryParams.append("year", String(params.year));
				if (params.per_page)
					queryParams.append("per_page", String(params.per_page));
				if (params.order_by_column)
					queryParams.append("order_by_column", params.order_by_column);
				if (params.order_by_direction)
					queryParams.append("order_by_direction", params.order_by_direction);

				const response = await $fetch<IResponse>(
					`/api/financial-statements?${queryParams.toString()}`,
				);

				if (response.status === 200 && response.data) {
					// Se tem year, é lista de meses
					if (params.year) {
						const monthsData = response.data.data || response.data;
						if (Array.isArray(monthsData)) {
							this.monthsStatus = monthsData;
							return monthsData;
						}
					}

					// Se não tem year, é lista paginada
					if (response.data.data) {
						this.statements = response.data.data;
						return response.data;
					}
				}

				return null;
			} catch {
				return null;
			} finally {
				this.isLoading = false;
			}
		},

		/**
		 * Busca extratos do usuário autenticado
		 */
		async fetchMyStatements(params?: {
			per_page?: number;
			order_by_column?: string;
			order_by_direction?: "asc" | "desc";
		}) {
			this.isLoading = true;
			try {
				const queryParams = new URLSearchParams();
				if (params?.per_page)
					queryParams.append("per_page", String(params.per_page));
				if (params?.order_by_column)
					queryParams.append("order_by_column", params.order_by_column);
				if (params?.order_by_direction)
					queryParams.append("order_by_direction", params.order_by_direction);

				const response = await $fetch<IResponse>(
					`/api/auth/me/financial-statements?${queryParams.toString()}`,
				);

				if (response.status === 200 && response.data) {
					// Backend retorna estrutura aninhada: response.data.data.data.data
					const paginatedData = response.data.data?.data?.data;
					if (paginatedData && Array.isArray(paginatedData)) {
						this.statements = paginatedData;
					} else if (
						response.data.data?.data &&
						Array.isArray(response.data.data.data)
					) {
						this.statements = response.data.data.data;
					} else if (response.data.data && Array.isArray(response.data.data)) {
						this.statements = response.data.data;
					} else {
						this.statements = [];
					}
					return response.data;
				}

				this.statements = [];
				return null;
			} catch {
				this.statements = [];
				return null;
			} finally {
				this.isLoading = false;
			}
		},

		/**
		 * Faz upload de um extrato financeiro
		 */
		async uploadStatement(data: IFinancialStatementUpload) {
			this.isUploading = true;
			this.uploadProgress = 0;

			try {
				const formData = new FormData();
				formData.append("statementable_type", data.statementable_type);
				formData.append("statementable_id", String(data.statementable_id));
				formData.append("year", String(data.year));
				formData.append("month", String(data.month));
				formData.append("file", data.file);

				const response = await $fetch<IResponse>("/api/financial-statements", {
					method: "POST",
					body: formData,
				});

				if (response.status === 201) {
					this.uploadProgress = 100;
					return response;
				}

				return null;
			} catch {
				return null;
			} finally {
				this.isUploading = false;
				setTimeout(() => {
					this.uploadProgress = 0;
				}, 1000);
			}
		},

		/**
		 * Busca URL de download de um extrato
		 */
		async getDownloadUrl(uuid: string) {
			try {
				const response = await $fetch<IResponse>(
					`/api/financial-statements/${uuid}/download`,
				);

				if (response.status === 200 && response.data) {
					return response.data;
				}

				return null;
			} catch {
				return null;
			}
		},

		/**
		 * Remove um extrato financeiro
		 */
		async deleteStatement(uuid: string) {
			try {
				const response = await $fetch<IResponse>(
					`/api/financial-statements/${uuid}`,
					{
						method: "DELETE",
					},
				);

				if (response.status === 200) {
					// Remove da lista local
					this.statements = this.statements.filter((s) => s.uuid !== uuid);
					return response;
				}

				return null;
			} catch {
				return null;
			}
		},

		/**
		 * Faz download de um extrato
		 */
		async downloadStatement(uuid: string) {
			const downloadData = await this.getDownloadUrl(uuid);

			if (downloadData?.data?.download_url) {
				window.open(downloadData.data.download_url, "_blank");
				return true;
			}

			return false;
		},

		/**
		 * Define o ano atual para visualização
		 */
		setCurrentYear(year: number) {
			this.currentYear = year;
		},

		/**
		 * Limpa os dados da store
		 */
		clearStore() {
			this.statements = [];
			this.monthsStatus = [];
			this.currentYear = new Date().getFullYear();
			this.isLoading = false;
			this.isUploading = false;
			this.uploadProgress = 0;
		},
	},

	getters: {
		/**
		 * Retorna se há extratos carregados
		 */
		hasStatements(): boolean {
			return this.statements.length > 0;
		},

		/**
		 * Retorna se há status de meses carregados
		 */
		hasMonthsStatus(): boolean {
			return this.monthsStatus.length > 0;
		},

		/**
		 * Retorna meses com extrato disponível
		 */
		availableMonths(): IFinancialStatementMonth[] {
			return this.monthsStatus.filter((m) => m.status === "available");
		},

		/**
		 * Retorna meses sem extrato
		 */
		unavailableMonths(): IFinancialStatementMonth[] {
			return this.monthsStatus.filter((m) => m.status === "unavailable");
		},
	},
});
