import type { APIRoute } from 'astro';
import { subscribeUser } from '../../../services/subscription';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, subjectCodes } = data; // data might be full object, subscribeUser takes { email, name, phone, subjectCodes }
    // Wait, the API receives `subjects: [...]`. Service expects `subjectCodes`.
    
    if (!email || !data.subjects || !Array.isArray(data.subjects)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    const subscriptionData = {
        email,
        name: data.name,
        phone: data.phone,
        subjectCodes: data.subjects
    };

    const fullUser = await subscribeUser(subscriptionData);

    return new Response(JSON.stringify(fullUser), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    if (error.message === "One or more subjects not found") {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
