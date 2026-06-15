import { useState } from 'react';
import { Search, Send, Sparkles, BookOpen, HelpCircle, Lightbulb, Loader2 } from 'lucide-react';
import axios from 'axios';

const Assistant = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('semantic'); // semantic or hybrid

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const endpoint = searchType === 'semantic' 
        ? `http://localhost:3001/api/search/semantic`
        : `http://localhost:3001/api/search/hybrid`;
      
      const response = await axios.get(endpoint, {
        params: { query: query, limit: 10 }
      });

      setResults(response.data.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const quickSearches = [
    'How to configure settings?',
    'Reset password',
    'User permissions',
    'Change theme',
    'Create category'
  ];

  const handleQuickSearch = (text) => {
    setQuery(text);
  };

  const getSimilarityColor = (similarity) => {
    if (similarity > 0.6) return '#4ade80'; // Green
    if (similarity > 0.4) return '#fbbf24'; // Yellow
    return '#f87171'; // Red
  };

  return (
    <div className="page-grid" style={{ minHeight: '100vh', padding: '32px', position: 'relative' }}>
      {/* Ambient Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="fade-in-up text-center" style={{ marginBottom: '40px' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 pulse-glow" 
               style={{ background: 'var(--gradient)' }}>
            <Sparkles className="w-10 h-10" style={{ color: '#fff' }} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            AI Assistant
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Ask questions using natural language • Powered by semantic vector search
          </p>
        </div>

        {/* Search Box */}
        <div className="card fade-in-up" style={{ marginBottom: '32px', animationDelay: '0.1s' }}>
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-4 mb-4">
              <div style={{ flex: 1, position: 'relative' }}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-field"
                  placeholder="Ask me anything... (e.g., How do I reset my password?)"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                />
                {loading && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--accent-2)' }} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="btn-primary flex items-center gap-2"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Send className="w-4 h-4" />
                Search
              </button>
            </div>

            {/* Search Type Toggle */}
            <div className="flex items-center gap-4">
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Search Type:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchType('semantic')}
                  className={searchType === 'semantic' ? 'btn-primary' : 'btn-ghost'}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Semantic (AI)
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('hybrid')}
                  className={searchType === 'hybrid' ? 'btn-primary' : 'btn-ghost'}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  <Lightbulb className="w-3 h-3 inline mr-1" />
                  Hybrid (AI + Keyword)
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Searches */}
        {results.length === 0 && !loading && (
          <div className="fade-in-up" style={{ animationDelay: '0.2s', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
              💡 Try these quick searches:
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((text, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(text)}
                  className="btn-ghost"
                  style={{ fontSize: '12px' }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                📊 Found {results.length} relevant results
              </h2>
              <span className="badge-active" style={{ fontFamily: "'Fira Code', monospace" }}>
                {searchType === 'semantic' ? 'AI_SEMANTIC' : 'AI_HYBRID'}
              </span>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="card fade-in-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--gradient)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {result.type === 'explanation' ? (
                        <BookOpen className="w-6 h-6" style={{ color: '#fff' }} />
                      ) : (
                        <HelpCircle className="w-6 h-6" style={{ color: '#fff' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 style={{ 
                          fontSize: '16px', 
                          fontWeight: 600, 
                          color: 'var(--text-primary)',
                          lineHeight: 1.4
                        }}>
                          {result.title || result.question}
                        </h3>
                        {result.similarity && (
                          <div style={{
                            padding: '4px 10px',
                            background: `${getSimilarityColor(result.similarity)}20`,
                            border: `1px solid ${getSimilarityColor(result.similarity)}40`,
                            borderRadius: '100px',
                            whiteSpace: 'nowrap'
                          }}>
                            <span style={{ 
                              fontSize: '11px', 
                              fontFamily: "'Fira Code', monospace",
                              color: getSimilarityColor(result.similarity),
                              fontWeight: 600
                            }}>
                              {Math.round(result.similarity * 100)}% Match
                            </span>
                          </div>
                        )}
                      </div>

                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '12px'
                      }}>
                        {result.content || result.answer}
                      </p>

                      {/* Keywords */}
                      {result.keywords && result.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.slice(0, 5).map((keyword, idx) => (
                            <span 
                              key={idx}
                              style={{
                                padding: '2px 8px',
                                background: 'rgba(6, 182, 212, 0.08)',
                                border: '1px solid rgba(6, 182, 212, 0.2)',
                                borderRadius: '4px',
                                fontSize: '11px',
                                color: 'var(--accent-3)',
                                fontFamily: "'Fira Code', monospace"
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && query && (
          <div className="card text-center fade-in-up" style={{ padding: '60px 40px', animationDelay: '0.3s' }}>
            <Search className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              No results found
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Try rephrasing your question or use one of the quick searches above
            </p>
          </div>
        )}

        {/* Info Card */}
        {results.length === 0 && !loading && !query && (
          <div className="card fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 mt-1" style={{ color: 'var(--accent-2)' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  🤖 How AI Assistant Works
                </h3>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <p style={{ marginBottom: '12px' }}>
                    Our AI Assistant uses <strong style={{ color: 'var(--accent-3)' }}>semantic vector search</strong> with 384-dimensional embeddings to understand the meaning behind your questions.
                  </p>
                  <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
                    <li>🎯 <strong style={{ color: 'var(--text-primary)' }}>Semantic Search:</strong> AI understands meaning, not just keywords</li>
                    <li>⚡ <strong style={{ color: 'var(--text-primary)' }}>Hybrid Search:</strong> Combines AI with keyword matching</li>
                    <li>📊 <strong style={{ color: 'var(--text-primary)' }}>Relevance Scoring:</strong> See how well results match your query</li>
                  </ul>
                  <p style={{ 
                    padding: '12px', 
                    background: 'rgba(6, 182, 212, 0.08)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: "'Fira Code', monospace"
                  }}>
                    💡 Example: Search "change dark mode" and AI finds "Theme Preferences" even without exact keywords!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;
