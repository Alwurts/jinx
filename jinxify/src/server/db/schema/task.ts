import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { diagram, users, document, form } from ".";

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
	linkedDiagramId: uuid("linkedDiagramId").references(() => diagram.id, {
		onDelete: "set null",
	}),
	linkedDocumentId: uuid("linkedDocumentId").references(() => document.id, {
		onDelete: "set null",
	}),
	linkedFormId: uuid("linkedFormId").references(() => form.id, {
		onDelete: "set null",
	}),
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
		fields: [task.linkedDiagramId],
		references: [diagram.id],
	}),
	document: one(document, {
		fields: [task.linkedDocumentId],
		references: [document.id],
	}),
	form: one(form, {
		fields: [task.linkedFormId],
		references: [form.id],
	}),
}));
