export type Role = {
    id: string;
    full_name: string;
    email: string;
    is_active: boolean;
    role: Role;
};

export type User = {
    id: string;
    full_name: string;
    email: string;
    is_active: boolean;
    role: Role;
}

export type LoginResponse = {
    access_token: string;
    token_type: string;
    user: User;
}
