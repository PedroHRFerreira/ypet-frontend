import type { IEnum } from "~/types/global";

declare global {
  interface IAnimalStatus {
    id?: number;
    status: IEnum;
    description?: string;
    animal_id: number;
    created_by?: IUser;
    created_at?: string;
    updated_at?: string;
  }
  interface IAnimal {
    id?: number;
    hash?: string;
    tenant_id?: number;
    company_id?: number;
    tutor_id?: number;
    name: string;
    species: IEnum;
    gender: IEnum;
    weight: number;
    birth_date: string;
    castrated: boolean;
    castration_at?: string;
    castration_site?: string;
    size: string;
    color: string;
    coat?: IEnum;
    characteristics?: string;
    surname?: string;
    entry_date?: string;
    picture?: string;
    collection_site?: string;
    collection_reason?: string;
    microchip_number?: string;
    registration_number?: string;
    created_at?: string;
    updated_at?: string;
    status?: IAnimalStatus;
    history_statuses?: IAnimalStatus[];
  }
}
export { IAnimal, IAnimalStatus };