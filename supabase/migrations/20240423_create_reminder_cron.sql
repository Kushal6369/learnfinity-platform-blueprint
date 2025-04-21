
-- Enable the required extensions if they aren't already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set up a daily cronjob to send reminder emails
SELECT cron.schedule(
  'daily-email-reminder-check',
  '0 12 * * *', -- Run at 12:00 PM UTC daily
  $$
  SELECT
    net.http_post(
      url:='https://rbsjcjtnddjforkvckbn.supabase.co/functions/v1/send-reminder-email',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic2pjanRuZGRqZm9ya3Zja2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4ODg0MTgsImV4cCI6MjA2MDQ2NDQxOH0.ft90JxZtNmeme_HI6NSWJs5lKyO4B-REA2Xn3UIfFiY"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
