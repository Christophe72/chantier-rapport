/**
 * Fournit un contexte d'authentification à ses composants enfants en utilisant le SessionProvider de NextAuth.
 *
 * @param children - Les nœuds React qui auront accès au contexte de session d'authentification.
 * @returns Les enfants enveloppés avec le SessionProvider, permettant la gestion de l'état d'authentification.
 */
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
