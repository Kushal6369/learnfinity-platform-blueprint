
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  name: string;
  email: string;
}

const ADMIN_EMAIL = "saikushalulli@gmail.com";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: ConfirmationEmailRequest = await req.json();

    // Send to user
    const userMail = await resend.emails.send({
      from: "LearnFinity <no-reply@resend.dev>",
      to: [email],
      subject: "Welcome to LearnFinity! Confirm your email",
      html: `
        <h1>Hi ${name}, welcome to LearnFinity!</h1>
        <p>Your account has been created successfully. Please confirm your email address by clicking the link we sent from Supabase as well.</p>
        <p>Thanks for joining us!</p>
        <p>The LearnFinity Team</p>
      `,
    });

    // Send to admin
    const adminMail = await resend.emails.send({
      from: "LearnFinity <no-reply@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: "A new user signed up to LearnFinity",
      html: `
        <h2>New User Signup Notification</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
      `,
    });

    console.log("Emails sent:", { userMail, adminMail });
    return new Response(JSON.stringify({ userMail, adminMail }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending confirmation emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
