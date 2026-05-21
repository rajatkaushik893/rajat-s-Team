import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Award, Download, Copy, FileText, Check, AlertCircle, 
  HelpCircle, ChevronRight, CheckCircle, RefreshCw, Layers, Printer
} from 'lucide-react';
import { VIVA_QUESTIONS } from '../data';

export function CollegeHub() {
  const [activeTab, setActiveTab] = useState<'code' | 'viva' | 'synopsis'>('code');
  const [copiedAppPy, setCopiedAppPy] = useState(false);
  const [copiedReqs, setCopiedReqs] = useState(false);
  
  // Viva Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Synopsis Generator state
  const [studentName, setStudentName] = useState('John Doe');
  const [rollNumber, setRollNumber] = useState('2022-CS-101');
  const [branchName, setBranchName] = useState('Computer Science & Engineering (B.Tech)');
  const [collegeName, setCollegeName] = useState('State Institute of Technology');
  const [guideName, setGuideName] = useState('Dr. Alice Smith (Associate Professor)');
  const [showReport, setShowReport] = useState(false);

  const pythonStreamlitCode = `import streamlit as st
import os
from google import genai
from google.genai import types

st.set_page_config(
    page_title="Book Brain AI - Document QA System", 
    page_icon="📚", 
    layout="wide"
)

st.title("📚 Book Brain AI Document System")
st.markdown("---")

api_key = st.sidebar.text_input("Enter Gemini API Key", type="password")
uploaded_file = st.sidebar.file_uploader("Upload Text Document", type=["txt", "md", "json"])

if uploaded_file is not None:
    document_text = uploaded_file.read().decode("utf-8")
    st.sidebar.success(f"Successfully loaded: {uploaded_file.name}")
else:
    document_text = """
    Laying Plans: The art of war is of vital importance to the State.
    All warfare is based on deception. Hence, when able to attack, we must seem unable.
    """
    st.sidebar.info("Using preloaded default context.")

user_query = st.text_input("Ask a question about the document:")

if st.button("Query Document"):
    if not user_query:
        st.warning("Please specify a question.")
    elif not api_key:
        st.error("Please provide your Google AI Studio API Key in the sidebar.")
    else:
        with st.spinner("Retrieving document context and analyzing..."):
            try:
                client = genai.Client(api_key=api_key)
                
                system_instructions = (
                    "You are 'Book Brain AI' assistant. Synthesize a concise answer using ONLY this context:\\n\\n"
                    f"=== CONTEXT ===\\n{document_text}\\n=== END CONTEXT ===\\n\\n"
                    "State which section you retrieved the answer from."
                )
                
                response = client.models.generate_content(
                    model='gemini-3.5-flash',
                    contents=user_query,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instructions,
                        temperature=0.2,
                    ),
                )
                
                st.success("Brain Synthesis Result:")
                st.write(response.text)
            except Exception as e:
                st.error(f"Error querying AI model: {str(e)}")
`;

  const requirementsTxt = `streamlit>=1.30.0
google-genai>=1.29.0
`;

  // Clipboard copies
  const handleCopyText = (text: string, type: 'app' | 'req') => {
    navigator.clipboard.writeText(text);
    if (type === 'app') {
      setCopiedAppPy(true);
      setTimeout(() => setCopiedAppPy(false), 2000);
    } else {
      setCopiedReqs(true);
      setTimeout(() => setCopiedReqs(false), 2000);
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (quizSubmitted) return;
    setSelectedAnswer(option);
  };

  const submitQuizAnswer = () => {
    if (!selectedAnswer || quizSubmitted) return;
    const isCorrect = selectedAnswer === VIVA_QUESTIONS[currentQuizIdx].correctAnswer;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setQuizSubmitted(true);
  };

  const nextQuizQuestion = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    if (currentQuizIdx < VIVA_QUESTIONS.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      // Completed, set a state or show summary
      setCurrentQuizIdx(VIVA_QUESTIONS.length);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizSubmitted(false);
  };

  // Printing the Generated Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#111318] border border-white/10 rounded-2xl p-5 md:p-6 text-left font-sans" id="college_sync_hub">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            College Project Sync & Hand-In Hub
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Everything needed to present, explain, configure, and print your major or college project presentation.
          </p>
        </div>
        
        {/* Hub Tabs */}
        <div className="flex bg-[#1c1e26] p-1 rounded-xl self-start md:self-auto border border-white/10" id="hub_tabs_container">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'code' ? 'bg-indigo-600 text-white shadow-[0_2px_10px_rgba(99,102,241,0.25)]' : 'text-white/40 hover:text-white'
            }`}
          >
            💻 Streamlit Code
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'viva' ? 'bg-indigo-600 text-white shadow-[0_2px_10px_rgba(99,102,241,0.25)]' : 'text-white/40 hover:text-white'
            }`}
          >
            🎓 Viva Classroom
          </button>
          <button
            onClick={() => setActiveTab('synopsis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'synopsis' ? 'bg-indigo-600 text-white shadow-[0_2px_10px_rgba(99,102,241,0.25)]' : 'text-white/40 hover:text-white'
            }`}
          >
            📄 Synopsis Report
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: CODE DOWNLOADS */}
        {activeTab === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            id="streamlit_code_pane"
          >
            {/* Guide Info */}
            <div className="md:col-span-1 space-y-4 font-sans">
              <div className="bg-[#15171d] p-4 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase font-bold">Python Stack</span>
                <h3 className="text-sm font-bold text-white mt-2">What is this project stack?</h3>
                <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                  To fulfill college programming standards, we designed this deployable Python package. It runs using <strong>Streamlit</strong> for the browser UI and the modern <strong>Google GenAI Client</strong> to query the document catalog.
                </p>
                <div className="mt-4 space-y-2 text-xs text-white/80 font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-450" />
                    <span>Python 3.9+ Compatible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-450" />
                    <span>Single-File Run: `app.py`</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-450" />
                    <span>Modern GenAI Integration</span>
                  </div>
                </div>
              </div>

              {/* Deployment Checklist card */}
              <div className="bg-[#15171d]/60 p-4 rounded-xl border border-white/10">
                <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> Local Run Protocol
                </h4>
                <ol className="text-xs text-white/50 space-y-3 pl-4 list-decimal leading-relaxed">
                  <li>Install libraries: <code className="bg-[#0d0e12] border border-white/10 px-1 py-0.5 text-indigo-450 text-[11px] font-mono rounded">pip install -r requirements.txt</code></li>
                  <li>Save the script below to a file named <code className="bg-[#0d0e12] border border-white/10 px-1 text-[11px] font-mono rounded">app.py</code> on your computer.</li>
                  <li>Execute terminal run: <code className="bg-[#0d0e12] border border-white/10 px-1.5 py-0.5 text-indigo-400 font-mono text-[11px] rounded">streamlit run app.py</code></li>
                  <li>Your browser will launch a brand new interface ready to show your professor!</li>
                </ol>
              </div>
            </div>

            {/* Python App & Requirements viewer */}
            <div className="md:col-span-2 space-y-4 font-sans">
              {/* File app.py */}
              <div className="bg-[#15171d] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between">
                <div className="bg-[#1c1e26] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-white/90 font-mono">app.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(pythonStreamlitCode, 'app')}
                      className="text-[11px] text-white/40 hover:text-white flex items-center gap-1 hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      {copiedAppPy ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedAppPy ? 'Copied!' : 'Copy'}
                    </button>
                    <a
                      href="/api/college/download/app.py"
                      download="app.py"
                      className="text-[11px] bg-indigo-650 hover:bg-indigo-600 text-white flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold font-sans transition-all shadow-[0_2px_10px_rgba(99,102,241,0.2)]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Code
                    </a>
                  </div>
                </div>
                <div className="p-4 overflow-x-auto max-h-[220px] font-mono text-[11px] text-white/80 leading-normal whitespace-pre bg-[#0d0e12] text-left">
                  {pythonStreamlitCode}
                </div>
              </div>

              {/* requirements.txt */}
              <div className="bg-[#15171d] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between">
                <div className="bg-[#1c1e26] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white/90 font-mono">requirements.txt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(requirementsTxt, 'req')}
                      className="text-[11px] text-white/40 hover:text-white flex items-center gap-1 hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      {copiedReqs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedReqs ? 'Copied!' : 'Copy'}
                    </button>
                    <a
                      href="/api/college/download/requirements.txt"
                      download="requirements.txt"
                      className="text-[11px] bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/20 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold font-sans transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save File
                    </a>
                  </div>
                </div>
                <div className="p-4 font-mono text-xs text-white/80 bg-[#0d0e12] text-left">
                  {requirementsTxt}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: VIVA PREPARATION EXAMS */}
        {activeTab === 'viva' && (
          <motion.div
            key="viva"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto space-y-6 font-sans"
            id="viva_classroom_pane"
          >
            <div className="bg-[#15171d] border border-white/10 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Viva Oral Exam Drill</h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Practicing standard RAG, database, and LLM reasoning questions can help you demonstrate the project with extreme confidence to your guide or external examiners.
                </p>
              </div>
            </div>

            {/* QUIZ MAIN CARD */}
            {currentQuizIdx < VIVA_QUESTIONS.length ? (
              <div className="bg-[#15171d] border border-white/10 rounded-2xl p-5 md:p-6" id="quiz_layout">
                <div className="flex items-center justify-between text-xs text-white/40 font-mono mb-4 border-b border-white/10 pb-2.5">
                  <span>Question {currentQuizIdx + 1} of {VIVA_QUESTIONS.length}</span>
                  <span>Drill Score: {quizScore} / {VIVA_QUESTIONS.length}</span>
                </div>

                <h4 className="text-sm font-bold text-white/95 mb-4 leading-relaxed">
                  {VIVA_QUESTIONS[currentQuizIdx].question}
                </h4>

                <div className="space-y-3">
                  {VIVA_QUESTIONS[currentQuizIdx].options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    let optionStyle = 'bg-[#1c1e26] border-white/10 hover:border-white/20 hover:bg-[#1c1e26]/80 text-white/80';
                    
                    if (isSelected) {
                      optionStyle = 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300';
                    }
                    if (quizSubmitted) {
                      const isCorrect = option === VIVA_QUESTIONS[currentQuizIdx].correctAnswer;
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium';
                      } else if (isSelected) {
                        optionStyle = 'bg-rose-550/10 border-rose-500/30 text-rose-300 font-medium';
                      } else {
                        optionStyle = 'bg-[#15171d]/20 border-white/5 text-white/20';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(option)}
                        disabled={quizSubmitted}
                        className={`w-full p-3 text-left rounded-xl text-xs transition-all duration-155 border flex items-center gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <ChevronRight className={`w-4 h-4 text-indigo-400 flex-shrink-0 ${quizSubmitted ? 'opacity-40' : ''}`} />
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback Description box */}
                <AnimatePresence>
                  {quizSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`mt-5 p-4 rounded-xl border text-xs text-left leading-relaxed ${
                        selectedAnswer === VIVA_QUESTIONS[currentQuizIdx].correctAnswer
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-355'
                          : 'bg-rose-950/20 border-rose-500/20 text-rose-355'
                      }`}
                      id="quiz_feedback_board"
                    >
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest font-mono mb-1.5 text-[11px]">
                        {selectedAnswer === VIVA_QUESTIONS[currentQuizIdx].correctAnswer ? (
                          <span className="text-emerald-400 flex items-center gap-1">✔ Correct Answer</span>
                        ) : (
                          <span className="text-rose-450 flex items-center gap-1">✘ Incorrect Selection</span>
                        )}
                      </div>
                      <p className="text-white/70">{VIVA_QUESTIONS[currentQuizIdx].explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action button bar */}
                <div className="mt-6 flex justify-end">
                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuizAnswer}
                      disabled={!selectedAnswer}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all select-none cursor-pointer ${
                        selectedAnswer 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_2px_10px_rgba(99,102,241,0.25)]' 
                          : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                      }`}
                    >
                      Verify Selection
                    </button>
                  ) : (
                    <button
                      onClick={nextQuizQuestion}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold font-sans bg-indigo-650 hover:bg-indigo-600 text-white transition-all select-none cursor-pointer shadow-[0_2px_10px_rgba(99,102,241,0.2)]"
                    >
                      {currentQuizIdx === VIVA_QUESTIONS.length - 1 ? 'Finish Drill' : 'Continue Drill'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Completed Quiz Panel */
              <div className="bg-[#15171d] border border-white/10 rounded-2xl p-6 text-center" id="quiz_completed_board">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Viva Examination Drill Completed!</h3>
                <p className="text-xs text-white/60 mt-2 max-w-md mx-auto leading-relaxed">
                  Excellent work! You answered <strong>{quizScore}</strong> correct answers out of <strong>{VIVA_QUESTIONS.length}</strong> topics. You are now armed with clear technical definitions to explain FAISS, Vector Store integration, and prompt engineering parameters.
                </p>
                <div className="mt-5 flex items-center justify-center gap-2">
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-sans font-bold rounded-lg text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_2px_10px_rgba(99,102,241,0.2)]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Start Over
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: Dynamic SYNOPSIS GENERATOR */}
        {activeTab === 'synopsis' && (
          <motion.div
            key="synopsis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
            id="synopsis_page_pane"
          >
            {/* Input Config form */}
            {!showReport ? (
              <div className="bg-[#15171d] border border-white/10 rounded-2xl p-5 md:p-6" id="synopsis_input_form">
                <h3 className="text-sm font-bold text-white mb-4 font-sans uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" /> Enter Student & Scholar details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase block mb-1">Scholar/Student Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-[#1c1e26] text-xs text-white border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase block mb-1">Candidacy Roll Number</label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="w-full bg-[#1c1e26] text-xs text-white border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase block mb-1">Course & Stream Department</label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full bg-[#1c1e26] text-xs text-white border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase block mb-1">College/Institution Campus</label>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full bg-[#1c1e26] text-xs text-white border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase block mb-1">Project Guide/Faculty Supervisor</label>
                    <input
                      type="text"
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      className="w-full bg-[#1c1e26] text-xs text-white border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowReport(true)}
                    className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold font-sans rounded-xl cursor-pointer shadow-[0_2px_10px_rgba(99,102,241,0.25)] transition-all"
                  >
                    Compile Academic Synopsis Report
                  </button>
                </div>
              </div>
            ) : (
              /* THE GENERATED PRINTABLE FORMAT REPORT WINDOW */
              <div className="space-y-4" id="synopsis_printable_layout">
                {/* Print command panel */}
                <div className="flex justify-between items-center bg-[#15171d] p-4 rounded-xl border border-white/10 font-sans">
                  <span className="text-xs text-white/60">📄 Successfully Compiled Project Synopsis. Set printers layout to vertical.</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowReport(false)}
                      className="text-xs bg-[#1c1e26] hover:bg-[#1c1e26]/80 text-white/80 px-3 py-1.5 rounded-lg font-sans border border-white/10 cursor-pointer transition-colors"
                    >
                      Configure Info
                    </button>
                    <button
                      onClick={handlePrint}
                      className="text-xs bg-indigo-650 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold font-sans flex items-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(99,102,241,0.2)] transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Project Document
                    </button>
                  </div>
                </div>

                {/* Report layout card */}
                <div 
                  className="bg-white text-slate-900 p-8 rounded-xl max-w-4xl mx-auto shadow-2xl space-y-8 font-sans text-left" 
                  id="academic_formatted-pro-report"
                >
                  {/* Top header institutional template */}
                  <div className="text-center border-b-2 border-slate-800 pb-5">
                    <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900">Project Synopsis Report</h1>
                    <h2 className="text-base font-bold text-indigo-700 mt-1 uppercase">"Book Brain AI Document System"</h2>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">Classification: College Minor/Major Lab Project Submission</p>
                  </div>

                  {/* Student bio list block */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Candidate student</span>
                      <strong className="text-xs text-slate-800">{studentName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">University Roll Number</span>
                      <strong className="text-xs text-slate-800">{rollNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Course Stream Department</span>
                      <strong className="text-xs text-slate-800">{branchName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Faculty Mentor Guide</span>
                      <strong className="text-xs text-slate-800">{guideName}</strong>
                    </div>
                    <div className="col-span-2 border-t border-slate-200 pt-3">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Affiliated Institution Campus</span>
                      <strong className="text-xs text-slate-800">{collegeName}</strong>
                    </div>
                  </div>

                  {/* Project Abstract Block */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-l-4 border-indigo-600 pl-2 mb-2">10.1 Abstract Overview</h3>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      In classical textbook retrieval, readers face challenges digesting 500+ page books rapidly to solve specific coursework questions. The <strong>Book Brain AI Document System</strong> proposes a Retrieval-Augmented Generation (RAG) toolchain allowing users to parse documents in multiple formats (TXT, MD, JSON, CSV), index dynamic segments, and execute semantic inquiries using the <strong>Google Gemini API and Streamlit Cloud</strong> hosting. It features dynamic token optimization limits, contextual prompt templates, and real-time validation layers.
                    </p>
                  </div>

                  {/* Block Diagram Architecture visualization */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-l-4 border-indigo-600 pl-2 mb-3">10.2 Block Diagram & System Architecture</h3>
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-[10px] sm:text-xs overflow-x-auto text-center leading-normal">
{`+-------------------------------------------------------------+
|               User Web Browser UI Layout (Streamlit / React)|
+-------------------------------------------------------------+
                               | (HTTP Upload + Text Query)
                               v
+-------------------------------------------------------------+
|               Document Preprocessor & Chunking Engine       |
|    - Splits book text into characters segments with overlaps|
+-------------------------------------------------------------+
                               | (Context Segments)
                               v
+-------------------------------------------------------------+
|               Similarity Matrix & Context Injection Layer   |
|               - Matches query with chunk vectors            |
+-------------------------------------------------------------+
                               | (Augmented Prompts)
                               v
+-------------------------------------------------------------+
|               Google Gemini AI Model (gemini-3.5-flash)     |
+-------------------------------------------------------------+
                               | (Synthesized Response)
                               v
+-------------------------------------------------------------+
|               Structured Explanation & Citations Output     |
+-------------------------------------------------------------+`}
                    </div>
                    <span className="text-[10px] text-slate-500 block text-center mt-1.5 italic">Figure 1: Mathematical Data Flow diagram of Book Brain AI RAG System</span>
                  </div>

                  {/* Modules segment breakdown */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-l-4 border-indigo-600 pl-2 mb-2">10.3 Core Operational Modules</h3>
                    <ul className="text-xs text-slate-700 space-y-2.5 list-disc pl-5">
                      <li><strong>Document Ingestion Pipeline:</strong> Handles FileReader streaming on the client platform. Ingests classic books and dynamic TXT configurations securely.</li>
                      <li><strong>Vector Chunking Simulator:</strong> Breaks down content and performs localized linear string similarity math to mimic vector catalog retrievals.</li>
                      <li><strong>Cognitive Synthesis:</strong> Relies on the modern server-side `@google/genai` API proxy to run `generateContent` leveraging custom system instructions, avoiding API exposure to client browsers.</li>
                    </ul>
                  </div>

                  {/* Future Directions footer */}
                  <div className="pt-5 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-l-4 border-indigo-600 pl-2 mb-2">10.4 Conclusion & Future Scope</h3>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      This system validates the usability of generative AI in learning assistance. For future expansion, we aim to implement permanent vector storage using Pinecone or Milvus cloud databases, support image extraction from PDFs, and implement real-time voice guidance using Gemini Audio modality.
                    </p>
                  </div>

                  {/* Faculty signature line */}
                  <div className="pt-10 flex justify-between items-center text-xs text-slate-500 font-mono">
                    <div className="text-center">
                      <div className="w-32 border-b border-slate-400 mx-auto mb-1" />
                      <span>{studentName}<br/>(Candidate Student)</span>
                    </div>
                    <div className="text-center">
                      <div className="w-32 border-b border-slate-400 mx-auto mb-1" />
                      <span>{guideName}<br/>(Project Supervisor)</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
