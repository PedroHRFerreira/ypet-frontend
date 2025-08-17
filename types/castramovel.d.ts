// /types/castramovel.d.ts
import type { IEnum } from "~/types/global";
import type { IUser } from "~/types/user";
import type { IAnimal } from "~/types/animal";

declare global {
  /**
   * Status possíveis do dia de agenda (ex.: Aberto, Fechado, 
Encerrado).
   * Usamos IEnum para manter consistência com o projeto.
   */
  interface ICmDayStatus {
    id?: number;
    status: IEnum;
    description?: string;
    created_by?: IUser;
    created_at?: string;
    updated_at?: string;
  }

  /**
   * Representa um dia configurado para castração.
   */
  interface ICmDay {
    id?: number;
    tenant_id?: number;
    company_id?: number;
    date: string;              // ISO yyyy-mm-dd
    location?: string;         // endereço, ponto de encontro ou 
posto
    notes?: string;            // observações gerais (ex.: 
documentos necessários)
    capacity_total: number;    // capacidade total de procedimentos 
no dia
    capacity_used?: number;    // preenchido conforme agendamentos
    status?: ICmDayStatus;     // status atual do dia
    created_at?: string;
    updated_at?: string;
  }

  /**
   * Faixas de restrição por espécie/sexo/porte que afetam a triagem
   * (mantemos via IEnum para ficar compatível com as taxonomias 
globais).
   */
  interface ICmRestrictions {
    species?: IEnum[]; // cão, gato, etc.
    sex?: IEnum[];     // macho, fêmea
    size?: IEnum[];    // pequeno, médio, grande
    min_age_months?: number;
    max_age_months?: number;
    max_weight_kg?: number;
  }

  /**
   * Um agendamento individual dentro de um dia.
   */
  interface ICmAppointment {
    id?: number;
    day_id: number;            // ICmDay.id
    animal_id: number;         // IAnimal.id
    tutor_id: number;          // usuário do tutor
    species: IEnum;
    sex: IEnum;
    size: IEnum;
    weight?: number;
    notes?: string;
    status: IEnum;             // (Solicitado, Confirmado, Presente, 
Faltou, Cancelado)
    scheduled_at?: string;     // data/hora do agendamento
    checked_in_at?: string;    // presença no dia
    created_at?: string;
    updated_at?: string;
  }

  /**
   * Payloads para o service
   */
  interface ICmDayCreatePayload {
    date: string;
    location?: string;
    notes?: string;
    capacity_total: number;
    restrictions?: ICmRestrictions;
  }

  interface ICmDayUpdatePayload extends Partial<ICmDayCreatePayload> 
{
    id: number;
    status?: IEnum;
  }

  interface ICmDayClosePayload {
    id: number;
    reason?: string;
  }

  interface ICmListDaysQuery {
    month?: number;   // 1-12
    year?: number;    // yyyy
    statusSlug?: string; // ex.: "aberto", "fechado"
  }
}

export type {
  ICmDayStatus,
  ICmDay,
  ICmRestrictions,
  ICmAppointment,
  ICmDayCreatePayload,
  ICmDayUpdatePayload,
  ICmDayClosePayload,
  ICmListDaysQuery,
};

