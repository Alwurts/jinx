import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
}));

// for BPMN
export const diagram = pgTable("diagram", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	directoryId: uuid("directoryId"), // If this is null then that means is the home directory
	userId: text("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(), //maps user id from users table to userId
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
