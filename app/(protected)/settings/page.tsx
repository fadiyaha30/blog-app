import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditProfileForm } from "@/components/edit-profile-form";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/profile" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Profile
      </Link>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Edit Profile</h2>
        </CardHeader>
        <CardContent>
          <EditProfileForm user={session.user} />
        </CardContent>
      </Card>
    </div>
    </div>
  );
}