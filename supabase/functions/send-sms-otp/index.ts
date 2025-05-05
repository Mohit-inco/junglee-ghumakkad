
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message }: SMSRequest = await req.json();
    
    // In a real implementation, you would integrate with an SMS provider
    // For now, we'll just log the message
    console.log(`Would send SMS to ${phone}: ${message}`);
    
    // Simulate SMS sending
    // For actual implementation, you would use an SMS provider like Twilio, MSG91, etc.
    const SMS_API_KEY = Deno.env.get("SMS_API_KEY");
    
    if (!SMS_API_KEY) {
      console.log("SMS_API_KEY not configured, skipping actual SMS sending");
      return new Response(JSON.stringify({ success: true, simulated: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // This is a placeholder for actual SMS API integration
    // const response = await fetch("https://sms-api-url.com/send", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${SMS_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     to: phone,
    //     message: message,
    //   })
    // });
    
    // const result = await response.json();
    const result = { success: true, simulated: true };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-sms-otp function:", error);
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
