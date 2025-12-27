import { useState, useRef, useEffect } from 'react';
import { Upload, Send, FileText, Trash2, Loader2 } from 'lucide-react';
import { API_URL } from '../config/config';
import Header from './Header';
import Label from './Label';
import Welcome from './Welcome';

export default function StudentLM() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isQuerying, setIsQuerying] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileUpload = async (e) => {
        const uploadedFiles = Array.from(e.target.files);
        setIsProcessing(true);

        try {
            const formData = new FormData();
            uploadedFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setFiles(prev => [...prev, ...uploadedFiles]);

            setMessages(prev => [...prev, {
                role: 'system',
                content: data.message + ' - ' + data.files.map(f => `${f.name} (${f.chunks} chunks)`).join(', ')
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'system',
                content: `Error uploading files: ${error.message}`
            }]);
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setIsQuerying(true);

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const response = await fetch(`${API_URL}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Query failed');
            }

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.answer,
                sources: data.sources
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'system',
                content: `Error: ${error.message}`
            }]);
        } finally {
            setIsQuerying(false);
        }
    };

    const clearFiles = async () => {
        try {
            await fetch(`${API_URL}/clear`, { method: 'POST' });
            setFiles([]);
            setMessages([]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'system',
                content: `Error clearing files: ${error.message}`
            }]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 shadow-xl">
            <Header />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r p-4 overflow-y-auto">
                    <div className="mb-4">
                        <Label text='Upload Documents' />
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".txt,.md,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload Files
                                </>
                            )}
                        </button>
                    </div>

                    {files.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Uploaded Files ({files.length})
                                </h3>
                                <button
                                    onClick={clearFiles}
                                    className="text-red-600 hover:text-red-800"
                                    title="Clear all files"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                        <FileText className="w-4 h-4 text-gray-600 shrink-0" />
                                        <span className="truncate text-gray-700">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!files.length && (
                        <div className="text-center text-gray-500 text-sm mt-8">
                            No files uploaded yet. Upload .txt, .md, or .pdf files to get started.
                        </div>
                    )}

                    {/* <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-700">
                        <p className="font-semibold mb-1">Backend Status:</p>
                        <p>Make sure server is running on port 3001</p>
                    </div> */}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {messages.length === 0 ? (
                            <Welcome />
                        ) : (
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-2xl rounded-lg px-4 py-3 ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : msg.role === 'system'
                                                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                                        : 'bg-white text-gray-800 border border-gray-200'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                                                    Sources: {[...new Set(msg.sources.filter(s => s != null))].join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t bg-white p-4">
                        <div className="max-w-4xl mx-auto flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask a question about your documents..."
                                disabled={isQuerying || files.length === 0}
                                className="flex-1 px-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || isQuerying || files.length === 0}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2"
                            >
                                {isQuerying ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}