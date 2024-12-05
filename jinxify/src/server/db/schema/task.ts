import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { diagram, users } from ".";

// for Tasks
export const task = pgTable("task", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	status: text("status", {
		enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
	})
		.notNull()
		.default("TODO"),
	createdFromDiagramId: uuid("createdFromDiagramId").references(
		() => diagram.id,
		{ onDelete: "set null" },
	),
	userId: text("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const taskRelations = relations(task, ({ one }) => ({
	user: one(users, {
		fields: [task.userId],
		references: [users.id],
	}),
	diagram: one(diagram, {
		fields: [task.createdFromDiagramId],
		references: [diagram.id],
	}),
}));
