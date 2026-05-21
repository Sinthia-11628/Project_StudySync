import { Button } from '../../ui/button'; 
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const VerifyCode = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Code verify korar por notun password set korar page e nibe
    navigate('/reset-password'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="absolute top-6 left-6 z-20">
        <Link to="/forgot-password" className="text-slate-500 hover:text-purple-600 flex items-center gap-2 font-medium transition-colors">
          <ArrowRight size={18} className="rotate-180" /> Back
        </Link>
      </div>

      <Card className="w-full max-w-md z-10 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-900/10 rounded-3xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white p-3 rounded-2xl shadow-lg">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Check Your Email</CardTitle>
          <CardDescription className="text-md text-slate-500">
            We've sent a 6-digit verification code to your email.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-slate-700 font-semibold">Verification Code</Label>
              <Input 
                id="code" 
                type="text" 
                maxLength={6}
                placeholder="Enter 6-digit code" 
                className="text-center tracking-[0.5em] text-lg font-bold h-12 rounded-xl border-slate-200 focus-visible:ring-purple-500 bg-white"
                required 
              />
            </div>

            <Button type="submit" className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-transform hover:-translate-y-0.5">
              Verify & Proceed
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-6 pb-6">
          <p className="text-slate-600 text-sm font-medium">
            Didn't receive code?{' '}
            <button type="button" className="text-purple-600 hover:text-purple-700 font-bold hover:underline">Resend</button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyCode;