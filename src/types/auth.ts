export type Role = {
    id: string;
    name: string;
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
