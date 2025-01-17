import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { users } from "@/server/db/schema/auth";
import { form } from "@/server/db/schema/workspace";
import { relations } from "drizzle-orm";

export const formSubmission = pgTable("form_submission", {
	id: uuid("id").primaryKey().defaultRandom(),
	formId: uuid("formId")
		.notNull()
		.references(() => form.id, { onDelete: "cascade" }),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	data: jsonb("data").notNull(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const formSubmissionRelations = relations(formSubmission, ({ one }) => ({
	form: one(form, {
		fields: [formSubmission.formId],
		references: [form.id],
	}),
}));
