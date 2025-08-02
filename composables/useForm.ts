export const useForm = (params: string[] = []): Record<string, FormFieldType> => {
  if (params.length == 0) {
    return {} as Record<string, FormFieldType>;
  }

  const form: Record<string, FormFieldType> = {};

  params.forEach((param) => {
    form[param] = {
      value: null,
      errorMessages: []
    };
  });

  return form;
}
