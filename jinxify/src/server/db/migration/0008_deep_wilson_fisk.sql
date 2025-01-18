ALTER TABLE "task" RENAME COLUMN "createdFromDiagramId" TO "linkedDiagramId";--> statement-breakpoint
ALTER TABLE "task" DROP CONSTRAINT "task_createdFromDiagramId_diagram_id_fk";
--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "linkedDocumentId" uuid;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "linkedFormId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_linkedDiagramId_diagram_id_fk" FOREIGN KEY ("linkedDiagramId") REFERENCES "public"."diagram"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_linkedDocumentId_document_id_fk" FOREIGN KEY ("linkedDocumentId") REFERENCES "public"."document"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_linkedFormId_form_id_fk" FOREIGN KEY ("linkedFormId") REFERENCES "public"."form"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
