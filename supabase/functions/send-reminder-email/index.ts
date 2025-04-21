
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "saikushalulli@gmail.com";

interface ReminderEmailRequest {
  startDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate }: ReminderEmailRequest = await req.json();
    const checkDate = startDate ? new Date(startDate) : new Date();
    checkDate.setDate(checkDate.getDate() - 1); // Set to 1 day ago

    // Get unconfirmed users who signed up before the check date and haven't received a reminder in the last day
    const { data: unconfirmedUsers, error } = await supabase
      .from("auth")
      .select("users.id, users.email, users.email_confirmed_at, profiles.name")
      .eq("users.email_confirmed_at", null)
      .lt("users.created_at", checkDate.toISOString())
      .eq("users.confirmed_at", null)
      .order("users.created_at", { ascending: true })
      .limit(20); // Process in batches

    if (error) {
      console.error("Error fetching unconfirmed users:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch unconfirmed users" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const results = [];

    // Send reminder emails to each unconfirmed user
    for (const user of unconfirmedUsers) {
      try {
        console.log(`Sending reminder to ${user.email}`);
        
        // Send reminder to user
        const userMail = await resend.emails.send({
          from: "LearnFinity <no-reply@resend.dev>",
          to: [user.email],
          subject: "Reminder: Please confirm your email for LearnFinity",
          html: `
            <h1>Hello ${user.name || "there"},</h1>
            <p>We noticed you haven't confirmed your email address for your LearnFinity account yet.</p>
            <p>Please check your inbox for our confirmation email and click the link to verify your account.</p>
            <p>If you didn't receive it, you can request a new confirmation email by logging into your account.</p>
            <p>Thanks for joining us!</p>
            <p>The LearnFinity Team</p>
          `,
        });
        
        // Notify admin about the reminder
        const adminMail = await resend.emails.send({
          from: "LearnFinity <no-reply@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: "Reminder Email Sent to Unconfirmed User",
          html: `
            <h2>Reminder Email Notification</h2>
            <p>A reminder email has been sent to a user who hasn't confirmed their account:</p>
            <p>Email: ${user.email}</p>
            <p>User ID: ${user.id}</p>
            <p>Account Created: ${user.created_at}</p>
          `,
        });

        results.push({ email: user.email, userMail, adminMail });
      } catch (emailError) {
        console.error(`Error sending reminder to ${user.email}:`, emailError);
        results.push({ email: user.email, error: emailError.message });
      }
    }

    return new Response(
      JSON.stringify({
        processedCount: results.length,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
