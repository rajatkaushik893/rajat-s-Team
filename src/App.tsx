import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, Cpu, Clock, Terminal, CheckCircle2, 
  HelpCircle, BookOpen, Layers, Award
} from 'lucide-react';
import { Document } from './types';
import { PRELOADED_BOOKS } from './data';
import { DocumentConsole } from './components/DocumentConsole';
import { CollegeHub } from './components/CollegeHub';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lab' | 'college'>('lab');
  const [documents, setDocuments] = useState<Document[]>(PRELOADED_BOOKS);
  const [activeDoc, setActiveDoc] = useState<Document>(PRELOADED_BOOKS[0]);
  const [systemTime, setSystemTime] = useState(new Date());

  // Keep a dynamic ticking UTC time to match AI Studio environment
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSystemTime = () => {
    return systemTime.toUTCString().replace("GMT", "UTC");
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#e0e0e6] flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-250">
      
      {/* PRINCIPAL NAVIGATION HEADER */}
      <header className="border-b border-white/10 bg-[#15171d] sticky top-0 z-30 px-center py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Logo Brand Segment */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <BookOpen className="w-5 h-5 font-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                    Book Brain <span className="text-indigo-400">AI</span>
                  </h1>
                  <span className="text-[9px] uppercase tracking-widest font-mono bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
                    COLLEGE PROTOTYPE
                  </span>
                </div>
                <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase tracking-widest">
                  Academic Document Intelligence Platform
                </p>
              </div>
            </div>
          </div>

          {/* Controller Mode Swapper */}
          <div className="flex items-center gap-3">
            <div className="flex bg-[#111318] p-1 rounded-xl border border-white/10" id="main_tab_navigator">
              <button
                onClick={() => setActiveTab('lab')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTab === 'lab' 
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]' 
                    : 'text-white/50 hover:text-white'
                }`}
                id="doc_lab_tab_btn"
              >
                <Layers className="w-3.5 h-3.5" />
                Document Intelligence Lab
              </button>
              
              <button
                onClick={() => setActiveTab('college')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTab === 'college' 
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]' 
                    : 'text-white/50 hover:text-white'
                }`}
                id="college_hub_tab_btn"
              >
                <Award className="w-3.5 h-3.5" />
                College Project Sync Hub
              </button>
            </div>

            {/* Micro Live metrics block */}
            <div className="hidden lg:flex items-center gap-3 bg-[#111318] px-3 py-2 rounded-lg border border-white/10 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 text-white/40">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-white/60 truncate max-w-[170px]" title={formatSystemTime()}>
                  {formatSystemTime().substring(0, 25)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CORE FRAMEWORK WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:px-8">
        
        {/* Core Quick stats ticker bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" id="primary_status_ticker">
          <div className="bg-[#15171d] border border-white/10 rounded-xl p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest block mb-1">Retrieval Tech</span>
            <span className="text-sm font-medium">Augmented RAG Pipeline</span>
          </div>
          <div className="bg-[#15171d] border border-white/10 rounded-xl p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest block mb-1">AI Cognitive Model</span>
            <span className="text-sm font-medium">gemini-3.5-flash</span>
          </div>
          <div className="bg-[#15171d] border border-white/10 rounded-xl p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest block mb-1">Local Vector Store</span>
            <span className="text-sm font-medium">FAISS Vector Index</span>
          </div>
          <div className="bg-[#15171d] border border-white/10 rounded-xl p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest block mb-1">Submission Mode</span>
            <span className="text-sm font-medium">Python Streamlit Server</span>
          </div>
        </div>

        {/* Tab contents router */}
        <div className="min-h-[500px]" id="tab_contents_outlet">
          {activeTab === 'lab' ? (
            <DocumentConsole 
              activeDoc={activeDoc} 
              onSelectedDoc={setActiveDoc}
              documents={documents}
              setDocuments={setDocuments}
            />
          ) : (
            <CollegeHub />
          )}
        </div>
      </main>

      {/* DETAILED ETHICAL FOOTER FOOTNOTE */}
      <footer className="border-t border-white/10 bg-[#111318] px-4 py-6 md:px-8 text-center text-[10px] md:text-xs text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="text-left space-y-0.5">
            <p className="font-bold text-white/50">📚 Book Brain Document QA Pipeline & Code Terminal</p>
            <p className="text-white/30">Built with modern server-side Google GenAI SDK and Express proxy modules.</p>
          </div>
          <div className="text-right">
            <span className="bg-[#1c1e26] text-white/50 border border-white/10 px-2.5 py-1 rounded inline-block">
              Institutional Grade Submission Material • Standard Compliance
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
