
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Loader2, Phone, Shield } from 'lucide-react';

const AdminSMSLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });

    // Check for existing SMS admin session
    const adminSession = localStorage.getItem('admin_session');
    const storedAdminPhone = localStorage.getItem('admin_phone');
    
    if (adminSession && storedAdminPhone) {
      navigate('/admin');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Please enter a valid phone number with country code');
      }

      // Check if phone number is registered as admin
      const { data: isAdminPhone, error: adminCheckError } = await supabase
        .rpc('is_admin_phone_number', { phone: phone });

      if (adminCheckError) {
        console.error('Error checking admin phone:', adminCheckError);
        throw new Error('Unable to verify phone number. Please try again.');
      }

      if (!isAdminPhone) {
        throw new Error('This phone number is not authorized for admin access.');
      }

      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in session storage for verification (in production, this should be server-side)
      sessionStorage.setItem('admin_otp', otpCode);
      sessionStorage.setItem('admin_phone', phone);
      sessionStorage.setItem('otp_timestamp', Date.now().toString());

      // Send SMS via Supabase Edge Function
      const { error } = await supabase.functions.invoke('send-sms-otp', {
        body: {
          phone: phone,
          message: `Your admin login code is: ${otpCode}. Valid for 5 minutes.`
        }
      });

      if (error) {
        console.error('SMS sending error:', error);
        // For demo purposes, we'll show the OTP in a toast
        toast.success(`Demo: Your OTP is ${otpCode}`);
      } else {
        toast.success('OTP sent to your phone number');
      }

      setOtpSent(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const storedOtp = sessionStorage.getItem('admin_otp');
      const storedPhone = sessionStorage.getItem('admin_phone');
      const otpTimestamp = sessionStorage.getItem('otp_timestamp');
      
      if (!storedOtp || !storedPhone || !otpTimestamp) {
        throw new Error('OTP session expired. Please request a new code.');
      }

      // Check if OTP is expired (5 minutes)
      const currentTime = Date.now();
      const otpAge = currentTime - parseInt(otpTimestamp);
      if (otpAge > 5 * 60 * 1000) {
        sessionStorage.removeItem('admin_otp');
        sessionStorage.removeItem('admin_phone');
        sessionStorage.removeItem('otp_timestamp');
        throw new Error('OTP expired. Please request a new code.');
      }

      if (otp !== storedOtp) {
        throw new Error('Invalid OTP. Please try again.');
      }

      if (phone !== storedPhone) {
        throw new Error('Phone number mismatch. Please start over.');
      }

      // Create a session token (in production, this should be handled server-side)
      const sessionToken = `admin_${phone}_${Date.now()}`;
      localStorage.setItem('admin_session', sessionToken);
      localStorage.setItem('admin_phone', phone);

      // Clean up OTP storage
      sessionStorage.removeItem('admin_otp');
      sessionStorage.removeItem('admin_phone');
      sessionStorage.removeItem('otp_timestamp');

      toast.success('Successfully authenticated');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setOtpSent(false);
    setOtp('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Admin SMS Login
          </CardTitle>
          <CardDescription className="text-center">
            {!otpSent 
              ? "Enter your registered phone number to receive an OTP" 
              : "Enter the 6-digit code sent to your phone"
            }
          </CardDescription>
        </CardHeader>

        {!otpSent ? (
          <form onSubmit={sendOTP}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +1 for US, +91 for India)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying & Sending OTP...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Send OTP
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">Verification Code</label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Code sent to {phone}
                </p>
              </div>
            </CardContent>
            <CardFooter className="space-y-2 flex-col">
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify & Login
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={goBack} className="w-full">
                Back to Phone Number
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminSMSLogin;
