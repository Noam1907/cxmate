export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type JourneyType = "sales" | "customer" | "full_lifecycle";
export type StageType = "sales" | "customer";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          vertical: string;
          size: string;
          brand_dna: Json;
          settings: Json;
          plan_tier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          vertical: string;
          size: string;
          brand_dna?: Json;
          settings?: Json;
          plan_tier?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          vertical?: string;
          size?: string;
          brand_dna?: Json;
          settings?: Json;
          plan_tier?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journey_templates: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          vertical: string;
          journey_type: JourneyType;
          is_default: boolean;
          stages: Json;
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          vertical: string;
          journey_type?: JourneyType;
          is_default?: boolean;
          stages?: Json;
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          vertical?: string;
          journey_type?: JourneyType;
          is_default?: boolean;
          stages?: Json;
          source?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journey_templates_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      journey_stages: {
        Row: {
          id: string;
          template_id: string;
          name: string;
          stage_type: StageType;
          order_index: number;
          description: string;
          emotional_state: string;
          meaningful_moments: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          name: string;
          stage_type?: StageType;
          order_index: number;
          description?: string;
          emotional_state?: string;
          meaningful_moments?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          name?: string;
          stage_type?: StageType;
          order_index?: number;
          description?: string;
          emotional_state?: string;
          meaningful_moments?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "journey_stages_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "journey_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      meaningful_moments: {
        Row: {
          id: string;
          stage_id: string;
          type: string;
          name: string;
          description: string;
          severity: string;
          triggers: Json;
          recommendations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          stage_id: string;
          type: string;
          name: string;
          description?: string;
          severity?: string;
          triggers?: Json;
          recommendations?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          stage_id?: string;
          type?: string;
          name?: string;
          description?: string;
          severity?: string;
          triggers?: Json;
          recommendations?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "meaningful_moments_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "journey_stages";
            referencedColumns: ["id"];
          },
        ];
      };
      recommendations: {
        Row: {
          id: string;
          moment_id: string;
          action_type: string;
          what: string;
          when_trigger: string;
          how_template: string;
          why_principle: string;
          measure_metric: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          moment_id: string;
          action_type: string;
          what: string;
          when_trigger?: string;
          how_template?: string;
          why_principle?: string;
          measure_metric?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          moment_id?: string;
          action_type?: string;
          what?: string;
          when_trigger?: string;
          how_template?: string;
          why_principle?: string;
          measure_metric?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recommendations_moment_id_fkey";
            columns: ["moment_id"];
            isOneToOne: false;
            referencedRelation: "meaningful_moments";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
