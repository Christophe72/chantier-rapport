/**
 * Composant Navbar pour l'application Dashboard IoT.
 *
 * Affiche une barre de navigation avec le logo, le titre et les contrôles d'authentification.
 * - Affiche le logo et le titre de l'application.
 * - Affiche un message de bienvenue et un bouton de déconnexion si l'utilisateur est authentifié.
 * - Affiche les liens de connexion et d'inscription si l'utilisateur n'est pas authentifié.
 *
 * Utilise NextAuth pour la gestion de session et l'authentification.
 *
 * @component
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <span className="font-bold text-xl text-gray-900">
                Dashboard IoT
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700">
                  Bonjour, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/auth/signin"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
