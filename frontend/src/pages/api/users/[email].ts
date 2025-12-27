import { getUserByEmail, deleteUserByEmail } from '../../../services/backend/users.repository';
import type { APIRoute } from 'astro';
import { assert } from '../../../utils/assert';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { email } = params;

    assert(!!email, "Email required");

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
  } catch (error: any) {
    if (error.message.includes("Assertion failed")) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { email } = params;

    assert(!!email, "Email required");

    const success = await deleteUserByEmail(email);

    if (!success) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.message.includes("Assertion failed")) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
