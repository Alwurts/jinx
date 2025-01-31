import { z } from "zod";
import type { InferQueryModel } from "./infer-database";

export type TDocument = InferQueryModel<"document">;
export type TDiagram = InferQueryModel<"diagram">;
export type TForm = InferQueryModel<"form">;
export type TFormSubmission = InferQueryModel<"formSubmission">;
export type TDirectory = InferQueryModel<
	"directory",
	undefined,
	{
		parent: true;
		directories: true;
		diagrams: true;
		forms: true;
		documents: true;
	}
>;

export type TTask = InferQueryModel<
	"task",
	undefined,
	{
		diagram: true;
		document: true;
		form: true;
	}
>;

export const TTaskSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
	dueDate: z.string().datetime().nullable(),
});
