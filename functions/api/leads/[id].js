async function validAdmin(request, env) {
  const auth = request.headers.get("Authorization") || "";

  if (!auth.startsWith("Bearer ")) {
    return false;
  }

  const a = new TextEncoder().encode(auth.slice(7));
  const b = new TextEncoder().encode(env.ADMIN_PASSWORD || "");

  if (!b.length || a.length !== b.length) {
    return false;
  }

  let x = 0;

  for (let i = 0; i < a.length; i++) {
    x |= a[i] ^ b[i];
  }

  return x === 0;
}


export async function onRequestGet({request, env, params}) {

  if (!(await validAdmin(request, env))) {
    return Response.json(
      {error: "Unauthorized"},
      {status: 401}
    );
  }

  const row = await env.DB
    .prepare(`SELECT * FROM leads WHERE id = ?`)
    .bind(params.id)
    .first();

  if (!row) {
    return Response.json(
      {error: "Not found"},
      {status: 404}
    );
  }

  return Response.json(row);
}


export async function onRequestPatch({request, env, params}) {

  if (!(await validAdmin(request, env))) {
    return Response.json(
      {error: "Unauthorized"},
      {status: 401}
    );
  }

  const body = await request.json();

  const allowed = [
    "Новая",
    "Связались",
    "КП",
    "Договор",
    "В работе",
    "Завершено"
  ];

  if (!allowed.includes(body.status)) {
    return Response.json(
      {error: "Invalid status"},
      {status: 400}
    );
  }

  await env.DB
    .prepare(`
      UPDATE leads
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `)
    .bind(body.status, params.id)
    .run();

  return Response.json({ok: true});
}
