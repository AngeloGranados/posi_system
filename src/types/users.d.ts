export type tableThNameUsers = "id" | "email" | "nombres" | "telefono" | "type" | "is_active" | "created_at" | "updated_at" | "actions";
export type orderByAscDescUsers = Exclude<tableThNameUsers, "actions">;
export type orderByUsers = "ByASC" | "ByDESC";
export interface tableThUsers {
    name: tableThNameUsers;
    value: string;
    className?: string;
}

export interface Users {
    id? : number,
    email : string,
    password_hash? : string,
    nombres : string,
    apellidos : string,
    telefono : string,
    type? : string,
    created_at? : Date,
    updated_at? : Date,
    is_active? : boolean,
}

