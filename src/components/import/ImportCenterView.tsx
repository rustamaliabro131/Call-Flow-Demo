import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';
import { SAMPLE_CSV_CONTENT } from '../../data/mockData';

export const ImportCenterView: React.FC = () => {
  const { importCallsFromCSV, importSingleTranscript, setActiveTab, setSelectedCallId } = useCallFlow();

  const [activeMode, setActiveMode] = useState<'csv' | 'text'>('csv');
  const [dragActive, setDragActive] = useState(false);
  const [csvRawText, setCsvRawText] = useState(SAMPLE_CSV_CONTENT);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean;
    rowCount: number;
    errors: string[];
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [importSuccessResult, setImportSuccessResult] = useState<number | null>(null);

  // Manual transcript inputs
  const [textProspectName, setTextProspectName] = useState('Jonathan Reed');
  const [textCompany, setTextCompany] = useState('Veritas Capital');
  const [textAgent, setTextAgent] = useState('Sarah Jenkins');
  const [textPhone, setTextPhone] = useState('+1 (415) 309-1192');
  const [rawTranscript, setRawTranscript] = useState(
    `Agent: Good afternoon Jonathan, following up on your inquiry about high-speed data feeds.
Customer: Yes Sarah, we are currently testing Bloomberg B-PIPE but their monthly terminal fees are killing our margins. If your API can match their microsecond latency for equities and options, we're ready to switch our 12 desk traders immediately.
Agent: That's right in our wheelhouse. We run on dedicated Equinix cross-connects. Let me send you our sandbox API token.
Customer: Fantastic, let's schedule a test with our quant developer next Wednesday at 10 AM EST.`
  );
  const [copiedSample, setCopiedSample] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse & validate CSV content
  const validateCSV = (text: string, name: string = 'batch_upload.csv') => {
    setFileName(name);
    const lines = text.trim().split('\n');
    if (lines.length <= 1) {
      setValidationStatus({
        valid: false,
        rowCount: 0,
        errors: ['CSV file must contain a header row and at least one data row.'],
      });
      return;
    }

    const header = lines[0].toLowerCase();
    const hasRequired =
      header.includes('customer') || header.includes('transcript') || header.includes('name');

    if (!hasRequired) {
      setValidationStatus({
        valid: false,
        rowCount: lines.length - 1,
        errors: ['Missing required columns: CustomerName or Transcript.'],
      });
      return;
    }

    setValidationStatus({
      valid: true,
      rowCount: lines.length - 1,
      errors: [],
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        const text = event.target?.result as string;
        setCsvRawText(text);
        validateCSV(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        const text = event.target?.result as string;
        setCsvRawText(text);
        validateCSV(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'callflow_sample_transcripts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_CSV_CONTENT);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  // Execute processing simulation
  const handleExecuteImport = async () => {
    setIsProcessing(true);
    setProgressPercent(10);

    const stepInterval = setInterval(() => {
      setProgressPercent(prev => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 900));
    clearInterval(stepInterval);
    setProgressPercent(100);

    const count = importCallsFromCSV(csvRawText);
    setIsProcessing(false);
    setImportSuccessResult(count);
  };

  const handleExecuteSingleTranscript = async () => {
    setIsProcessing(true);
    setProgressPercent(50);
    await new Promise(resolve => setTimeout(resolve, 600));
    setProgressPercent(100);
    const callId = importSingleTranscript(
      textProspectName,
      textCompany,
      textAgent,
      rawTranscript,
      textPhone
    );
    setIsProcessing(false);
    setSelectedCallId(callId);
    setActiveTab('intelligence');
  };

  // Mock import history list
  const importHistory = [
    {
      id: 'imp-01',
      file: 'q4_enterprise_outbound_calls.csv',
      rows: 18,
      status: 'Completed',
      date: 'Today at 12:45',
      user: 'Sarah Jenkins',
    },
    {
      id: 'imp-02',
      file: 'ringcentral_sync_oct28.csv',
      rows: 32,
      status: 'Completed',
      date: 'Oct 28, 2026',
      user: 'David Chen',
    },
    {
      id: 'imp-03',
      file: 'dialpad_telephony_export.csv',
      rows: 14,
      status: 'Completed',
      date: 'Oct 25, 2026',
      user: 'Alex Morgan',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <UploadCloud className="w-4 h-4" />
            <span>Transcript Ingestion Engine</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Import Center & Speech Ingestion
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest outbound call recordings and transcripts via CSV batches or raw dialogue paste.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSample}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download Sample CSV</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 rounded-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 w-fit text-xs">
        <button
          onClick={() => {
            setActiveMode('csv');
            setImportSuccessResult(null);
          }}
          className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeMode === 'csv'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Batch CSV Ingestion</span>
        </button>
        <button
          onClick={() => {
            setActiveMode('text');
            setImportSuccessResult(null);
          }}
          className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeMode === 'text'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Raw Transcript Paste</span>
        </button>
      </div>

      {/* Mode: Batch CSV Upload */}
      {activeMode === 'csv' && (
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
              dragActive
                ? 'border-blue-500 bg-blue-600/10'
                : 'border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white hover:border-slate-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mb-1">
              Drag and drop your call transcript CSV here
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4">
              Supported columns: <span className="font-mono text-slate-300">CustomerName</span>,{' '}
              <span className="font-mono text-slate-300">Company</span>,{' '}
              <span className="font-mono text-slate-300">Agent</span>,{' '}
              <span className="font-mono text-slate-300">Transcript</span>
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                Browse Files
              </button>

              <button
                onClick={() => validateCSV(SAMPLE_CSV_CONTENT, 'callflow_demo_sample.csv')}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 transition-colors"
              >
                Load Pre-Configured Sample (3 Calls)
              </button>
            </div>
          </div>

          {/* Validation Feedback & Preview Strip */}
          {validationStatus && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                validationStatus.valid
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {validationStatus.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="font-semibold">
                    {validationStatus.valid
                      ? `Valid CSV: ${validationStatus.rowCount} call transcript records detected (${fileName})`
                      : 'File Schema Validation Errors'}
                  </span>
                </div>

                {validationStatus.valid && !isProcessing && (
                  <button
                    onClick={handleExecuteImport}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-xs"
                  >
                    Start AI Processing Batch ({validationStatus.rowCount})
                  </button>
                )}
              </div>

              {!validationStatus.valid && (
                <ul className="mt-2 list-disc list-inside text-[11px] text-rose-400 space-y-0.5">
                  {validationStatus.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  Extracting summaries, objections & CRM updates...
                </span>
                <span className="font-mono tabular-nums text-blue-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Import Success Banner */}
          {importSuccessResult !== null && (
            <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Successfully Imported & Analyzed {importSuccessResult} Calls!
                  </h4>
                  <p className="text-slate-400 mt-0.5">
                    Transcripts have been processed. AI suggested CRM updates and follow-up tasks are ready.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Review Suggestions</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode: Raw Transcript Paste */}
      {activeMode === 'text' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Prospect Name</label>
              <input
                type="text"
                value={textProspectName}
                onChange={e => setTextProspectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company</label>
              <input
                type="text"
                value={textCompany}
                onChange={e => setTextCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone</label>
              <input
                type="text"
                value={textPhone}
                onChange={e => setTextPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Agent Name</label>
              <input
                type="text"
                value={textAgent}
                onChange={e => setTextAgent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-medium">Dialogue Transcript</label>
              <span className="text-[11px] text-slate-500">
                Prefix lines with "Agent:" and "Customer:"
              </span>
            </div>
            <textarea
              rows={8}
              value={rawTranscript}
              onChange={e => setRawTranscript(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleExecuteSingleTranscript}
              disabled={isProcessing || !rawTranscript.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Speech Intelligence & CRM Extract</span>
            </button>
          </div>
        </div>
      )}

      {/* Historical Ingestion Batches */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 overflow-hidden">
        <h3 className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 mb-3">
          Import & Telephony Batch History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Batch File</th>
                <th className="py-2.5 px-3">Calls Ingested</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Uploaded By</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {importHistory.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200 flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.file}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-300">
                    {item.rows} records
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{item.date}</td>
                  <td className="py-2.5 px-3 text-slate-300">{item.user}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
