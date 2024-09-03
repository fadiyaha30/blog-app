import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Articles
      </Link>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">User Information</h2>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
          </CardContent>
        </Card> 
        <div className="mt-6 space-x-4">
          <Link href="/settings">
            <Button>Edit Profile</Button>
          </Link>
          <Link href="/bookmarks">
            <Button>Bookmarks</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}