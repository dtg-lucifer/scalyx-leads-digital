"use client";

import React, { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Project, ProjectStatus } from "@/types/project";
import { Lead } from "@/types/lead";
import {
  Kanban,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const STATUS_CONFIG: Record<ProjectStatus, { color: string; bg: string }> = {
  Planning: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  Design: { color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  "In Progress": { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  "Review & QA": { color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  Completed: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  "On Hold": { color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [leadId, setLeadId] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("In Progress");
  const [budget, setBudget] = useState(50000);
  const [kanbanUrl, setKanbanUrl] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
  const [teammateInput, setTeammateInput] = useState("Piush (Lead Dev)");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, leadsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/leads"),
      ]);

      const [projData, leadsData] = await Promise.all([
        projRes.json(),
        leadsRes.json(),
      ]);

      if (projData.projects) setProjects(projData.projects);
      if (leadsData.leads) setLeads(leadsData.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setLeadId("");
    setStatus("In Progress");
    setBudget(50000);
    setKanbanUrl("https://linear.app/scalyx");
    setStartDate(new Date().toISOString().split("T")[0]);
    setTargetDate(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
    setTeammateInput("Piush (Lead Dev)");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || "");
    setLeadId(project.leadId || "");
    setStatus(project.status);
    setBudget(project.budget);
    setKanbanUrl(project.kanbanUrl || "");
    setStartDate(project.startDate || "");
    setTargetDate(project.targetDate || "");
    setTeammateInput((project.assignedTeammates || []).join(", "));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assigned = teammateInput.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      setSubmitting(true);
      if (editingProject) {
        // Update
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            leadId: leadId || undefined,
            status,
            budget,
            kanbanUrl: kanbanUrl.trim(),
            startDate,
            targetDate,
            assignedTeammates: assigned,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          await fetchData();
        }
      } else {
        // Create
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            leadId: leadId || undefined,
            status,
            budget,
            kanbanUrl: kanbanUrl.trim(),
            startDate,
            targetDate,
            assignedTeammates: assigned,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          await fetchData();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AppNavbar
        title="Project Dashboard"
        description="Monitor active agency projects, statuses, and launch into team Kanban boards."
        actions={
          <Button
            type="button"
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 text-xs h-9 font-semibold"
          >
            <Plus className="size-3.5" />
            <span>New Project</span>
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Kanban Board Integration Notice */}
        <div className="p-4 rounded-none bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-none bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
              <Kanban className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                External Kanban Quick-Links Connected
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Each project stores a direct link to your team&apos;s sprint board (Linear, Trello, Jira, GitHub Projects, or Notion) for rapid 1-click access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-purple-600 border-purple-500/20 text-xs">
              Any Teammate Can Update
            </Badge>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              <div className="size-6 border-2 border-primary border-t-transparent rounded-none animate-spin mx-auto mb-2" />
              Loading running projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-muted-foreground bg-card border border-dashed border-border rounded-none">
              No projects created yet. Click &quot;New Project&quot; above to link your first Kanban sprint board!
            </div>
          ) : (
            projects.map((proj) => {
              const statusCfg = STATUS_CONFIG[proj.status] || {
                color: "text-foreground",
                bg: "bg-muted",
              };

              return (
                <div
                  key={proj.id}
                  className="p-6 rounded-none bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-none text-[11px] font-semibold border ${statusCfg.color} ${statusCfg.bg}`}
                      >
                        {proj.status}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(proj)}
                          title="Edit Project"
                          className="size-7 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(proj.id)}
                          title="Delete Project"
                          className="size-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-foreground leading-snug">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {proj.description || "No project summary provided."}
                      </p>
                    </div>

                    {/* Metadata Pill */}
                    <div className="p-3 rounded-none bg-muted/30 border border-border space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-semibold text-foreground truncate max-w-[180px]">
                          {proj.leadName || "Acme Client"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-mono font-bold text-foreground">
                          ₹{Number(proj.budget).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {proj.targetDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Target Delivery:</span>
                          <span className="font-mono text-muted-foreground">{proj.targetDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Assigned Teammates */}
                    {proj.assignedTeammates && proj.assignedTeammates.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {proj.assignedTeammates.map((member, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] py-0 px-2 font-normal">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Kanban External Action */}
                  <div className="mt-5 pt-4 border-t border-border">
                    {proj.kanbanUrl ? (
                      <a
                        href={proj.kanbanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs transition-all active:scale-[0.99]"
                      >
                        <Kanban className="size-3.5" />
                        <span>Open Kanban Board</span>
                        <ExternalLink className="size-3 ml-0.5 opacity-80" />
                      </a>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(proj)}
                        className="w-full text-xs text-muted-foreground"
                      >
                        Add Kanban URL
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Project Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-xl md:max-w-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Kanban className="size-4 text-primary" />
              <span>{editingProject ? "Edit Project Details" : "Create New Running Project"}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Project Title <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Scalyx High-Performance MVP & AI Chatbot"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Client / Lead
              </label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full h-9 px-2 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
              >
                <option value="" className="bg-card">Select Client...</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id} className="bg-card">
                    {l.name} ({l.company || "Independent"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Short Summary / Scope
              </label>
              <Textarea
                rows={2}
                placeholder="Key deliverables, tech stack, architecture..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-9 px-2 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
                >
                  <option value="Planning" className="bg-card">Planning</option>
                  <option value="Design" className="bg-card">Design</option>
                  <option value="In Progress" className="bg-card">In Progress</option>
                  <option value="Review & QA" className="bg-card">Review & QA</option>
                  <option value="Completed" className="bg-card">Completed</option>
                  <option value="On Hold" className="bg-card">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Budget (₹)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                External Kanban Board URL (Linear, Trello, Jira, GitHub)
              </label>
              <Input
                type="url"
                placeholder="https://linear.app/scalyx/project/..."
                value={kanbanUrl}
                onChange={(e) => setKanbanUrl(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Target Delivery Date
                </label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Assigned Teammates (Comma-separated)
              </label>
              <Input
                placeholder="Piush (Lead Dev), Rohan (UI Designer)"
                value={teammateInput}
                onChange={(e) => setTeammateInput(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="font-semibold">
                {submitting ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
