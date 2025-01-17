import {
	uuid,
	pgTable,
	text,
	timestamp,
	jsonb,
	boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from ".";

// for folder
export const directory = pgTable("directory", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	directoryId: uuid("directoryId"), // If this is null then that means is the home directory
	type: text("type", { enum: ["directory"] })
		.notNull()
		.default("directory"),
	userId: text("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(), //maps user id from users table to userId
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const directoryRelations = relations(directory, ({ one, many }) => ({
	user: one(users, {
		fields: [directory.userId],
		references: [users.id],
	}),
	parent: one(directory, {
		fields: [directory.directoryId],
		references: [directory.id],
		relationName: "directorySelf",
	}),
	directories: many(directory, { relationName: "directorySelf" }),
	diagrams: many(diagram),
	forms: many(form),
	documents: many(document),
}));

// for BPMN
export const diagram = pgTable("diagram", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	type: text("type", { enum: ["diagram"] })
		.notNull()
		.default("diagram"),
	directoryId: uuid("directoryId"), // If this is null then that means is the home directory
	userId: text("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(), //maps user id from users table to userId
	isFavorite: boolean("isFavorite").notNull().default(false),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const diagramRelations = relations(diagram, ({ one }) => ({
	user: one(users, {
		fields: [diagram.userId],
		references: [users.id],
	}),
	directory: one(directory, {
		fields: [diagram.directoryId],
		references: [directory.id],
	}),
}));

// for Forms
export const form = pgTable("form", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	schema: jsonb("schema").notNull(),
	type: text("type", { enum: ["form"] })
		.notNull()
		.default("form"),
	directoryId: uuid("directoryId"), // If this is null then that means is the home directory
	userId: text("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(), //maps user id from users table to userId
	isFavorite: boolean("isFavorite").notNull().default(false),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const formRelations = relations(form, ({ one }) => ({
	user: one(users, {
		fields: [form.userId],
		references: [users.id],
	}),
	directory: one(directory, {
		fields: [form.directoryId],
		references: [directory.id],
	}),
}));

// for Documents
export const document = pgTable("document", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	type: text("type", { enum: ["document"] })
		.notNull()
		.default("document"),
	directoryId: uuid("directoryId"), // If this is null then that means is the home directory
	userId: text("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(), //maps user id from users table to userId
	isFavorite: boolean("isFavorite").notNull().default(false),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const documentRelations = relations(document, ({ one }) => ({
	user: one(users, {
		fields: [document.userId],
		references: [users.id],
	}),
	directory: one(directory, {
		fields: [document.directoryId],
		references: [directory.id],
	}),
}));
