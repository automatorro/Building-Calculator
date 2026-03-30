export async function POST(request: Request) {
  try {
    await request.text()
  } catch {}

  return new Response(null, { status: 204 })
}

export async function GET() {
  return new Response(null, { status: 204 })
}
