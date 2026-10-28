"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface LogoutButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick"> {}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })} {...props}>
      {children}
    </Button>
  );
}
