import React, { useState } from 'react';
import {
  Network,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  BookOpen,
  PlusCircle,
  Flame,
} from 'lucide-react';
import { GraphNode, GraphEdge, ClassItem, SubjectItem, ChapterItem } from '../../types/curriculum';
import { INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES } from '../../services/knowledgeGraphData';
import { spacedRepetitionService } from '../../services/spacedRepetitionService';
import { sound } from '../../services/audio';

interface KnowledgeGraphViewProps {
  onPracticeTopic?: (node: GraphNode) => void;
  onAskDoubtAboutTopic?: (node: GraphNode) => void;
  onAddedToRevision?: () => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  onPracticeTopic,
  onAskDoubtAboutTopic,
  onAddedToRevision,
}) => {
  const [nodes] = useState<GraphNode[]>(INITIAL_GRAPH_NODES);
  const [edges] = useState<GraphEdge[]>(INITIAL_GRAPH_EDGES);

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [showWeakOnly, setShowWeakOnly] = useState<boolean>(false);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes.find((n) => n.isWeak) || nodes[0]);

  // Filter nodes
  const filteredNodes = nodes.filter((node) => {
    if (showWeakOnly && !node.isWeak) return false;
    if (selectedSubjectFilter !== 'all' && !node.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase())) {
      return false;
    }
    if (selectedGradeFilter !== 'all' && node.classGrade.toString() !== selectedGradeFilter) {
      return false;
    }
    return true;
  });

  const weakNodesCount = nodes.filter((n) => n.isWeak).length;
  const masteredNodesCount = nodes.filter((n) => n.masteryScore >= 80).length;

  const handleSelectNode = (node: GraphNode) => {
    sound.playClick();
    setSelectedNode(node);
  };

  const handleAddToRevision = (node: GraphNode) => {
    sound.playClick();
    spacedRepetitionService.addCard({
      classGrade: node.classGrade,
      subjectId: `sub-c${node.classGrade}`,
      subjectName: node.subject,
      chapterId: node.chapterId,
      chapterTitle: node.label,
      topic: node.label,
      front: `[Knowledge Graph Flashcard] Explain the key formula and concept for ${node.label} (Class ${node.classGrade} ${node.subject})`,
      back: `Core concepts of ${node.label}:\n${node.weakReason || 'Mastery essential for board examination syllabus.'}\nTags: ${node.tags.join(', ')}`,
      difficulty: node.isWeak ? 'Hard' : 'Medium',
    });
    sound.playCelebration();
    if (onAddedToRevision) onAddedToRevision();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>Interactive Concept Graph</span>
            <span aria-hidden="true">·</span>
            <span>Prerequisite & Mastery Tracking</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Curriculum Knowledge Graph
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore topic interconnections across NCERT subjects. Pulsing red/amber halos spotlight weak concepts requiring revision.
          </p>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider">Weak Topics</span>
            </div>
            <p className="text-2xl font-black text-white mt-1">{weakNodesCount} Flagged</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Mastered</span>
            </div>
            <p className="text-2xl font-black text-white mt-1">{masteredNodesCount} Topics</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Subjects</option>
              <option value="science">Science</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics (11-12)</option>
              <option value="chem">Chemistry (11-12)</option>
              <option value="bio">Biology (11-12)</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Class:</span>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Grades (1-12)</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          {/* Weak Topics Only Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setShowWeakOnly(!showWeakOnly);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              showWeakOnly
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Only Show Weak Topics ({weakNodesCount})</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-500/30 animate-pulse" />
            <span className="text-rose-300 font-semibold">Weak (&lt;60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
            <span className="text-amber-300 font-semibold">Review (60-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 font-semibold">Mastered (&gt;80%)</span>
          </div>
        </div>
      </div>

      {/* Main Graph Grid & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Nodes Canvas / Matrix (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Connected Concept Nodes ({filteredNodes.length})
              </span>
            </div>
            <span className="text-xs text-slate-500">Click any node to inspect mastery</span>
          </div>

          {/* Node Grid with halos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isWeak = node.isWeak;

              return (
                <button
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20'
                      : isWeak
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500 ring-2 ring-rose-500/20 hover:shadow-lg hover:shadow-rose-500/20'
                      : node.masteryScore >= 80
                      ? 'bg-slate-950/70 border-emerald-500/30 hover:border-emerald-500/60'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Weak Topic Halo Glow */}
                  {isWeak && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-bold text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>Weak</span>
                    </div>
                  )}

                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Class {node.classGrade} · {node.subject}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {node.label}
                  </h4>

                  {/* Mastery Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Mastery</span>
                      <span
                        className={`font-mono font-bold ${
                          isWeak ? 'text-rose-400' : node.masteryScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {node.masteryScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isWeak ? 'bg-rose-500' : node.masteryScore >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${node.masteryScore}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prerequisite Linkages Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Direct Curriculum Linkages:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {edges.slice(0, 4).map((e) => (
                <div key={e.id} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span className="font-semibold text-indigo-300">
                    {nodes.find((n) => n.id === e.source)?.label.split(' ')[0]}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="font-semibold text-sky-300">
                    {nodes.find((n) => n.id === e.target)?.label.split(' ')[0]}
                  </span>
                  {e.label && <span className="text-[10px] text-slate-500">({e.label})</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          {selectedNode ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Topic Inspector
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">{selectedNode.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Class {selectedNode.classGrade} · {selectedNode.subject}
                  </p>
                </div>

                {selectedNode.isWeak ? (
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Weak
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mastered
                  </span>
                )}
              </div>

              {/* Mastery Score Progress */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Assessed Mastery Level</span>
                  <span
                    className={`font-mono text-base font-bold ${
                      selectedNode.isWeak ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {selectedNode.masteryScore}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedNode.isWeak ? 'bg-rose-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${selectedNode.masteryScore}%` }}
                  />
                </div>
              </div>

              {/* Weak Topic Diagnosis */}
              {selectedNode.isWeak && selectedNode.weakReason && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Diagnostic Error Analysis:</span>
                  </div>
                  <p className="leading-relaxed">{selectedNode.weakReason}</p>
                </div>
              )}

              {/* Topic Tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Core Keywords & Syllabus Concepts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {onPracticeTopic && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onPracticeTopic(selectedNode);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Practice Topic (Open Workspace)</span>
                  </button>
                )}

                {onAskDoubtAboutTopic && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onAskDoubtAboutTopic(selectedNode);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Ask AI Doubt Solver About This</span>
                  </button>
                )}

                <button
                  onClick={() => handleAddToRevision(selectedNode)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-sky-400" />
                  <span>Add to Spaced Revision Queue</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select any topic node from the graph to inspect prerequisites and weak topic interventions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
