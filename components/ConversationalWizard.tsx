'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FormData, emptyFormData } from '@/lib/formLogic';
import { questions, Question } from '@/lib/questions';
import ResultsPage from './ResultsPage';

// Deep set a nested field like "personal.vorname" 
function setNestedField(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] === undefined) current[keys[i]] = {};
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

function getNestedField(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

interface AnsweredQuestion {
  question: Question;
  answer: string;
  displayAnswer: string;
}

export default function ConversationalWizard() {
  const [data, setData] = useState<FormData>(emptyFormData);
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [childIndex, setChildIndex] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [collectingChildren, setCollectingChildren] = useState(false);
  const [childField, setChildField] = useState<'vorname' | 'nachname' | 'geburtsdatum' | 'geschlecht'>('vorname');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [answered, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [answered, collectingChildren, childField]);

  // Get the next unanswered question
  const getNextQuestion = useCallback((): Question | null => {
    const answeredIds = new Set(answered.map(a => a.question.id));

    for (const q of questions) {
      if (answeredIds.has(q.id)) continue;
      // Special handling for child-related questions
      if (q.id === 'anzahlKinder' || q.id === 'hatKinder') {
        // hatKinder is handled via its condition
      }
      if (q.condition && !q.condition(data)) continue;
      return q;
    }
    return null;
  }, [answered, data]);

  const currentQuestion = collectingChildren ? null : getNextQuestion();
  const currentSection = collectingChildren ? 3 : (currentQuestion?.section ?? 7);
  const sectionLabel = collectingChildren ? 'Haushalt & Familie' : (currentQuestion?.sectionLabel ?? 'Zusammenfassung');
  const totalSections = 8;

  // Handle submitting an answer
  const submitAnswer = (value: string, displayValue?: string) => {
    if (!currentQuestion && !collectingChildren) return;

    if (collectingChildren) {
      handleChildAnswer(value, displayValue);
      return;
    }

    const q = currentQuestion!;
    const display = displayValue || value;

    // Handle special fields
    if (q.field === '_hatKinder') {
      const hasKids = value === 'true';
      if (hasKids) {
        setAnswered([...answered, { question: q, answer: value, displayAnswer: display }]);
        setCollectingChildren(true);
        setChildField('vorname');
        setChildIndex(0);
        setChildCount(0);
        setCurrentInput('');
        return;
      } else {
        // No kids, update data
        setAnswered([...answered, { question: q, answer: value, displayAnswer: display }]);
        setCurrentInput('');
        return;
      }
    }

    if (q.field === '_hatVermoegen') {
      // Always continue, just mark answered
      setAnswered([...answered, { question: q, answer: value, displayAnswer: display }]);
      setCurrentInput('');
      return;
    }

    if (q.field === '_anzahlKinder') {
      // Not used directly; children are collected via the child flow
      setAnswered([...answered, { question: q, answer: value, displayAnswer: display }]);
      setCurrentInput('');
      return;
    }

    // Handle boolean fields
    let storeValue: unknown = value;
    if (q.field.endsWith('.hatPartner') || q.field.endsWith('.hatEinkommen') || q.field.endsWith('.partnerHatEinkommen')) {
      storeValue = value === 'true';
    }

    // Initialize partner object if needed
    let newData = { ...data } as unknown as Record<string, unknown>;
    if (q.field.startsWith('family.partner.') && !(data.family as unknown as Record<string, unknown>).partner) {
      newData = setNestedField(newData, 'family.partner', {
        vorname: '', nachname: '', geburtsdatum: '', geschlecht: '', staatsangehoerigkeit: 'deutsch'
      });
    }
    newData = setNestedField(newData, q.field, storeValue);
    const typedData = newData as unknown as FormData;

    // Update housing persons count
    if (q.field === 'family.hatPartner') {
      const totalPersons = 1 + (storeValue === true ? 1 : 0) + typedData.family.kinder.length;
      const updatedData = setNestedField(newData, 'housing.anzahlPersonen', totalPersons.toString());
      setData(updatedData as unknown as FormData);
    } else {
      setData(typedData);
    }

    setAnswered([...answered, { question: q, answer: value, displayAnswer: display }]);
    setCurrentInput('');
  };

  const handleChildAnswer = (value: string, displayValue?: string) => {
    const display = displayValue || value;
    const pseudoQuestion: Question = {
      id: `child_${childIndex}_${childField}`,
      section: 3,
      sectionLabel: 'Haushalt & Familie',
      text: getChildQuestionText(),
      type: childField === 'geschlecht' ? 'choice' : 'text',
      field: '',
      required: true,
    };

    setAnswered(prev => [...prev, { question: pseudoQuestion, answer: value, displayAnswer: display }]);

    const newData = JSON.parse(JSON.stringify(data)) as FormData;

    if (childField === 'vorname') {
      // Add new child
      newData.family.kinder[childIndex] = { vorname: value, nachname: data.personal.nachname, geburtsdatum: '', geschlecht: '' };
      setData(newData);
      setChildField('geburtsdatum');
    } else if (childField === 'geburtsdatum') {
      newData.family.kinder[childIndex].geburtsdatum = value;
      setData(newData);
      setChildField('geschlecht');
    } else if (childField === 'geschlecht') {
      newData.family.kinder[childIndex].geschlecht = value as 'maennlich' | 'weiblich' | 'divers';
      // Update persons count
      const totalPersons = 1 + (newData.family.hatPartner ? 1 : 0) + newData.family.kinder.length;
      newData.housing.anzahlPersonen = totalPersons.toString();
      setData(newData);

      // Ask if there are more children
      setChildField('vorname');
      setChildIndex(childIndex + 1);
      setChildCount(childCount + 1);
      // Show "another child?" prompt
      const moreQuestion: Question = {
        id: `child_more_${childIndex}`,
        section: 3,
        sectionLabel: 'Haushalt & Familie',
        text: 'Haben Sie noch ein weiteres Kind?',
        type: 'choice',
        field: '',
        options: [
          { value: 'true', label: 'Ja, noch ein Kind', emoji: '👶' },
          { value: 'false', label: 'Nein, das waren alle', emoji: '✓' },
        ],
      };
      // We need to handle this specially - set a flag
      setChildField('vorname');
      // Actually let's use a state to track "waiting for more children" answer
      setCollectingChildren(false);
      // Push a special question into the flow
      setTimeout(() => {
        setAnswered(prev => {
          // Insert the "more children" prompt as the current question by stopping child collection
          return prev;
        });
      }, 0);
      // Actually, let me simplify: after each child, ask if more
      setCollectingChildren(false);
      // The next getNextQuestion will pick up from where we left off in the main flow
      // But we want to ask about more children first
      // Let me handle this differently with a temporary state
      setWaitingForMoreChildren(true);
    }
    setCurrentInput('');
  };

  const [waitingForMoreChildren, setWaitingForMoreChildren] = useState(false);

  const getChildQuestionText = () => {
    const childNum = childIndex + 1;
    switch (childField) {
      case 'vorname': return `Wie heißt Ihr ${childNum}. Kind mit Vornamen?`;
      case 'geburtsdatum': return `Wann ist ${data.family.kinder[childIndex]?.vorname || 'das Kind'} geboren? (TT.MM.JJJJ)`;
      case 'geschlecht': return `Geschlecht von ${data.family.kinder[childIndex]?.vorname || 'dem Kind'}?`;
      default: return '';
    }
  };

  const handleMoreChildrenAnswer = (value: string, display: string) => {
    const pseudoQ: Question = {
      id: `child_more_${childIndex}`,
      section: 3,
      sectionLabel: 'Haushalt & Familie',
      text: 'Haben Sie noch ein weiteres Kind?',
      type: 'choice',
      field: '',
    };
    setAnswered(prev => [...prev, { question: pseudoQ, answer: value, displayAnswer: display }]);
    setWaitingForMoreChildren(false);
    if (value === 'true') {
      setCollectingChildren(true);
      setChildField('vorname');
    }
    setCurrentInput('');
  };

  // Auto-fill
  useEffect(() => {
    if (currentQuestion?.autoFill && !currentInput) {
      const autoValue = currentQuestion.autoFill(data);
      if (autoValue) setCurrentInput(autoValue);
    }
  }, [currentQuestion, data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if we're done
  const isDone = !currentQuestion && !collectingChildren && !waitingForMoreChildren;

  if (showResults) {
    return <ResultsPage data={data} onRestart={() => {
      setData(emptyFormData);
      setAnswered([]);
      setShowResults(false);
      setCollectingChildren(false);
      setWaitingForMoreChildren(false);
      setChildIndex(0);
      setChildCount(0);
    }} />;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      e.preventDefault();
      submitAnswer(currentInput.trim());
    }
  };

  const handleSkip = () => {
    if (currentQuestion && !currentQuestion.required) {
      submitAnswer('', 'Übersprungen');
    }
  };

  // Determine what to show as current prompt
  let currentPromptText = '';
  let currentPromptSubtext = '';
  let currentPromptTooltip: { term: string; definition: string } | undefined;
  let currentPromptType: string = 'text';
  let currentPromptOptions: { value: string; label: string; emoji?: string }[] = [];
  let isRequired = true;
  let placeholder = '';

  if (waitingForMoreChildren) {
    currentPromptText = 'Haben Sie noch ein weiteres Kind?';
    currentPromptType = 'choice';
    currentPromptOptions = [
      { value: 'true', label: 'Ja, noch ein Kind', emoji: '👶' },
      { value: 'false', label: 'Nein, das waren alle', emoji: '✓' },
    ];
  } else if (collectingChildren) {
    currentPromptText = getChildQuestionText();
    currentPromptType = childField === 'geschlecht' ? 'choice' : (childField === 'geburtsdatum' ? 'date' : 'text');
    if (childField === 'geschlecht') {
      currentPromptOptions = [
        { value: 'weiblich', label: 'Weiblich', emoji: '♀️' },
        { value: 'maennlich', label: 'Männlich', emoji: '♂️' },
        { value: 'divers', label: 'Divers', emoji: '⚧️' },
      ];
    }
    placeholder = childField === 'vorname' ? 'z.B. Emma' : childField === 'geburtsdatum' ? 'TT.MM.JJJJ' : '';
  } else if (currentQuestion) {
    currentPromptText = currentQuestion.text;
    currentPromptSubtext = currentQuestion.subtext || '';
    currentPromptTooltip = currentQuestion.tooltip;
    currentPromptType = currentQuestion.type;
    currentPromptOptions = currentQuestion.options || [];
    isRequired = currentQuestion.required ?? false;
    placeholder = currentQuestion.placeholder || '';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
                B
              </div>
              <span className="font-bold text-gray-900 text-sm">Bürgergeld-Assistent</span>
            </div>
            <span className="text-xs text-gray-400">
              Schritt {Math.min(currentSection + 1, totalSections - 1)} von {totalSections - 1}
              {sectionLabel && ` — ${sectionLabel}`}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-600 to-green-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${isDone ? 100 : Math.max(5, ((currentSection) / (totalSections - 1)) * 100)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 chat-scroll overflow-y-auto">
        {/* Welcome message if no answers yet */}
        {answered.length === 0 && !collectingChildren && (
          <div className="flex gap-3 mb-6 animate-fadeInUp">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" /></svg>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-100 max-w-md">
              <p className="text-gray-800 font-medium">Hallo! 👋</p>
              <p className="text-gray-600 text-sm mt-1">
                Ich helfe Ihnen, Ihren Bürgergeld-Antrag auszufüllen. Wir gehen das Schritt für Schritt durch — ganz in Ruhe.
              </p>
            </div>
          </div>
        )}

        {/* Answered questions */}
        {answered.map((item, i) => (
          <div key={i} className="mb-4 animate-fadeInUp" style={{ animationDelay: '0ms' }}>
            {/* Bot question */}
            <div className="flex gap-3 mb-2">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" /></svg>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-md px-4 py-2.5 shadow-sm border border-gray-100 max-w-sm">
                <p className="text-gray-700 text-sm">{item.question.text}</p>
              </div>
            </div>
            {/* User answer */}
            <div className="flex justify-end mb-1">
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-2.5 max-w-sm shadow-sm">
                <p className="text-sm">{item.displayAnswer || <span className="italic opacity-70">—</span>}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Current question */}
        {!isDone && currentPromptText && (
          <div className="mb-4 animate-fadeInUp">
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" /></svg>
              </div>
              <div className="max-w-md">
                <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-100">
                  <p className="text-gray-800 font-medium">{currentPromptText}</p>
                  {currentPromptSubtext && (
                    <p className="text-gray-500 text-sm mt-1">{currentPromptSubtext}</p>
                  )}
                  {currentPromptTooltip && (
                    <div className="mt-2 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                      <p className="text-xs text-amber-800">
                        <strong>💡 {currentPromptTooltip.term}:</strong> {currentPromptTooltip.definition}
                      </p>
                    </div>
                  )}
                </div>

                {/* Choice buttons */}
                {(currentPromptType === 'choice' || currentPromptType === 'select') && currentPromptOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentPromptOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          if (waitingForMoreChildren) {
                            handleMoreChildrenAnswer(opt.value, opt.label);
                          } else {
                            submitAnswer(opt.value, opt.label);
                          }
                        }}
                        className="flex items-center gap-2 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 text-gray-800 font-medium px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow text-sm"
                      >
                        {opt.emoji && <span>{opt.emoji}</span>}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Done - show go to results */}
        {isDone && (
          <div className="mb-4 animate-fadeInUp">
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <div className="max-w-md">
                <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-green-100">
                  <p className="text-gray-800 font-medium">Geschafft! 🎉</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Alle Fragen beantwortet. Ich erstelle jetzt Ihre Formulare.
                  </p>
                </div>
                <button
                  onClick={() => setShowResults(true)}
                  className="mt-3 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-600/25 transition-all duration-200 text-sm"
                >
                  📋 Formulare anzeigen & herunterladen
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area - only for text/number/date/phone/iban types */}
      {!isDone && currentPromptType !== 'choice' && currentPromptType !== 'select' && currentPromptType !== 'info' && currentPromptText && (
        <div className="border-t border-gray-100 bg-white/90 backdrop-blur-sm sticky bottom-0">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type={currentPromptType === 'number' ? 'text' : 'text'}
                inputMode={currentPromptType === 'number' ? 'numeric' : currentPromptType === 'phone' ? 'tel' : 'text'}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-gray-50 border-2 border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-base transition-colors"
                autoFocus
              />
              <button
                onClick={() => {
                  if (currentInput.trim()) submitAnswer(currentInput.trim());
                }}
                disabled={!currentInput.trim() && isRequired}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl transition-colors font-medium shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
            {!isRequired && (
              <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600 mt-2 transition-colors">
                Überspringen →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="max-w-2xl mx-auto px-4 py-2 text-center">
        <p className="text-xs text-gray-400">
          🔒 Alle Daten bleiben in Ihrem Browser. Nichts wird an Server gesendet.
        </p>
      </div>
    </div>
  );
}
