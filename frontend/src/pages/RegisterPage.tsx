import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  Copy, 
  Share2, 
  ArrowRight, 
  UserCheck, 
  Gift, 
  Users, 
  ShieldCheck,
  Check,
  Zap,
  Phone,
  Mail,
  Building,
  GraduationCap
} from 'lucide-react';
import { StudentRegistrationInput, Student } from '../types';
import { registerStudent } from '../services/api';

interface RegisterPageProps {
  navigate: (path: string) => void;
  referralCodeFromUrl?: string;
  selectedProjectTitle?: string;
  registeredStudent: Student | null;
  setRegisteredStudent: (student: Student) => void;
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  navigate,
  referralCodeFromUrl,
  selectedProjectTitle,
  registeredStudent,
  setRegisteredStudent,
  addToast
}) => {
  const [formData, setFormData] = useState<StudentRegistrationInput>({
    name: '',
    email: '',
    phone: '',
    college: 'VIT Vellore',
    branch: 'Computer Science (CSE)',
    year: 'Final Year',
    referral_code_used: referralCodeFromUrl || '',
    source: referralCodeFromUrl ? 'Referral' : 'Organic'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (referralCodeFromUrl) {
      setFormData(prev => ({
        ...prev,
        referral_code_used: referralCodeFromUrl,
        source: 'Referral'
      }));
    }
  }, [referralCodeFromUrl]);

  const colleges = [
    'VIT Vellore', 'Amrita University', 'SRM University', 'IIT Madras',
    'BITS Pilani', 'Delhi Technological University (DTU)', 'RVCE Bangalore',
    'PSG Tech Coimbatore', 'PES University', 'NIT Trichy', 'Manipal Institute of Tech',
    'Other Engineering College'
  ];

  const branches = [
    'Computer Science (CSE)',
    'AI & Data Science (AIDS)',
    'Information Technology (IT)',
    'Electronics & Comm (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical / Civil / Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const student = await registerStudent(formData);
      setRegisteredStudent(student);
      addToast('success', 'Workshop Seat Reserved!', `Welcome ${student.name}! Your referral code is ${student.referral_code}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
      addToast('error', 'Registration Issue', err.message || 'Could not complete registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const getReferralUrl = (code: string) => {
    const origin = window.location.origin;
    return `${origin}/#/register?ref=${code}`;
  };

  const handleCopyLink = () => {
    if (!registeredStudent) return;
    const url = getReferralUrl(registeredStudent.referral_code);
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('success', 'Link Copied!', 'Referral link copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!registeredStudent) return;
    const url = getReferralUrl(registeredStudent.referral_code);
    const message = `Hey! I'm joining a free workshop where we build an AI project in 60 minutes 🚀\n\nYou can join too:\n${url}\n\nLet's build something together!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* If already registered, show the Success Screen */}
      {registeredStudent ? (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              You're in! 🎉
            </h2>
            <p className="text-emerald-400 font-semibold text-sm">
              Your workshop seat is reserved for this Saturday at 6:00 PM IST.
            </p>
          </div>

          {/* Referral Code Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Your Unique Referral Code
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-mono font-black text-indigo-300 tracking-wider bg-indigo-950/60 px-4 py-1.5 rounded-xl border border-indigo-500/30">
                {registeredStudent.referral_code}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Invite your friends. Every successful registration is counted toward your referral score on the <strong>Campus Leaderboard</strong>.
            </p>
          </div>

          {/* Share Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Referral Link'}</span>
            </button>
          </div>

          {/* Milestone Teaser */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>🎁 Milestone: Invite 3 friends for Starter Toolkit</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View My Referrals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : (
        /* Registration Form */
        <div className="space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free Live Workshop • 60 Mins</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Reserve Your Seat
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {selectedProjectTitle ? (
                <span>Registering to build: <strong className="text-indigo-300">{selectedProjectTitle}</strong></span>
              ) : (
                'Claim your spot before the 500 participant limit is reached.'
              )}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sachin Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  College / Personal Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sachin@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* College */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                College Name
              </label>
              <select
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {colleges.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Branch & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Year of Study
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Final Year">Final Year (Batch 2025/2026)</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="2nd Year">2nd Year</option>
                </select>
              </div>
            </div>

            {/* Referral Code (Optional / Auto-filled) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Referral Code (Optional)
                </label>
                {formData.referral_code_used && (
                  <span className="text-[11px] text-emerald-400 font-mono">Code Applied</span>
                )}
              </div>
              <input
                type="text"
                value={formData.referral_code_used}
                onChange={(e) => setFormData({ ...formData, referral_code_used: e.target.value })}
                placeholder="e.g. SACHIN27"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm uppercase font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Securing Workshop Seat...
                </span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Confirm Free Registration</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero cost • No credit card needed • Instant referral code</span>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
