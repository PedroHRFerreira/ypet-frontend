export const usePreventInvalidKeys = (event: KeyboardEvent) => {
	const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
	const isNumber = /^[0-9]$/.test(event.key);

	const isControlAction =
		(event.ctrlKey || event.metaKey) &&
		(event.key.toLowerCase() === "c" || event.key.toLowerCase() === "v");

	if (!isNumber && !allowedKeys.includes(event.key) && !isControlAction) {
		event.preventDefault();
	}
};
