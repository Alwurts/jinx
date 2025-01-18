import { z } from "zod";
import type { InferQueryModel } from "./infer-database";

export type TUser = InferSelectModel<typeof users>;
export type TDiagram = InferSelectModel<typeof diagram>;
export type TForm = InferSelectModel<typeof form>;
export type TFormSubmission = InferSelectModel<typeof formSubmission>;
export type TDocument = InferSelectModel<typeof document>;

export type TTask = InferQueryModel<
	"task",
	undefined,
	{
		diagram: true;
	}
>;

export const TTaskSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
});
