"use client";

import React, { useEffect, useRef } from "react";
import "swagger-ui/dist/swagger-ui.css";

// Initialize Swagger UI directly into a DOM node (non-React API) to avoid
// importing the React-based wrapper which includes legacy lifecycle usage.
export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Deterministic origin for server/client parity. Set NEXT_PUBLIC_SITE_URL in
  // your environment for production (e.g. https://example.com). Defaults to localhost.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${origin}/openapi.json`;

  useEffect(() => {
    if (!containerRef.current) return;

    let uiInstance: unknown = null;

    (async () => {
      const SwaggerModule = await import("swagger-ui");
      const Swagger = (SwaggerModule &&
        (SwaggerModule.default ||
          SwaggerModule)) as typeof import("swagger-ui").default;
      uiInstance = Swagger({ domNode: containerRef.current!, url });
    })();

    return () => {
      const inst = uiInstance as { destroy?: () => void } | null;
      if (inst && typeof inst.destroy === "function") inst.destroy();
    };
  }, [url]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div ref={containerRef} style={{ height: "100%" }} />
    </div>
  );
}
