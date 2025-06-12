export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alert_thresholds: {
        Row: {
          created_at: string | null
          created_by: string | null
          critical_max: number | null
          critical_min: number | null
          id: string
          is_active: boolean | null
          module_name: string
          parameter_name: string
          unit: string | null
          updated_at: string | null
          warning_max: number | null
          warning_min: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          critical_max?: number | null
          critical_min?: number | null
          id?: string
          is_active?: boolean | null
          module_name: string
          parameter_name: string
          unit?: string | null
          updated_at?: string | null
          warning_max?: number | null
          warning_min?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          critical_max?: number | null
          critical_min?: number | null
          id?: string
          is_active?: boolean | null
          module_name?: string
          parameter_name?: string
          unit?: string | null
          updated_at?: string | null
          warning_max?: number | null
          warning_min?: number | null
        }
        Relationships: []
      }
      boiler_config: {
        Row: {
          boiler_name: string
          boiler_number: number
          capacity: number | null
          created_at: string | null
          id: string
          location: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          boiler_name: string
          boiler_number: number
          capacity?: number | null
          created_at?: string | null
          id?: string
          location?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          boiler_name?: string
          boiler_number?: number
          capacity?: number | null
          created_at?: string | null
          id?: string
          location?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      characters: {
        Row: {
          alerted: boolean | null
          created_at: string | null
          dialog_background_url: string | null
          dialogue_background_url: string | null
          expression_state: string | null
          id: string
          image_url: string | null
          investigation_id: string | null
          is_culprit: boolean | null
          knowledge: string
          location_description: string | null
          name: string
          personality: Json
          position: Json
          reputation_score: number | null
          role: string
          sprite: string | null
        }
        Insert: {
          alerted?: boolean | null
          created_at?: string | null
          dialog_background_url?: string | null
          dialogue_background_url?: string | null
          expression_state?: string | null
          id?: string
          image_url?: string | null
          investigation_id?: string | null
          is_culprit?: boolean | null
          knowledge?: string
          location_description?: string | null
          name: string
          personality?: Json
          position?: Json
          reputation_score?: number | null
          role: string
          sprite?: string | null
        }
        Update: {
          alerted?: boolean | null
          created_at?: string | null
          dialog_background_url?: string | null
          dialogue_background_url?: string | null
          expression_state?: string | null
          id?: string
          image_url?: string | null
          investigation_id?: string | null
          is_culprit?: boolean | null
          knowledge?: string
          location_description?: string | null
          name?: string
          personality?: Json
          position?: Json
          reputation_score?: number | null
          role?: string
          sprite?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
        ]
      }
      clues: {
        Row: {
          created_at: string | null
          description: string | null
          discovered_by: string | null
          id: string
          image_url: string | null
          investigation_id: string | null
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discovered_by?: string | null
          id: string
          image_url?: string | null
          investigation_id?: string | null
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discovered_by?: string | null
          id?: string
          image_url?: string | null
          investigation_id?: string | null
          location?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clues_discovered_by_fkey"
            columns: ["discovered_by"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clues_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_standards: {
        Row: {
          created_at: string | null
          id: string
          max_value: number | null
          min_value: number | null
          parameter_name: string
          product_name: string
          unit: string | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter_name: string
          product_name: string
          unit?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter_name?: string
          product_name?: string
          unit?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      dialog_history: {
        Row: {
          character_id: string | null
          character_reply: string
          clickable_keywords: string[] | null
          created_at: string | null
          id: string
          investigation_id: string | null
          reputation_impact: number | null
          timestamp: string | null
          truth_likelihood: number | null
          user_input: string
        }
        Insert: {
          character_id?: string | null
          character_reply: string
          clickable_keywords?: string[] | null
          created_at?: string | null
          id?: string
          investigation_id?: string | null
          reputation_impact?: number | null
          timestamp?: string | null
          truth_likelihood?: number | null
          user_input: string
        }
        Update: {
          character_id?: string | null
          character_reply?: string
          clickable_keywords?: string[] | null
          created_at?: string | null
          id?: string
          investigation_id?: string | null
          reputation_impact?: number | null
          timestamp?: string | null
          truth_likelihood?: number | null
          user_input?: string
        }
        Relationships: [
          {
            foreignKeyName: "dialog_history_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dialog_history_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
        ]
      }
      discovered_clues: {
        Row: {
          character_id: string
          clue_text: string
          clue_type: string | null
          dialog_id: string
          discovered_at: string | null
          id: string
          importance_level: number | null
          investigation_id: string
        }
        Insert: {
          character_id: string
          clue_text: string
          clue_type?: string | null
          dialog_id: string
          discovered_at?: string | null
          id?: string
          importance_level?: number | null
          investigation_id: string
        }
        Update: {
          character_id?: string
          clue_text?: string
          clue_type?: string | null
          dialog_id?: string
          discovered_at?: string | null
          id?: string
          importance_level?: number | null
          investigation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovered_clues_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discovered_clues_dialog_id_fkey"
            columns: ["dialog_id"]
            isOneToOne: false
            referencedRelation: "dialog_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discovered_clues_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_data: {
        Row: {
          created_at: string
          created_by: string | null
          efficiency_percentage: number | null
          equipment_category: string | null
          equipment_id: string
          equipment_name: string
          equipment_type: string
          id: string
          is_available: boolean | null
          last_maintenance: string | null
          location: string | null
          next_maintenance: string | null
          operating_hours: number | null
          status: string
          tag: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          efficiency_percentage?: number | null
          equipment_category?: string | null
          equipment_id: string
          equipment_name: string
          equipment_type: string
          id?: string
          is_available?: boolean | null
          last_maintenance?: string | null
          location?: string | null
          next_maintenance?: string | null
          operating_hours?: number | null
          status: string
          tag?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          efficiency_percentage?: number | null
          equipment_category?: string | null
          equipment_id?: string
          equipment_name?: string
          equipment_type?: string
          id?: string
          is_available?: boolean | null
          last_maintenance?: string | null
          location?: string | null
          next_maintenance?: string | null
          operating_hours?: number | null
          status?: string
          tag?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      investigations: {
        Row: {
          accusation_made: boolean | null
          accusation_timestamp: string | null
          accused_character_id: string | null
          background_url: string | null
          created_at: string | null
          created_by: string | null
          culprit_character_id: string | null
          game_result: string | null
          id: string
          player_image_url: string | null
          player_role: string | null
          prompt: string
          status: string | null
          title: string
        }
        Insert: {
          accusation_made?: boolean | null
          accusation_timestamp?: string | null
          accused_character_id?: string | null
          background_url?: string | null
          created_at?: string | null
          created_by?: string | null
          culprit_character_id?: string | null
          game_result?: string | null
          id?: string
          player_image_url?: string | null
          player_role?: string | null
          prompt: string
          status?: string | null
          title: string
        }
        Update: {
          accusation_made?: boolean | null
          accusation_timestamp?: string | null
          accused_character_id?: string | null
          background_url?: string | null
          created_at?: string | null
          created_by?: string | null
          culprit_character_id?: string | null
          game_result?: string | null
          id?: string
          player_image_url?: string | null
          player_role?: string | null
          prompt?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "investigations_accused_character_id_fkey"
            columns: ["accused_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investigations_culprit_character_id_fkey"
            columns: ["culprit_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          confidence_level: number | null
          description: string
          discovered_at: string | null
          id: string
          investigation_id: string | null
          resolved: boolean | null
          source_pnj: string | null
        }
        Insert: {
          confidence_level?: number | null
          description: string
          discovered_at?: string | null
          id?: string
          investigation_id?: string | null
          resolved?: boolean | null
          source_pnj?: string | null
        }
        Update: {
          confidence_level?: number | null
          description?: string
          discovered_at?: string | null
          id?: string
          investigation_id?: string | null
          resolved?: boolean | null
          source_pnj?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_source_pnj_fkey"
            columns: ["source_pnj"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          equipment_id: string | null
          id: string
          percentage_completed: number | null
          status: string | null
          task_title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: string | null
          id?: string
          percentage_completed?: number | null
          status?: string | null
          task_title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: string | null
          id?: string
          percentage_completed?: number | null
          status?: string | null
          task_title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_data"
            referencedColumns: ["id"]
          },
        ]
      }
      mixing_configurations: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          mix_name: string
          primary_percentage: number
          primary_product: string
          secondary_percentage: number
          secondary_product: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          mix_name: string
          primary_percentage: number
          primary_product: string
          secondary_percentage: number
          secondary_product: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          mix_name?: string
          primary_percentage?: number
          primary_product?: string
          secondary_percentage?: number
          secondary_product?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_blends: {
        Row: {
          blend_name: string
          components: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          blend_name: string
          components: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          blend_name?: string
          components?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_quality_data: {
        Row: {
          batch_number: string
          cetane: number | null
          couleur: string | null
          created_at: string
          created_by: string | null
          cristallisation: number | null
          density: number | null
          ecoulement: number | null
          evaporation_95: number | null
          id: string
          indice: number | null
          octane_rating: number | null
          point_final: number | null
          point_initial: number | null
          product_name: string
          quality_status: string | null
          residue_type: string | null
          sulfur_content: number | null
          test_date: string
          trouble: number | null
          updated_at: string
          viscosity: number | null
        }
        Insert: {
          batch_number: string
          cetane?: number | null
          couleur?: string | null
          created_at?: string
          created_by?: string | null
          cristallisation?: number | null
          density?: number | null
          ecoulement?: number | null
          evaporation_95?: number | null
          id?: string
          indice?: number | null
          octane_rating?: number | null
          point_final?: number | null
          point_initial?: number | null
          product_name: string
          quality_status?: string | null
          residue_type?: string | null
          sulfur_content?: number | null
          test_date: string
          trouble?: number | null
          updated_at?: string
          viscosity?: number | null
        }
        Update: {
          batch_number?: string
          cetane?: number | null
          couleur?: string | null
          created_at?: string
          created_by?: string | null
          cristallisation?: number | null
          density?: number | null
          ecoulement?: number | null
          evaporation_95?: number | null
          id?: string
          indice?: number | null
          octane_rating?: number | null
          point_final?: number | null
          point_initial?: number | null
          product_name?: string
          quality_status?: string | null
          residue_type?: string | null
          sulfur_content?: number | null
          test_date?: string
          trouble?: number | null
          updated_at?: string
          viscosity?: number | null
        }
        Relationships: []
      }
      product_specifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          max_value: number | null
          min_value: number | null
          product_name: string
          specification_name: string
          unit: string | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          product_name: string
          specification_name: string
          unit?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          product_name?: string
          specification_name?: string
          unit?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      production_data: {
        Row: {
          created_at: string | null
          created_by: string | null
          hourly_tonnage: number | null
          id: string
          product_name: string
          timestamp: string | null
          unit_name: string
          yield_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hourly_tonnage?: number | null
          id?: string
          product_name: string
          timestamp?: string | null
          unit_name: string
          yield_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hourly_tonnage?: number | null
          id?: string
          product_name?: string
          timestamp?: string | null
          unit_name?: string
          yield_percentage?: number | null
        }
        Relationships: []
      }
      production_tonnages: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          recorded_at: string | null
          tonnage_per_hour: number
          unit_name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          recorded_at?: string | null
          tonnage_per_hour: number
          unit_name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          recorded_at?: string | null
          tonnage_per_hour?: number
          unit_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shutdown_startup_events: {
        Row: {
          cause_category: string | null
          comments: string | null
          created_at: string
          created_by: string | null
          duration_hours: number | null
          end_time: string | null
          event_type: string
          id: string
          impact_level: string | null
          operator_name: string | null
          reason: string | null
          start_time: string
          status: string
          unit_name: string
          updated_at: string
        }
        Insert: {
          cause_category?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          duration_hours?: number | null
          end_time?: string | null
          event_type: string
          id?: string
          impact_level?: string | null
          operator_name?: string | null
          reason?: string | null
          start_time: string
          status: string
          unit_name: string
          updated_at?: string
        }
        Update: {
          cause_category?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          duration_hours?: number | null
          end_time?: string | null
          event_type?: string
          id?: string
          impact_level?: string | null
          operator_name?: string | null
          reason?: string | null
          start_time?: string
          status?: string
          unit_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string | null
          id: string
          is_acknowledged: boolean | null
          message: string
          module_name: string
          source_id: string | null
          source_table: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message: string
          module_name: string
          source_id?: string | null
          source_table?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string
          module_name?: string
          source_id?: string | null
          source_table?: string | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          module: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      water_parameter_limits: {
        Row: {
          created_at: string | null
          equipment_type: string
          id: string
          max_value: number | null
          min_value: number | null
          parameter_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          equipment_type: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          equipment_type?: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      water_parameters_config: {
        Row: {
          created_at: string | null
          equipment_type: string
          id: string
          max_value: number | null
          min_value: number | null
          parameter_name: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          equipment_type: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter_name: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          equipment_type?: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter_name?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      water_treatment_data: {
        Row: {
          chaudiere_number: number | null
          chlore_libre: number | null
          created_at: string
          created_by: string | null
          equipment_name: string
          equipment_type: string | null
          flow_rate: number | null
          id: string
          ph_level: number | null
          phosphates: number | null
          pressure: number | null
          sio2_level: number | null
          status: string | null
          ta_level: number | null
          tac_level: number | null
          temperature: number | null
          th_level: number | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          chaudiere_number?: number | null
          chlore_libre?: number | null
          created_at?: string
          created_by?: string | null
          equipment_name: string
          equipment_type?: string | null
          flow_rate?: number | null
          id?: string
          ph_level?: number | null
          phosphates?: number | null
          pressure?: number | null
          sio2_level?: number | null
          status?: string | null
          ta_level?: number | null
          tac_level?: number | null
          temperature?: number | null
          th_level?: number | null
          timestamp?: string
          updated_at?: string
        }
        Update: {
          chaudiere_number?: number | null
          chlore_libre?: number | null
          created_at?: string
          created_by?: string | null
          equipment_name?: string
          equipment_type?: string | null
          flow_rate?: number | null
          id?: string
          ph_level?: number | null
          phosphates?: number | null
          pressure?: number | null
          sio2_level?: number | null
          status?: string | null
          ta_level?: number | null
          tac_level?: number | null
          temperature?: number | null
          th_level?: number | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _module?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operator" | "supervisor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "operator", "supervisor", "viewer"],
    },
  },
} as const
