"use client";

import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { JOURNEY_EXISTS_OPTIONS, type OnboardingData } from "@/types/onboarding";
import { ChatBubble } from "./chat-bubble";

interface StepJourneyExistsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

const JOURNEY_COMPONENTS = [
  { value: "sales_pipeline", label: "Sales pipeline / CRM stages", emoji: "📊" },
  { value: "onboarding_checklist", label: "Onboarding flow / checklist", emoji: "✅" },
  { value: "training_program", label: "Training / enablement program", emoji: "🎓" },
  { value: "cs_playbook", label: "CS playbook / runbook", emoji: "📋" },
  { value: "support_flow", label: "Support / escalation flow", emoji: "🎫" },
  { value: "renewal_process", label: "Renewal / expansion process", emoji: "🔄" },
] as const;

export function StepJourneyExists({ data, onChange }: StepJourneyExistsProps) {
  const showSubFlow = data.hasExistingJourney === "yes" || data.hasExistingJourney === "partial";
  const existingComponents = data.existingJourneyComponents || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>(data.existingJourneyFileName || "");

  const toggleComponent = (value: string) => {
    const updated = existingComponents.includes(value)
      ? existingComponents.filter((c) => c !== value)
      : [...existingComponents, value];
    onChange({ existingJourneyComponents: updated });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, just capture the filename — we store it in state and sessionStorage
    // Future: upload to Supabase Storage and pass to Claude for analysis
    setUploadedFileName(file.name);
    onChange({ existingJourneyFileName: file.name });

    // Read and store in sessionStorage for later use
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem("cx-mate-existing-journey-file", JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
        }));
      } catch {
        // sessionStorage full — that's okay, file is optional
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUploadedFileName("");
    onChange({ existingJourneyFileName: "" });
    sessionStorage.removeItem("cx-mate-existing-journey-file");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <ChatBubble>
        <p>
          Before I build something new, I want to understand <strong>what you already have in place</strong>.
        </p>
        <p>
          This could be anything — an onboarding checklist, a training timeline, a sales pipeline, a Notion doc.
          {" "}Even informal processes count.
        </p>
      </ChatBubble>

      {/* Visual example — shows what "CX processes" means */}
      <div className="rounded-xl border border-border/50 bg-slate-50/80 p-4 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Example: what companies typically have
        </p>
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {[
            { label: "Sales pipeline", color: "bg-primary/8 text-primary border-primary/15" },
            { label: "→", color: "text-muted-foreground/50 text-lg" },
            { label: "Onboarding flow", color: "bg-primary/8 text-primary border-primary/15" },
            { label: "→", color: "text-muted-foreground/50 text-lg" },
            { label: "Training program", color: "bg-primary/8 text-primary border-primary/15" },
            { label: "→", color: "text-muted-foreground/50 text-lg" },
            { label: "Ongoing support", color: "bg-primary/8 text-primary border-primary/15" },
          ].map((item, i) =>
            item.label === "→" ? (
              <span key={i} className={item.color}>→</span>
            ) : (
              <span
                key={i}
                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border whitespace-nowrap ${item.color}`}
              >
                {item.label}
              </span>
            )
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Even a rough version of any of these helps me build a better playbook for you
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {JOURNEY_EXISTS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({
              hasExistingJourney: option.value,
              ...(option.value === "no" ? {
                existingJourneyComponents: [],
                existingJourneyDescription: "",
                existingJourneyFileName: "",
              } : {}),
            })}
            className={`flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all text-left hover:shadow-sm ${
              data.hasExistingJourney === option.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:bg-accent/50"
            }`}
          >
            <div className="font-medium text-sm">{option.label}</div>
            <div className="text-xs text-muted-foreground">{option.description}</div>
          </button>
        ))}
      </div>

      {/* Sub-flow: what components exist + upload */}
      {showSubFlow && (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <ChatBubble>
            {data.hasExistingJourney === "yes" ? (
              <p>Great — which processes do you have? Check what applies, and feel free to upload what you have.</p>
            ) : (
              <p>No worries — tell me what pieces exist. I&apos;ll build on what&apos;s working and fill the gaps.</p>
            )}
          </ChatBubble>

          {/* Journey component checkboxes */}
          <div className="space-y-2">
            <Label>What do you have in place? (check all that apply)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {JOURNEY_COMPONENTS.map((component) => (
                <label
                  key={component.value}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors hover:bg-accent/50 ${
                    existingComponents.includes(component.value)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={existingComponents.includes(component.value)}
                    onChange={() => toggleComponent(component.value)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">{component.emoji}</span>
                  <span className="text-sm">{component.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload existing CX doc */}
          <div className="space-y-2">
            <Label>Upload what you have (optional)</Label>
            <div className="rounded-lg border-2 border-dashed border-border/70 p-4 text-center space-y-2 hover:border-primary/40 transition-colors">
              {uploadedFileName ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm">📎</span>
                  <span className="text-sm font-medium text-foreground">{uploadedFileName}</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-xs text-muted-foreground hover:text-red-500 transition-colors ml-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Screenshot, PDF, image, or doc — anything helps
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg"
                  >
                    Choose file
                  </Button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-[11px] text-muted-foreground">
                Training timeline, onboarding doc, process diagram — I&apos;ll use it to understand your current setup
              </p>
            </div>
          </div>

          {/* Description textarea */}
          <div className="space-y-2">
            <Label htmlFor="existingJourneyDesc">
              {data.hasExistingJourney === "yes"
                ? "Anything else I should know? Where does this live?"
                : "What works well? What needs fixing?"
              }
            </Label>
            <Textarea
              id="existingJourneyDesc"
              placeholder={
                data.hasExistingJourney === "yes"
                  ? "e.g. Our onboarding is in Notion, sales pipeline in HubSpot, support runs through Zendesk..."
                  : "e.g. Our onboarding checklist is solid but the handoff from sales is broken..."
              }
              value={data.existingJourneyDescription || ""}
              onChange={(e) => onChange({ existingJourneyDescription: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      )}

      {/* No processes — encouraging message */}
      {data.hasExistingJourney === "no" && (
        <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 animate-in fade-in duration-300">
          <p className="text-sm text-foreground">
            <strong>Perfect starting point.</strong> No legacy to work around — I&apos;ll build you a
            clean, proven framework from scratch.
          </p>
        </div>
      )}
    </div>
  );
}
