import type { InferQueryModel } from "./infer-database";

export type TDiagram = InferQueryModel<"diagram">;
export type TDirectory = InferQueryModel<
	"directory",
	undefined,
	{
		parent: true;
		directories: true;
		diagrams: true;
	}
>;
export type TTask = InferQueryModel<"task">;
