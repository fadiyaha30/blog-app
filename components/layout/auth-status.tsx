'use client'

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export function AuthStatus() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleSignOut = async () => {
        setIsOpen(false);
        await signOut({ redirect: false });
        window.location.href = '/';
    };

    // if (status === "loading") {
    //     return <div>Loading...</div>
    // }

    if (session?.user) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {session.user.name || session.user.email}
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link 
                            href="/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex space-x-2">
            <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
                Register
            </Link>
            <Link
                href="/auth/login"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
                Login
            </Link>
        </div>
    );
}