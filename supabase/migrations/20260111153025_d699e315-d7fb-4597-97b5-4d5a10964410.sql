-- Create effects table
CREATE TABLE public.effects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_de TEXT NOT NULL,
  description TEXT,
  description_de TEXT,
  category TEXT NOT NULL CHECK (category IN ('positive', 'negative', 'medical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create terpenes table
CREATE TABLE public.terpenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  scent TEXT NOT NULL,
  scent_de TEXT NOT NULL,
  effects TEXT NOT NULL,
  effects_de TEXT NOT NULL,
  also_found_in TEXT,
  also_found_in_de TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create strains table
CREATE TABLE public.strains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('indica', 'sativa', 'hybrid')),
  thc_min DECIMAL(4,1),
  thc_max DECIMAL(4,1),
  cbd_min DECIMAL(4,1),
  cbd_max DECIMAL(4,1),
  description TEXT,
  description_de TEXT,
  flavor TEXT,
  flavor_de TEXT,
  aroma TEXT,
  aroma_de TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for strains and effects
CREATE TABLE public.strain_effects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strain_id UUID NOT NULL REFERENCES public.strains(id) ON DELETE CASCADE,
  effect_id UUID NOT NULL REFERENCES public.effects(id) ON DELETE CASCADE,
  intensity TEXT CHECK (intensity IN ('low', 'medium', 'high')),
  UNIQUE(strain_id, effect_id)
);

-- Create junction table for strains and terpenes
CREATE TABLE public.strain_terpenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strain_id UUID NOT NULL REFERENCES public.strains(id) ON DELETE CASCADE,
  terpene_id UUID NOT NULL REFERENCES public.terpenes(id) ON DELETE CASCADE,
  dominance TEXT CHECK (dominance IN ('primary', 'secondary', 'tertiary')),
  UNIQUE(strain_id, terpene_id)
);

-- Enable RLS on all tables (public read access for reference data)
ALTER TABLE public.effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terpenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strain_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strain_terpenes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (reference data)
CREATE POLICY "Effects are publicly readable" ON public.effects FOR SELECT USING (true);
CREATE POLICY "Terpenes are publicly readable" ON public.terpenes FOR SELECT USING (true);
CREATE POLICY "Strains are publicly readable" ON public.strains FOR SELECT USING (true);
CREATE POLICY "Strain effects are publicly readable" ON public.strain_effects FOR SELECT USING (true);
CREATE POLICY "Strain terpenes are publicly readable" ON public.strain_terpenes FOR SELECT USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_strains_type ON public.strains(type);
CREATE INDEX idx_strains_name ON public.strains(name);
CREATE INDEX idx_strain_effects_strain ON public.strain_effects(strain_id);
CREATE INDEX idx_strain_effects_effect ON public.strain_effects(effect_id);
CREATE INDEX idx_strain_terpenes_strain ON public.strain_terpenes(strain_id);
CREATE INDEX idx_strain_terpenes_terpene ON public.strain_terpenes(terpene_id);