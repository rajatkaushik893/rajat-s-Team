import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for sending document contents
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Lazy init of Gemini API
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not set. Mock responses will be returned.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Q&A RAG chat endpoint using Gemini AI
app.post("/api/chat", async (req, res) => {
  try {
    const { message, documentContent, documentTitle, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();

    // Context formatting
    const contextText = documentContent 
      ? `Document Title: "${documentTitle || 'Uploaded Book'}"\n\n--- DOCUMENT START ---\n${documentContent.substring(0, 50000)}\n--- DOCUMENT END ---` 
      : "No document is currently selected.";

    // Format chat history for Gemini contents
    // Structure contents array with previous turns + newest turn
    const contents: any[] = [];
    
    // Base prompt explaining the RAG context
    const systemPrompt = `You are "Book Brain AI", a brilliant academic document analysis assistant and reading tutor.
Your goal is to answer questions strictly using the provided document/book context. 

Guidelines:
1. Ground your answers deeply in the provided text.
2. If the answer cannot be found or gathered from the text, reply: "I couldn't find precise information about that in the active document. However, based on general knowledge..." and then answer cleanly.
3. Keep answers clear, professional, and well-structured, utilizing bullet points where necessary.
4. Point out which chapter, letters, or sections your facts come from.
5. In addition to answering the query, briefly (1-2 sentences) suggest a follow-up educational prompt or question that the user can ask next to explore the document deeper, formatted separately at the end as "Suggested Follow-up:".

Current context info:
${contextText}`;

    // Map history to contents array
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        contents.push({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    if (ai) {
      // Real API Call
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        }
      });

      const replyText = response.text || "Sorry, I could not generate a response.";
      return res.json({ text: replyText });
    } else {
      // Mock Fallback when GEMINI_API_KEY is missing
      const fallbackReplies = [
        `[Demo Mode] As "Book Brain AI", I read your query about "${documentTitle || 'the book'}". Under regular operation, I would analyze the ${documentContent ? documentContent.length : 0} characters of text and retrieve precise answers from Sun Tzu, Mary Shelley, or Arthur Conan Doyle. To unlock true AI capabilities, please add a valid GEMINI_API_KEY to the Settings Secrets panel!`,
        `[Demo Mode] Looking at the active document, I can see interesting themes here. Ask your mentor for a Gemini API key to run beautiful semantic similarity search queries over this document instantly.`,
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ text: randomReply + "\n\nSuggested Follow-up: What is the primary message of this document?" });
    }
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error in Gemini AI Chat." });
  }
});

// 2. API: Dynamic text downloader for college scripts
app.get("/api/college/download/:filename", (req, res) => {
  const { filename } = req.params;

  if (filename === "app.py") {
    const appPyCode = `import streamlit as st
import os
from google import genai
from google.genai import types

# Set page layout and aesthetics
st.set_page_config(
    page_title="Book Brain AI - Document QA System", 
    page_icon="📚", 
    layout="wide"
)

# Deep Custom CSS styling for polished look
st.markdown("""
<style>
    .main-title {
        font-size: 3rem !important;
        font-weight: 800 !important;
        color: #0E76A8;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    .subtitle {
        font-size: 1.2rem;
        color: #555;
        text-align: center;
        margin-bottom: 2rem;
    }
    .stButton>button {
        background-color: #0E76A8;
        color: white;
        border-radius: 8px;
    }
    .chat-card {
        padding: 1rem;
        border-radius: 10px;
        background-color: #f0f2f6;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-title">📚 Book Brain AI</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Dynamic Knowledge Engine & Document Intelligence RAG System</div>', unsafe_allow_html=True)

# Sidebar configuration
st.sidebar.title("🛠️ Project Controls")
st.sidebar.markdown("This software acts as your interactive **College Minor/Major Project** submission.")

api_key = st.sidebar.text_input("Enter Gemini API Key", type="password", help="Securely input your Google AI Studio API key")
if not api_key:
    # Fallback to env variable
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if api_key:
        st.sidebar.success("🔑 API Key loaded from server environment!")

# File uploader
uploaded_file = st.sidebar.file_uploader("Upload Document (Text/Markdown)", type=["txt", "md", "json"])

# Main layout split
col1, col2 = st.columns([1, 1])

document_text = ""
document_name = ""

if uploaded_file is not None:
    document_name = uploaded_file.name
    document_text = uploaded_file.read().decode("utf-8")
    st.sidebar.success(f"Loaded: {document_name} ({len(document_text)} characters)")
else:
    # Preloaded classic text for demonstration
    document_name = "Sun Tzu - The Art of War (Excerpt)"
    document_text = """
    The Art of War is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin.
    All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive.
    If you know the enemy and know yourself, you need not fear the result of a hundred battles.
    """
    st.sidebar.info("Using pre-loaded demo text. Upload custom files to customize.")

with col1:
    st.subheader("📄 Document Frame Viewer")
    st.info(f"Viewing: **{document_name}**")
    st.text_area("Document Content Preview", value=document_text, height=350, disabled=True)

with col2:
    st.subheader("🧠 Ask Book Brain AI")
    user_query = st.text_input("Ask a question based on this document:")
    
    if st.button("Generate Smart Answer"):
        if not user_query:
            st.warning("Please enter a question first!")
        elif not api_key:
            st.error("Please provide a Gemini API Key in the sidebar to power the system.")
        else:
            with st.spinner("Analyzing document context and synthesizing response..."):
                try:
                    # Leverage the modern Google GenAI SDK as prescribed
                    client = genai.Client(api_key=api_key)
                    
                    system_instructions = (
                        "You are 'Book Brain AI', a brilliant academic document analysis assistant. "
                        "Synthesize an answer to the user's question using ONLY the following context:\\n\\n"
                        f"=== CONTEXT DOCUMENT ===\\n{document_text}\\n=== END CONTEXT ===\\n\\n"
                        "Be extremely thorough, format with bullet points, and mention which sections you gathered the solution from."
                    )
                    
                    response = client.models.generate_content(
                        model='gemini-3.5-flash',
                        contents=user_query,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instructions,
                            temperature=0.2,
                        ),
                    )
                    
                    st.write("### 📢 Brain Synthesis Result:")
                    st.success(response.text)
                except Exception as e:
                    st.error(f"Error calling Gemini Client: {str(e)}")
                    st.warning("Ensure your API key is correct and valid for gemini-3.5-flash.")
`;
    res.setHeader('Content-disposition', 'attachment; filename=app.py');
    res.setHeader('Content-type', 'text/plain');
    return res.end(appPyCode);
  }

  if (filename === "requirements.txt") {
    const reqs = `streamlit>=1.30.0
google-genai>=1.29.0
`;
    res.setHeader('Content-disposition', 'attachment; filename=requirements.txt');
    res.setHeader('Content-type', 'text/plain');
    return res.end(reqs);
  }

  return res.status(404).send("File not found");
});

// Vite middleware for development
let startServerPromise = (async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Book Brain AI Server] running on http://0.0.0.0:${PORT}`);
  });
})();
