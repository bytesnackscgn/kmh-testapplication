export type Accountability = {
	role: string | null;
	user?: string | null;
	admin?: boolean;
	permissions?: string[];
};
