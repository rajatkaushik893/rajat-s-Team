import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Sparkles, Upload, Search, FileText, Brain, Cpu, 
  ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Star, Trash2, Send
} from 'lucide-react';
import { Document, ChatMessage } from '../types';
import { PRELOADED_BOOKS } from '../data';

interface DocumentConsoleProps {
  onSelectedDoc: (doc: Document) => void;
  activeDoc: Document;
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export function DocumentConsole({ activeDoc, onSelectedDoc, documents, setDocuments }: DocumentConsoleProps) {
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [userQuery, setUserQuery] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState<'idle' | 'searching' | 'injecting' | 'calling' | 'done'>('idle');
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize preloaded book chats if empty
  const getActiveChat = (): ChatMessage[] => {
    return chatMessages[activeDoc.id] || [
      {
        id: 'welcome',
        role: 'model',
        text: `Switched to **${activeDoc.title}** context. Ask me specific questions, exam tasks or formulas based on this text!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: getSuggestedPrompts(activeDoc.id)
      }
    ];
  };

  function getSuggestedPrompts(docId: string): string[] {
    switch (docId) {
      case 'sherlock_holmes':
        return [
          "Explain Irene Adler's relationship with Sherlock Holmes",
          "Summarize 'The Red-Headed League' scheme",
          "Who was murdered in Boscombe Valley?"
        ];
      case 'art_of_war':
        return [
          "What are Sun Tzu's five constant factors?",
          "Explain the phrase 'All warfare is based on deception'",
          "What does Sun Tzu say about supreme excellence?"
        ];
      case 'frankenstein':
        return [
          "Who is Victor Frankenstein by birth?",
          "Describe Elizabeth's character vs Victor's passion",
          "What is Robert Walton exploring in the North?"
        ];
      case 'alices_adventures':
        return [
          "What was Alice's opinion on picture-less books?",
          "Why did the White Rabbit pull out a watch?",
          "Explain the Mad Tea Party meeting"
        ];
      default:
        return [
          "Give me an executive summary of this text.",
          "What are the top 3 key themes here?",
          "Generate some test preparation questions."
        ];
    }
  }

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeDoc.id, isChatLoading]);

  // Handle manual file uploads (.txt, .md, .json)
  const handleFileUpload = (file: File) => {
    setFileError('');
    if (!file) return;

    const validTypes = ['.txt', '.md', '.json', '.csv'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(extension)) {
      setFileError('Duplicate or unsupported format! Please upload .txt, .md, or .json files.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let contentText = '';
        let title = file.name.replace(/\.[^/.]+$/, ""); // strip extension
        let summary = 'A custom user-defined document indexed dynamically.';

        if (extension === '.json') {
          const parsed = JSON.parse(e.target?.result as string);
          contentText = JSON.stringify(parsed, null, 2);
          if (parsed.title) title = parsed.title;
          if (parsed.summary) summary = parsed.summary;
        } else {
          contentText = e.target?.result as string;
        }

        if (contentText.trim().length < 10) {
          setFileError('The uploaded file seems practically empty.');
          return;
        }

        const newDoc: Document = {
          id: `custom_${Date.now()}`,
          title,
          author: 'Uploaded Document',
          category: 'User Dynamic Index',
          pageCount: Math.max(1, Math.ceil(contentText.length / 1500)),
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          createdAt: new Date().toLocaleDateString(),
          isPreloaded: false,
          content: contentText,
          summary: summary
        };

        setDocuments(prev => [...prev, newDoc]);
        onSelectedDoc(newDoc);
      } catch (err) {
        setFileError('Error reading or formatting file data.');
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Run a key question
  const askQuestion = async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    const currentDocMessages = getActiveChat();
    const newUserMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentDocMessages, newUserMessage];
    setChatMessages(prev => ({
      ...prev,
      [activeDoc.id]: updatedMessages
    }));

    setUserQuery('');
    setIsChatLoading(true);

    // Dynamic RAG state flow simulation trigger
    setRagStatus('searching');
    await new Promise(r => setTimeout(r, 600));
    setRagStatus('injecting');
    await new Promise(r => setTimeout(r, 600));
    setRagStatus('calling');

    try {
      // Map chat messages into format the Express server expects
      const payloadHistory = currentDocMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          documentContent: activeDoc.content,
          documentTitle: activeDoc.title,
          chatHistory: payloadHistory
        })
      });

      if (!res.ok) {
        throw new Error('Server responded with an error.');
      }

      const reply = await res.json();
      
      // Separate out Suggested Follow-up line if exists
      let replyText = reply.text;
      let suggestionPrompts: string[] = [];
      const suggestionMatch = replyText.match(/Suggested Follow-up:[\s\S]*$/i);
      if (suggestionMatch) {
        const suggestionRaw = suggestionMatch[0];
        replyText = replyText.replace(suggestionRaw, '').trim();
        
        // Extract follow up query safely
        const optText = suggestionRaw.replace(/Suggested Follow-up:\s*/i, '').trim();
        if (optText) {
          suggestionPrompts = [optText];
        }
      }

      // Add generic follow ups if none generated
      if (suggestionPrompts.length === 0) {
        suggestionPrompts = ["Ask for key chapters mentioned.", "Can you write an overview of this strategy?"];
      }

      const newModelMessage: ChatMessage = {
        id: `msg_model_${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: suggestionPrompts
      };

      setChatMessages(prev => ({
        ...prev,
        [activeDoc.id]: [...updatedMessages, newModelMessage]
      }));
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `msg_error_${Date.now()}`,
        role: 'model',
        text: `Error contacting server-side AI: ${err.message || "Failed request"}. Make sure your local setup is running properly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [activeDoc.id]: [...updatedMessages, errorMessage]
      }));
    } finally {
      setIsChatLoading(false);
      setRagStatus('done');
    }
  };

  // Simple in-line browser keyword search for interactive layout
  const getSearchMatches = () => {
    if (!docSearchQuery.trim()) return [];
    const normalizedQuery = docSearchQuery.toLowerCase();
    const lines = activeDoc.content.split('\n');
    return lines
      .map((line, idx) => ({ text: line.trim(), lineNum: idx + 1 }))
      .filter(item => item.text.toLowerCase().includes(normalizedQuery))
      .slice(0, 15); // limit length
  };

  const matchesOfSearch = getSearchMatches();

  // Basic stats formula
  const getDocStats = (content: string) => {
    const chars = content.length;
    const words = content.split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.round(words / 180));
    
    // Simple reading grade index formula simulation
    let complexity = "Medium (Undergraduate)";
    if (words > 1000) {
      if (chars / words > 5.5) complexity = "Advanced Scholarly (Ph.D.)";
      else if (chars / words < 4.8) complexity = "Beginner (High School)";
    }

    return { chars, words, readMinutes, complexity };
  };

  const statsDoc = getDocStats(activeDoc.content);

  // Delete uploaded custom document safely
  const deleteCustomDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = documents.filter(doc => doc.id !== id);
    setDocuments(filtered);
    if (activeDoc.id === id) {
      onSelectedDoc(filtered[0] || PRELOADED_BOOKS[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full items-stretch" id="doc_intelligence_grid">
      
      {/* 1. LEFT COLUMN: Shelf Selection */}
      <div className="lg:col-span-1 bg-[#111318] border border-white/10 rounded-2xl p-4 flex flex-col justify-between" id="shelf_section">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/50 tracking-wider uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Document Shelf
            </h3>
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              {documents.length} Indexed
            </span>
          </div>

          {/* List of Books */}
          <div className="space-y-2 max-h-[280px] lg:max-h-[380px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const isActive = doc.id === activeDoc.id;
              return (
                <div
                  key={doc.id}
                  id={`shelf_item_${doc.id}`}
                  onClick={() => onSelectedDoc(doc)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between ${
                    isActive 
                      ? 'bg-indigo-600/10 border-indigo-500/30' 
                      : 'bg-[#1c1e26]/30 border-white/10 hover:border-white/20 hover:bg-[#1c1e26]/60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <h4 className={`text-xs font-semibold line-clamp-1 ${isActive ? 'text-indigo-400' : 'text-white/80'}`}>
                      {doc.title}
                    </h4>
                    {!doc.isPreloaded && (
                      <button 
                        onClick={(e) => deleteCustomDoc(doc.id, e)}
                        className="p-1 hover:text-rose-400 text-white/30 rounded transition-colors"
                        title="Delete dynamic book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-white/40 font-mono">
                      {doc.author}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      doc.isPreloaded ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {doc.isPreloaded ? 'Academic' : 'Dynamic'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Uploader Form */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                : 'bg-[#1c1e26]/30 border-white/10 hover:border-[#1e1b4b] hover:bg-[#1c1e26]/60'
            }`}
            id="drag_drop_zone"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden" 
              accept=".txt,.md,.json,.csv"
            />
            <Upload className="w-6 h-6 text-white/30 mx-auto mb-2" />
            <span className="text-xs font-semibold text-white/75 block">
              Dynamic Class Indexer
            </span>
            <span className="text-[10px] text-white/40 block mt-1">
              Supports .txt, .md, .json, .csv
            </span>
          </div>
          {fileError && (
            <div className="flex items-center gap-1.5 mt-2 text-rose-400 text-[10px] font-mono bg-rose-950/20 px-2 py-1 rounded border border-rose-500/20 animate-pulse" id="upload_error_box">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{fileError}</span>
            </div>
          )}
        </div>
      </div>
      {/* 2. MIDDLE TWO COLUMNS: Dynamic Frame Viewer & Similarity Index & Excerpt Highlight */}
      <div className="lg:col-span-2 bg-[#15171d] border border-white/10 rounded-2xl p-5 flex flex-col justify-between" id="frame_viewer_section font-sans">
        <div>
          {/* Header Metadata badge block */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{activeDoc.title}</h2>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 font-bold uppercase tracking-widest">
                  {activeDoc.category}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">Author of Record: {activeDoc.author}</p>
            </div>
            {activeDoc.isPreloaded && (
              <span className="flex items-center gap-1 text-[11px] text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30 font-medium font-sans">
                <Star className="w-3 h-3 fill-indigo-400 text-indigo-400" /> Preallocated Book
              </span>
            )}
          </div>

          {/* Book Summary Card */}
          <div className="bg-[#1c1e26]/50 rounded-xl p-3 border border-white/10 mb-4 text-left font-sans">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Synthesis Summary
            </h4>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              {activeDoc.summary}
            </p>
          </div>

          {/* Visual Document Analytics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 font-sans">
            <div className="bg-[#1c1e26]/35 p-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-white/40 block uppercase font-mono">Word Count</span>
              <span className="text-xs font-bold font-mono text-white/95">{statsDoc.words.toLocaleString()}</span>
            </div>
            <div className="bg-[#1c1e26]/35 p-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-white/40 block uppercase font-mono">Syntactic Pages</span>
              <span className="text-xs font-bold font-mono text-white/90">{activeDoc.pageCount} Pages</span>
            </div>
            <div className="bg-[#1c1e26]/35 p-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-white/40 block uppercase font-mono">Read Difficulty</span>
              <span className="text-[11px] font-bold text-indigo-400 truncate block mt-0.5" title={statsDoc.complexity}>
                {statsDoc.complexity.split(' ')[0]}
              </span>
            </div>
            <div className="bg-[#1c1e26]/35 p-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-white/40 block uppercase font-mono">File Size</span>
              <span className="text-xs font-bold font-mono text-white/90">{activeDoc.fileSize}</span>
            </div>
          </div>

          {/* Keyword Vector Simulator Finder */}
          <div className="font-sans">
            <div className="flex items-center bg-[#1c1e26] border border-white/10 rounded-xl px-3 py-1.5 mb-3" id="book_search_bar">
              <Search className="w-4 h-4 text-white/40 mr-2 flex-shrink-0" />
              <input 
                type="text"
                placeholder="Simulate Vector Similarity Search in Text Chunks..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-white/30 focus:outline-none w-full"
              />
              {docSearchQuery && (
                <button 
                  onClick={() => setDocSearchQuery('')}
                  className="text-[10px] text-indigo-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded hover:bg-indigo-500/10 hover:text-indigo-300 transition-all font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Keyword Results matching details */}
            {docSearchQuery ? (
              <div className="bg-[#111318] border border-white/10 rounded-xl p-3 h-[180px] overflow-y-auto text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] text-indigo-400 border-b border-white/10 pb-1.5 font-mono">
                  <span>Retrieved Matches (Cos-Similarity Simulator)</span>
                  <span>{matchesOfSearch.length} chunks</span>
                </div>
                {matchesOfSearch.length === 0 ? (
                  <p className="text-xs text-white/40 italic p-4 text-center">No exact line matches found for similarity indexing.</p>
                ) : (
                  matchesOfSearch.map((match, i) => (
                    <div key={i} className="text-xs border-b border-white/5 pb-1.5 last:border-0 font-mono">
                      <div className="flex items-center justify-between text-[10px] text-indigo-400 font-mono mb-0.5 animate-pulse">
                        <span>Chunk #{i+1} Matching Stream</span>
                        <span>Line {match.lineNum}</span>
                      </div>
                      <p className="text-white/85 text-[11px] leading-tight">
                        {match.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Custom dynamic frame chapter selector */
              <div className="bg-[#111318] border border-white/10 rounded-xl p-3 h-[180px] overflow-y-auto text-left">
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Structured Chapters Outlines
                </h4>
                {activeDoc.chapters ? (
                  <div className="space-y-3">
                    {activeDoc.chapters.map((chapter, i) => (
                      <div key={i} className="border-b border-white/5 pb-2 last:border-0 last:pb-0 font-sans">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-indigo-300">{chapter.title}</span>
                          <span className="text-[10px] font-mono text-white/30">Page {chapter.page}</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-normal italic">{chapter.excerpt}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[120px] text-white/30">
                    <BookOpen className="w-8 h-8 opacity-25 mb-1 text-indigo-400" />
                    <p className="text-xs text-center font-mono">No structural chapter indexes. Using raw whole text parsing engine successfully!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footnote instruction indicator */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/30 font-mono">
          <span>RAG Retrieval Index: SHA-256 Validated</span>
          <span>Deployable Format Ready</span>
        </div>
      </div>

      {/* 3. RIGHT COLUMN: RAG AI Engine Sidebar chat */}
      <div className="lg:col-span-1 bg-[#111318] border border-white/10 rounded-2xl flex flex-col items-stretch overflow-hidden h-[500px] lg:h-auto font-sans" id="rag_sidebar_interactive">
        
        {/* Chat Widget Header */}
        <div className="bg-[#15171d] p-4 border-b border-white/10 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2">
            <div className="p-1 px-1.5 bg-indigo-600 rounded text-white flex items-center justify-center">
              <Brain className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-sans">
                RAG Synthesis
              </h3>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini Active Proxy
              </span>
            </div>
          </div>
          <button 
            onClick={() => {
              setChatMessages(prev => ({ ...prev, [activeDoc.id]: [] }));
            }}
            className="text-[10px] text-white/40 hover:text-white hover:bg-white/5 p-1 px-2 rounded border border-white/10 font-mono transition-all"
            title="Reset active chat stream"
          >
            Clear Log
          </button>
        </div>

        {/* Dynamic State Indicator */}
        <div className="bg-[#1c1e26]/50 px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono">
          <span className="text-white/40">Process State:</span>
          {ragStatus === 'idle' && <span className="text-white/60">[Idle Ready]</span>}
          {ragStatus === 'searching' && <span className="text-indigo-400 animate-pulse">[Searching DB...]</span>}
          {ragStatus === 'injecting' && <span className="text-indigo-400 animate-pulse">[Injecting Chunks]</span>}
          {ragStatus === 'calling' && <span className="text-indigo-400 animate-pulse">[Gemini Generation...]</span>}
          {ragStatus === 'done' && <span className="text-emerald-400">[Completed Retrieval]</span>}
        </div>

        {/* Message Panel list container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0d0e12]/30" id="chat_messages_flow">
          {getActiveChat().map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col text-left ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-indigo-600/10 border border-indigo-500/20 text-white/95 rounded-tl-none'
                }`}
              >
                {/* Minimalist simple Markdown bold/italic formatter */}
                <p className="whitespace-pre-wrap font-sans">
                  {msg.text.split('**').map((chunk, i) => (
                    i % 2 === 1 ? <strong key={i} className="text-indigo-300 font-bold">{chunk}</strong> : chunk
                  ))}
                </p>

                {/* Question recommendation tags */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/5 space-y-1.5 text-left">
                     <span className="text-[9px] text-[#e0e0e6]/40 font-mono block mb-1 uppercase tracking-wider font-semibold">Suggested Exploration Prompt:</span>
                     {msg.suggestedPrompts.map((prompt, idx) => (
                       <button
                         key={idx}
                         onClick={() => askQuestion(prompt)}
                         className="text-[10px] bg-[#1c1e26] text-white/80 hover:text-indigo-300 px-2 py-1.5 rounded border border-white/10 hover:border-indigo-500/40 text-left line-clamp-1 block w-full transition-all duration-150"
                       >
                         {prompt}
                       </button>
                     ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-[#e0e0e6]/30 mt-1 font-mono px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isChatLoading && (
            <div className="flex items-center gap-2 text-xs text-white/70 mr-auto bg-[#15171d] border border-white/10 rounded-2xl p-3 px-4">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span className="font-mono text-[10px]">Thinking... {
                ragStatus === 'searching' ? 'Calculating Vector Indices...' :
                ragStatus === 'injecting' ? 'Synthesizing Augmented Prompts...' : 'Querying Core LLM...'
              }</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Control Box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            askQuestion(userQuery);
          }}
          className="p-3 border-t border-white/10 bg-[#15171d]/90 flex items-center gap-2"
          id="query_submission_form"
        >
          <input 
            type="text" 
            placeholder="Query Book Contents..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={isChatLoading}
            className="flex-1 bg-[#1c1e26] text-xs text-white placeholder-white/30 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500/50"
          />
          <button 
            type="submit" 
            disabled={!userQuery.trim() || isChatLoading}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
              userQuery.trim() && !isChatLoading 
                ? 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
