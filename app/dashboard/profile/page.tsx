import { getProfile } from "@/lib/profile";
import ProfileEditor from "@/components/dashboard/ProfileEditor";

export default async function ProfileManagementPage() {
  const profile = await getProfile();

  return <ProfileEditor profile={profile} />;
}
