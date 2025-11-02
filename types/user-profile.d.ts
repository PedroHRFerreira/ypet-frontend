/**
 * Perfis de usuário do sistema YPet
 *
 * Baseado nos roles retornados pela API em IUser.roles[].name
 *
 * - **admin**: Acesso total ao sistema, pode gerenciar todos os recursos
 * - **collaborator**: Colaborador, pode visualizar e editar próprio perfil
 * - **veterinarian**: Veterinário, pode visualizar e editar próprio perfil
 *
 * @example
 * ```typescript
 * const userRole: UserProfile = 'admin';
 * const isAdmin = user.roles?.some(role => role.name === 'admin');
 * ```
 */
export type UserProfile = "admin" | "collaborator" | "veterinarian";
