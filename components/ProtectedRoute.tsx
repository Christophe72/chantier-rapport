/**
 * Un composant React qui protège ses enfants en exigeant une authentification utilisateur.
 *
 * Ce composant utilise `useSession` de NextAuth pour déterminer le statut d'authentification.
 * Si l'authentification est requise et que l'utilisateur n'est pas authentifié, il redirige vers une route spécifiée.
 * Pendant le chargement du statut d'authentification, un spinner est affiché.
 *
 * @param {object} props - Les props du composant.
 * @param {React.ReactNode} props.children - Le contenu à afficher si l'accès est accordé.
 * @param {boolean} [props.requireAuth=true] - Indique si l'authentification est requise pour accéder aux enfants.
 * @param {string} [props.redirectTo="/auth/signin"] - Le chemin de redirection pour les utilisateurs non authentifiés.
 *
 * @returns {JSX.Element | null} Le contenu protégé, un spinner de chargement, ou null si non authentifié.
 */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/auth/signin",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Encore en cours de chargement

    if (requireAuth && status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, requireAuth, redirectTo, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (requireAuth && status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
