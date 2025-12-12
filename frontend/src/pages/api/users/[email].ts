import type { APIRoute } from 'astro';
import { getUserByEmail, deleteUserByEmail } from '../../../services/users';

export const GET: APIRoute = async ({ params }) => {
  const { email } = params;

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  const responseUser = {
      ...user,
      subjects: user.subjects.map((us: any) => us.subject)
  };

  return new Response(JSON.stringify(responseUser), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const DELETE: APIRoute = async ({ params }) => {
    const { email } = params;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    const success = await deleteUserByEmail(email);

    if (!success) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(null, { status: 204 });
};
