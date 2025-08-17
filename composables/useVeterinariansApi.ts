// composables/useVeterinariosApi.ts
import { $fetch } from "ofetch";

const API = import.meta.env.NUXT_PUBLIC_API_BASE_URL || "";
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK).toLowerCase() === "true";

// Tipagem — alinhada com os cadastros do projeto
export interface IVeterinario {
  id?: number;
  nome: string;
  cpf: string;
  crmv: string;
  uf: string;
  email: string;
  telefone: string;
  instituicao_vinculada: string;
  tipo_vinculo: "Efetivo" | "Voluntário" | "Conveniado";
  pode_acessar_castramovel: boolean;
  pode_aplicar_vacinas: boolean;
  status: "Ativo" | "Inativo";
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export function useVeterinariosApi() {
  async function list(params: Record<string, any> = {}): Promise<IVeterinario[]> {
    if (USE_MOCK) {
      return [
        {
          id: 1,
          nome: "Priscilla Brandão",
          cpf: "123.456.789-00",
          crmv: "123456",
          uf: "SP",
          email: "nome@exemplo.com",
          telefone: "(12) 3456-7890",
          instituicao_vinculada: "Aprobem",
          tipo_vinculo: "Efetivo",
          pode_acessar_castramovel: true,
          pode_aplicar_vacinas: true,
          status: "Ativo",
          observacoes: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    return $fetch<IVeterinario[]>(`${API}/veterinarios`, {
      params,
    });
  }

  async function create(payload: IVeterinario): Promise<IVeterinario> {
    if (USE_MOCK) {
      return { ...payload, id: Date.now(), created_at: new Date().toISOString() };
    }
    return $fetch<IVeterinario>(`${API}/veterinarios`, {
      method: "POST",
      body: payload,
    });
  }

  async function update(id: number, payload: Partial<IVeterinario>): Promise<IVeterinario> {
    if (USE_MOCK) {
      return { id, ...payload, updated_at: new Date().toISOString() } as IVeterinario;
    }
    return $fetch<IVeterinario>(`${API}/veterinarios/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async function remove(id: number): Promise<{ ok: true }> {
    if (USE_MOCK) {
      return { ok: true };
    }
    return $fetch<{ ok: true }>(`${API}/veterinarios/${id}`, {
      method: "DELETE",
    });
  }

  return {
    list,
    create,
    update,
    remove,
  };
}
