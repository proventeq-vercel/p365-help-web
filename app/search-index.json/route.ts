import { getSearchDocuments } from "@/lib/search";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(getSearchDocuments()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
