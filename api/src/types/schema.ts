export type FieldOverview = {
	name: string;
	defaultValue: unknown;
	nullable: boolean;
	dbType: string | null;
};

export type Schema = {
	collection: string;
	primary: string;
	fields: FieldOverview[]
};

export type CollectionsOverview = {
	[name: string]: Schema
};

export type SchemaOverview = {
	collections: CollectionsOverview;
};
