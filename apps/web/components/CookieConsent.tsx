"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-600 flex-1 max-w-4xl">
        <p>
          We use cookies to improve your experience on our site, personalize content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies as described in our Privacy Policy.
        </p>
      </div>
      <div className="flex shrink-0 gap-3">
        <Button onClick={handleAccept} variant="accent" size="sm">
          Accept All
        </Button>
      </div>
    </div>
  );
}
