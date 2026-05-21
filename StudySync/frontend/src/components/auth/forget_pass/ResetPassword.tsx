import { Button } from '../../ui/button'; 
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password set korar por login page e pathiye dibe
    alert("Password reset successfully! Please log in.");
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <Card className="w-full max-w-md z-10 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-900/10 rounded-3xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white p-3 rounded-2xl shadow-lg">
              <Lock size={32} strokeWidth={2.5} />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Create New Password</CardTitle>
          <CardDescription className="text-md text-slate-500">
            Your new password must be different from previous used passwords.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pb-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-slate-700 font-semibold">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                placeholder="••••••••" 
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-purple-500 bg-white"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-700 font-semibold">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••" 
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-purple-500 bg-white"
                required 
              />
            </div>

            <Button type="submit" className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-transform hover:-translate-y-0.5">
              Save & Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;