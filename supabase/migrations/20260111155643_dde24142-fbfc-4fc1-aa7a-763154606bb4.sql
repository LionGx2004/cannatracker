-- Add explicit policies to prevent writes on reference data tables
-- This makes the security model more explicit and maintainable

-- Strains table - no writes allowed
CREATE POLICY "No writes to strains" ON public.strains 
  FOR INSERT WITH CHECK (false);
CREATE POLICY "No updates to strains" ON public.strains 
  FOR UPDATE USING (false);
CREATE POLICY "No deletes from strains" ON public.strains 
  FOR DELETE USING (false);

-- Effects table - no writes allowed
CREATE POLICY "No writes to effects" ON public.effects 
  FOR INSERT WITH CHECK (false);
CREATE POLICY "No updates to effects" ON public.effects 
  FOR UPDATE USING (false);
CREATE POLICY "No deletes from effects" ON public.effects 
  FOR DELETE USING (false);

-- Terpenes table - no writes allowed
CREATE POLICY "No writes to terpenes" ON public.terpenes 
  FOR INSERT WITH CHECK (false);
CREATE POLICY "No updates to terpenes" ON public.terpenes 
  FOR UPDATE USING (false);
CREATE POLICY "No deletes from terpenes" ON public.terpenes 
  FOR DELETE USING (false);

-- Strain effects junction table - no writes allowed
CREATE POLICY "No writes to strain_effects" ON public.strain_effects 
  FOR INSERT WITH CHECK (false);
CREATE POLICY "No updates to strain_effects" ON public.strain_effects 
  FOR UPDATE USING (false);
CREATE POLICY "No deletes from strain_effects" ON public.strain_effects 
  FOR DELETE USING (false);

-- Strain terpenes junction table - no writes allowed
CREATE POLICY "No writes to strain_terpenes" ON public.strain_terpenes 
  FOR INSERT WITH CHECK (false);
CREATE POLICY "No updates to strain_terpenes" ON public.strain_terpenes 
  FOR UPDATE USING (false);
CREATE POLICY "No deletes from strain_terpenes" ON public.strain_terpenes 
  FOR DELETE USING (false);