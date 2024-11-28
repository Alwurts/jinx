import Editor from "@/components/diagram/editor";

export default function page({ params }: { params: { id: string } }) {
	return <Editor id={params.id} />;
}
