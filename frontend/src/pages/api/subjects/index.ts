import type { APIRoute } from 'astro';
import { getAllSubjects, createSubject } from '../../../services/subjects';

export const GET: APIRoute = async () => {
  const allSubjects = await getAllSubjects();

  return new Response(JSON.stringify(allSubjects), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.code || !data.name) {
      return new Response(JSON.stringify({ error: "Code and Name are required" }), { status: 400 });
    }

    const newSubject = await createSubject(data.code, data.name);

    return new Response(JSON.stringify({
      message: "Asignatura creada",
      subject: newSubject[0]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    // Postgres unique violation code 23505
    if (error.code === '23505') {
       return new Response(JSON.stringify({ error: "Subject code already exists" }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
