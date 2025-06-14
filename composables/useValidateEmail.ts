export function useValidateEmail() {
	const validateEmail = (email: string): boolean => {
		const config = useRuntimeConfig();
		const blackList = (config.public.blackList || "").split(",");
		const isBlackListedEmail = blackList.some((item: string) =>
			email.includes(item),
		);
		if (isBlackListedEmail) return false;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	return { validateEmail };
}
