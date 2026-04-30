export default function handler(_req: Request) {
  return Response.json({
    status: "ok",
    runtime: "vercel",
    timestamp: new Date().toISOString(),
  });
}
