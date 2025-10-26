import { json, type LoaderFunction } from "@remix-run/node";
import { insforgeConfig } from "~/config/env.server";

export const loader: LoaderFunction = async () => {
  const startedAt = Date.now();

  const commonHeaders: HeadersInit = {
    Authorization: `Bearer ${insforgeConfig.apiKey}`,
    Accept: "application/json, */*",
  };

  try {
    // First attempt: HEAD to base URL (fast connectivity check)
    const headRes = await fetch(insforgeConfig.baseUrl, {
      method: "HEAD",
      headers: commonHeaders,
    });

    const headLatency = Date.now() - startedAt;

    if (headRes.ok) {
      return json(
        {
          ok: true,
          source: "HEAD",
          status: headRes.status,
          latencyMs: headLatency,
          url: insforgeConfig.baseUrl,
          message: "InsForge reachable",
        },
        { status: 200 }
      );
    }

    // Fallback attempt: GET /health (if supported by backend)
    const healthUrl = `${insforgeConfig.baseUrl.replace(/\/$/, "")}/health`;
    const healthRes = await fetch(healthUrl, {
      method: "GET",
      headers: commonHeaders,
    });
    const healthLatency = Date.now() - startedAt;

    // Try to parse JSON if present; otherwise provide basic info
    let body: any = null;
    try {
      body = await healthRes.clone().json();
    } catch {
      body = null;
    }

    if (healthRes.ok) {
      return json(
        {
          ok: true,
          source: "GET /health",
          status: healthRes.status,
          latencyMs: healthLatency,
          url: healthUrl,
          data: body,
          message: "InsForge health endpoint responded successfully",
        },
        { status: 200 }
      );
    }

    // Final fallback: GET base URL
    const baseGetRes = await fetch(insforgeConfig.baseUrl, {
      method: "GET",
      headers: commonHeaders,
    });
    const baseGetLatency = Date.now() - startedAt;

    let baseBody: any = null;
    try {
      baseBody = await baseGetRes.clone().json();
    } catch {
      baseBody = null;
    }

    return json(
      {
        ok: baseGetRes.ok,
        source: "GET",
        status: baseGetRes.status,
        latencyMs: baseGetLatency,
        url: insforgeConfig.baseUrl,
        data: baseBody,
        message: baseGetRes.ok
          ? "InsForge base responded successfully"
          : "InsForge responded with a non-OK status",
      },
      { status: baseGetRes.ok ? 200 : 502 }
    );
  } catch (error: any) {
    const latency = Date.now() - startedAt;
    return json(
      {
        ok: false,
        source: "error",
        status: 0,
        latencyMs: latency,
        url: insforgeConfig.baseUrl,
        error: error?.message || "Unknown error",
      },
      { status: 502 }
    );
  }
};