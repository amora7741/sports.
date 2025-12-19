'use client';

import type React from 'react';

import { useState } from 'react';
import ShaderBackground from '@/components/ShaderBackground';
import { motion } from 'motion/react';
import { Check, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [authPassed, setAuthPassed] = useState<boolean | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/check-auth', {
        method: 'POST',
        body: JSON.stringify({ passcode }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { auth } = await response.json();

      if (!auth) {
        setAuthPassed(false);
        setPasscode('');
        return;
      }

      setAuthPassed(true);

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPasscode(value);
  };

  return (
    <ShaderBackground>
      <div className='relative z-10 flex items-center justify-center min-h-dvh px-4'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className=' bg-white/5 border w-full max-w-md border-white/10 rounded-2xl p-8 shadow-2xl'>
            <h1 className='text-4xl font-bold text-white mb-2 text-center'>
              Enter Passcode
            </h1>
            <p className='text-white/60 text-center mb-8'>
              Please enter your 6-digit passcode to continue
            </p>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <input
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                value={passcode}
                onChange={handleChange}
                placeholder='000000'
                className={cn(
                  'w-full px-6 py-4 text-center text-3xl font-mono tracking-[0.5em] bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/20 transition-all',
                  {
                    'border-red-500':
                      typeof authPassed === 'boolean' && !authPassed,
                  }
                )}
                maxLength={6}
                autoFocus
              />

              {typeof authPassed === 'boolean' && !authPassed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 100, y: 0 }}
                  className='text-red-500 text-center'
                >
                  Invalid passcode.
                </motion.p>
              )}

              <button
                type='submit'
                disabled={passcode.length !== 6}
                className='flex items-center justify-center w-full py-4 text-white cursor-pointer bg-primary font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <LoaderCircle className='animate-spin' />
                ) : authPassed ? (
                  <Check />
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </ShaderBackground>
  );
}
