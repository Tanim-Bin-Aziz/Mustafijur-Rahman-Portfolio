import ProfileView from "@/components/profile/ProfileView";
import { getProfile } from "@/lib/profile";

export default async function ProfilePage() {
  const profile = await getProfile();

  return <ProfileView profile={profile} />;
}
