# Tipos TypeScript (`types/`)

Este diretório contém definições de tipos TypeScript utilizadas em todo o projeto. O objetivo é centralizar e padronizar os tipos, facilitando a manutenção e a reutilização.

## Estrutura

- Definições de interfaces, tipos e enums compartilhados.
- Tipos auxiliares para componentes, serviços e modelos de dados.

## Convenções

- **Nomenclatura**: Use nomes descritivos e claros para interfaces e tipos. Por exemplo, `IUser`, `IProduct`, `IApiResponse`.
- **Organização**: Agrupe tipos relacionados em arquivos separados. Por exemplo, `user.d.ts` para tipos relacionados a usuários, `product.d.ts` para produtos.
- **Consistência**: Mantenha a consistência no uso de tipos primitivos e complexos. Por exemplo, use `string` para textos, `number` para números, e crie tipos específicos para objetos complexos.
- **Evite Tipos Any**: Sempre que possível, evite o uso de `any`. Use tipos específicos ou genéricos para garantir a segurança de tipos.
