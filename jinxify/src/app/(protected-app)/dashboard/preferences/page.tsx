import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/forms/profile-form";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";
import { VscSettings } from "react-icons/vsc";
import { AppearanceForm } from "@/components/forms/appearance-form";
import { AccountForm } from "@/components/forms/account-form";

export default async function SettingsProfilePage() {
	const session = await auth();

	return (
		<div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
			<div>
				<ImageOverlayHeader
					title="Preferences"
					icon={<VscSettings className="size-8 text-primary-foreground z-20" />}
				/>
			</div>
			<div className="flex-1 overflow-y-auto px-4 py-8">
				<AppearanceForm />
				<Separator />
				<AccountForm session={session ?? null} />
				<Separator />
				<ProfileForm session={session ?? null} />
			</div>
		</div>
	);
}
