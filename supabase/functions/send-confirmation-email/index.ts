
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
  confirmationToken: string;
  confirmationUrl: string;
}

const ADMIN_EMAIL = "saikushalulli@gmail.com";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, confirmationToken, confirmationUrl }: WelcomeEmailRequest = await req.json();

    // Send welcome email to user with confirmation link
    const userMail = await resend.emails.send({
      from: "LearnFinity <no-reply@resend.dev>",
      to: [email],
      subject: "Welcome to LearnFinity - Please Confirm Your Email",
      html: `
        <h1>Welcome to LearnFinity, ${name}!</h1>
        <p>Your account has been created successfully. Please click the link below to confirm your email address:</p>
        <p><a href="${confirmationUrl}?confirmation_token=${confirmationToken}">Confirm your email</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The LearnFinity Team</p>
      `,
    });

    // Notify admin about new user
    const adminMail = await resend.emails.send({
      from: "LearnFinity <no-reply@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: "New User Registration at LearnFinity",
      html: `
        <h2>New User Registration Notification</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Status: Pending Email Confirmation</p>
      `,
    });

    console.log("Emails sent:", { userMail, adminMail });
    return new Response(JSON.stringify({ userMail, adminMail }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome emails:", error);
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
