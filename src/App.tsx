/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Heart, 
  Lightbulb,
  ChevronRight,
  Loader2,
  CheckCircle2,
  History,
  Smartphone,
  MessageSquare,
  Moon,
  Users,
  Presentation,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getDisciplineSuggestion, type DisciplineSuggestion } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BEHAVIORS = [
  { id: 'not-paying-attention', label: 'Not paying attention', icon: AlertCircle },
  { id: 'talking-during-class', label: 'Talking during class', icon: MessageSquare },
  { id: 'using-phone', label: 'Using phone', icon: Smartphone },
  { id: 'not-participating', label: 'Not participating', icon: Users },
  { id: 'sleeping-in-class', label: 'Sleeping in class', icon: Moon },
];

const FREQUENCIES = [
  { id: 'first-time', label: 'First time' },
  { id: 'repeated-behavior', label: 'Repeated behavior' },
];

const CLASS_TYPES = [
  { id: 'lecture', label: 'Lecture', icon: Presentation },
  { id: 'practical', label: 'Practical', icon: BookOpen },
  { id: 'discussion', label: 'Discussion', icon: Users },
];

export default function App() {
  const [studentName, setStudentName] = useState('');
  const [behavior, setBehavior] = useState(BEHAVIORS[0].id);
  const [frequency, setFrequency] = useState(FREQUENCIES[0].id);
  const [classType, setClassType] = useState(CLASS_TYPES[0].id);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<DisciplineSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedBehavior = BEHAVIORS.find(b => b.id === behavior)?.label || behavior;
      const selectedFrequency = FREQUENCIES.find(f => f.id === frequency)?.label || frequency;
      const selectedClassType = CLASS_TYPES.find(c => c.id === classType)?.label || classType;

      const result = await getDisciplineSuggestion(studentName || 'the student', selectedBehavior, selectedFrequency, selectedClassType);
      setSuggestion(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Classroom Discipline Assistant</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Constructive & Educational</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="md:col-span-5 space-y-8">
            <section className="space-y-4">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student name..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
              />
            </section>

            <section className="space-y-4">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} /> Student Behavior
              </label>
              <div className="grid gap-2">
                {BEHAVIORS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setBehavior(item.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                      behavior === item.id 
                        ? "bg-white border-emerald-500 shadow-md shadow-emerald-50 text-emerald-700 font-medium" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                    )}
                  >
                    <item.icon size={18} className={cn(behavior === item.id ? "text-emerald-500" : "text-slate-400")} />
                    <span className="text-sm">{item.label}</span>
                    {behavior === item.id && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <History size={14} /> Frequency
              </label>
              <div className="flex p-1 bg-slate-200/50 rounded-xl">
                {FREQUENCIES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFrequency(item.id)}
                    className={cn(
                      "flex-1 py-2 text-sm rounded-lg transition-all",
                      frequency === item.id 
                        ? "bg-white text-slate-900 shadow-sm font-medium" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} /> Class Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CLASS_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setClassType(item.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center",
                      classType === item.id 
                        ? "bg-white border-emerald-500 shadow-md shadow-emerald-50 text-emerald-700 font-medium" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                    )}
                  >
                    <item.icon size={20} className={cn(classType === item.id ? "text-emerald-500" : "text-slate-400")} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Generate Suggestion
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              {!suggestion && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-dashed border-slate-300"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <GraduationCap size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">Ready to assist</h3>
                  <p className="text-slate-500 text-sm max-w-[280px] mt-2">
                    Select the student behavior and class details to get a constructive corrective action.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200"
                >
                  <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
                  <h3 className="text-lg font-medium text-slate-900">Consulting Pedagogical Best Practices...</h3>
                  <p className="text-slate-500 text-sm mt-2">Crafting a respectful and educational response.</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-red-100 bg-red-50/30"
                >
                  <AlertCircle className="text-red-500 mb-4" size={40} />
                  <h3 className="text-lg font-medium text-red-900">Something went wrong</h3>
                  <p className="text-red-600/70 text-sm mt-2">{error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="mt-6 text-sm font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={14} /> Try again
                  </button>
                </motion.div>
              )}

              {suggestion && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Corrective Action Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Corrective Action</h4>
                        <p className="text-lg font-medium text-slate-900 leading-relaxed">
                          {suggestion.correctiveAction}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Educational Task Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Educational Task</h4>
                        <p className="text-slate-700 leading-relaxed">
                          {suggestion.educationalTask}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Encouragement Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                        <Heart size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Positive Encouragement</h4>
                        <p className="text-slate-700 italic leading-relaxed">
                          "{suggestion.encouragementMessage}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reasoning Card */}
                  <div className="bg-emerald-900 p-6 rounded-3xl text-emerald-50 shadow-xl shadow-emerald-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center text-emerald-300 shrink-0">
                        <Lightbulb size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest">Why this works</h4>
                        <p className="text-sm leading-relaxed opacity-90">
                          {suggestion.reasoning}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-xs tracking-wide uppercase">
          Focus on growth • Respectful environment • Better learning
        </p>
      </footer>
    </div>
  );
}
