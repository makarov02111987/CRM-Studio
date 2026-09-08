export async function onRequestPost({request, env}) {
  try {
    const body = await request.json();

    if (!body.org || !body.name || !body.email || !body.prompt) {
      return Response.json(
        {error: "Не заполнены обязательные поля"},
        {status: 400}
      );
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(`
      INSERT INTO leads
      (
        id,
        created_at,
        updated_at,
        org,
        name,
        phone,
        email,
        public_price,
        internal_score,
        internal_price,
        internal_level,
        status,
        prompt,
        form_json
      )
      VALUES (?, datetime('now'), datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, 'Новая', ?, ?)
    `).bind(
      id,
      body.org,
      body.name,
      body.phone || "",
      body.email,
      body.publicPrice || "от 10 000 ₽",
      Number(body.internalScore || 0),
      Number(body.internalPrice || 10000),
      body.internalLevel || "Старт",
      body.prompt,
      JSON.stringify(body.form || {})
    ).run();

    return Response.json({
      ok: true,
      id
    });

  } catch (e) {

    return Response.json(
      {error: "Ошибка сохранения заявки"},
      {status: 500}
    );
  }
}


export async function onRequestGet({request, env}) {

  const auth = request.headers.get("Authorization") || "";

  if (!(await validAdmin(auth, env))) {
    return Response.json(
      {error: "Unauthorized"},
      {status: 401}
    );
  }

  const {results} = await env.DB.prepare(`
    SELECT
      id,
      created_at,
      updated_at,
      org,
      name,
      phone,
      email,
      public_price,
      internal_score,
      internal_price,
      internal_level,
      status
    FROM leads
    ORDER BY created_at DESC
  `).all();

  return Response.json(results);
}


async function validAdmin(auth, env) {

  if (!auth.startsWith("Bearer ")) {
    return false;
  }

  const token = auth.slice(7);
  const expected = env.ADMIN_PASSWORD;

  if (!expected || !token) {
    return false;
  }

  return await timingSafeEqual(token, expected);
}


async function timingSafeEqual(a, b) {

  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);

  if (ea.length !== eb.length) {
    return false;
  }

  let x = 0;

  for (let i = 0; i < ea.length; i++) {
    x |= ea[i] ^ eb[i];
  }

  return x === 0;
}
