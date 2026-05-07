
import React from 'react';
import TestSection from './TestSection';

const renderSafeString = (item) => {
  if (item === null || item === undefined) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'object') {
    return item.text || item.description || item.title || item.step || JSON.stringify(item);
  }
  return String(item);
};

const ensureArray = (arr) => Array.isArray(arr) ? arr : (arr ? [arr] : []);

const LabWorkspace = ({
  experiment,
  setExperiment,
  setTopic,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="lab-workspace">
      <div className="lab-header">
        <h2>{experiment.title}</h2>
        <button
          className="close-lab-btn"
          onClick={() => { setExperiment(null); setTopic(''); }}
        >
          Close Lab
        </button>
      </div>

      <div className="lab-layout">
        <aside className="lab-sidebar">
          <ul className="tab-list">
            {['aim', 'theory', 'pre-test', 'procedure', 'simulation', 'post-test', 'references'].map((tab) => (
              <li key={tab}>
                <button
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="lab-content">
          {activeTab === 'aim' && (
            <div className="tab-pane fade-in">
              <h3>Aim</h3>
              <p className="lead-text">{experiment.aim}</p>
            </div>
          )}

          {activeTab === 'theory' && (
            <div className="tab-pane fade-in">
              <h3>Theory</h3>
              <div className="text-content" dangerouslySetInnerHTML={{ __html: experiment.theory }}>
              </div>
            </div>
          )}

          {activeTab === 'pre-test' && (
            <div className="tab-pane fade-in">
              <TestSection testArray={experiment.preTest} title="Pre-Test Assessment" />
            </div>
          )}

          {activeTab === 'procedure' && (
            <div className="tab-pane fade-in">
              <h3>Procedure</h3>
              <ol className="procedure-list">
                {ensureArray(experiment.procedure).map((step, idx) => (
                  <li key={idx}>
                    <span className="step-num">{idx + 1}</span>
                    <p>{renderSafeString(step)}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="tab-pane simulation-pane fade-in">
              {/* <h3>Simulation Environment</h3> */}
              {experiment.simulation && (experiment.simulation.html || experiment.simulation.url) ? (
                <div className="simulation-card dynamic-sim">
                  {experiment.simulation.url ? (
                    <iframe
                      title="Interactive Simulation"
                      src={experiment.simulation.url}
                      style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
                    />
                  ) : (
                    <iframe
                      title="Simulation Environment"
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <style>
                              body { font-family: 'Inter', sans-serif; padding: 20px; background-color: #f9f9f9; color: #333; }
                              /* Added sensible default styling for common UI elements */
                              button { background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; }
                              button:hover { background: #2980b9; }
                              input, select, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: 'Inter', sans-serif; }
                              .sim-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                              ${experiment.simulation.css || ''}
                            </style>
                          </head>
                          <body>
                            ${experiment.simulation.html}
                            <script>
                              ${experiment.simulation.js || ''}
                            </script>
                          </body>
                        </html>
                      `}
                      style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
                    />
                  )}
                </div>
              ) : (
                <div className="simulation-card">
                  <div className="sim-placeholder">
                    <div className="sim-icon">⚙️</div>
                    <h4>Virtual Lab Environment Ready</h4>
                    <p>{renderSafeString(experiment.simulation?.description) || 'Interact with the module as specified in the procedure.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'post-test' && (
            <div className="tab-pane fade-in">
              <TestSection testArray={experiment.postTest} title="Post-Test Assessment" />
            </div>
          )}

          {activeTab === 'references' && (
            <div className="tab-pane fade-in">
              <h3>References</h3>
              <ul className="reference-list">
                {ensureArray(experiment.references).map((ref, idx) => (
                  <li key={idx}>📖 {renderSafeString(ref)}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LabWorkspace;
