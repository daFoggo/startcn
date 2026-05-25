import { z } from "zod";

export const ProgrammaticSignalsSchema = z.object({
	estimated_hours: z.number().nullable().optional(),
	actual_hours: z.number().optional(),
	time_variance_hours: z.number().optional(),
	is_over_estimate: z.boolean().optional(),
	last_checkpoint_progress_pct: z.number().optional(),
	last_checkpoint_remaining_hours: z.number().nullable().optional(),
	is_blocked: z.boolean().optional(),
	blocked_reason: z.string().nullable().optional(),
	available_working_hours: z.number().nullable().optional(),
	remaining_needed_hours: z.number().optional(),
	has_schedule_bottleneck: z.boolean().optional(),
	parallel_tasks_count: z.number().optional(),
});

export const RiskSnapshotSchema = z.object({
	task_id: z.string(),
	risk_score: z.number(), // 0.0 -> 1.0
	risk_level: z.enum(["low", "medium", "high", "critical", ""]),
	alert_type: z.string().nullable().optional(),
	signals: ProgrammaticSignalsSchema.nullable().optional(),
	recommendation: z.string().nullable().optional(),
	alert_sent: z.boolean().optional(),
	alert_sent_at: z.string().nullable().optional(),
});

export type TProgrammaticSignals = z.infer<typeof ProgrammaticSignalsSchema>;
export type TRiskSnapshot = z.infer<typeof RiskSnapshotSchema>;

// Schema for Project Risk Stats API
export const RiskStatsTaskSchema = z.object({
	task_id: z.string(),
	title: z.string(),
	assignee_name: z.string(),
	estimated_hours: z.number(),
	actual_hours: z.number(),
	days_remaining: z.number(),
	risk_score: z.number(),
	risk_level: z.string(),
	recommendation: z.string().nullable().optional(),
	signals: z.any().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type TRiskStatsTask = z.infer<typeof RiskStatsTaskSchema>;

export const ProjectRiskStatsSchema = z.object({
	overall_risk_index: z.number(),
	tasks: z.array(RiskStatsTaskSchema),
});
export type TProjectRiskStats = z.infer<typeof ProjectRiskStatsSchema>;
