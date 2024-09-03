import Link from "next/link";
import { AuthStatus } from "./auth-status";

export async function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Blog?</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/" className="hover:text-blue-400">
                                Articles
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" className="hover:text-blue-400">
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/search" className="hover:text-blue-400">
                                Search
                            </Link>
                        </li>
                    </ul>
                </nav>
                <AuthStatus />
            </header>
            <main>{children}</main>
        </div>
    );
}