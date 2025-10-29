declare global {
	/**
	 * Formulário de alteração de senha do usuário autenticado
	 * Usado na tela de configurações para alterar a senha
	 */
	interface IPasswordChange {
		/** Senha atual do usuário (obrigatória para validação) */
		current_password: string;
		/** Nova senha (mínimo 8 caracteres) */
		new_password: string;
		/** Confirmação da nova senha (deve ser igual a new_password) */
		confirm_password: string;
	}
}

export { IPasswordChange };
