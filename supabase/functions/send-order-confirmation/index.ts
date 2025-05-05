
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  otp: string;
  totalAmount: number;
  items: any[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OrderNotificationRequest = await req.json();
    const { customerName, customerEmail, orderId, otp, totalAmount, items } = body;

    console.log(`Sending order confirmation to ${customerEmail} for order ${orderId}`);

    // Create a simple HTML table for order items
    let itemsTable = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Size</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
        </tr>
    `;
    
    items.forEach(item => {
      itemsTable += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.title || "Untitled"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.size}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });
    
    itemsTable += '</table>';

    // Send email to customer
    const emailResponse = await resend.emails.send({
      from: "Junglee Ghumakkad <orders@jungleeghumakkad.com>",
      to: [customerEmail],
      subject: `Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568;">Your Order is Confirmed!</h1>
          <p>Dear ${customerName},</p>
          <p>Thank you for your purchase. We're processing your order and will ship it soon.</p>
          <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin-top: 0; color: #2d3748;">Order #${orderId}</h2>
            <p><strong>Verification OTP:</strong> <span style="background: #edf2f7; padding: 5px 10px; font-family: monospace; font-size: 18px;">${otp}</span></p>
            <p>Please keep this OTP for your reference. You'll need it to verify your order.</p>
          </div>
          <h3>Order Summary</h3>
          ${itemsTable}
          <div style="margin-top: 20px; text-align: right;">
            <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
          </div>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p>If you have any questions, please contact our customer service at <a href="mailto:support@jungleeghumakkad.com">support@jungleeghumakkad.com</a></p>
        </div>
      `,
    });

    // Also send notification to admin
    await resend.emails.send({
      from: "Junglee Ghumakkad Orders <orders@jungleeghumakkad.com>",
      to: [Deno.env.get("ADMIN_EMAIL") || "admin@jungleeghumakkad.com"],
      subject: `New Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568;">New Order Received</h1>
          <p>A new order has been placed on your website.</p>
          <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin-top: 0; color: #2d3748;">Order #${orderId}</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Total:</strong> ₹${totalAmount.toFixed(2)}</p>
          </div>
          <h3>Order Items</h3>
          ${itemsTable}
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p>Log in to your admin dashboard to manage this order.</p>
        </div>
      `,
    });

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
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
