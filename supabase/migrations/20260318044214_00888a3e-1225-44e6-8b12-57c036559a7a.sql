
-- ============================================
-- PAYANA BOOKINGS - COMPLETE DATABASE SCHEMA
-- ============================================

-- 1. App role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'customer', 'agent', 'vehicle_owner');

-- 2. Approval status enum
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- 3. Booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- 4. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 5. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 7. Agents (travel agencies) table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  description TEXT,
  logo_url TEXT,
  instagram TEXT,
  status approval_status NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved agents visible to all" ON public.agents FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own agent" ON public.agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agent" ON public.agents FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete agents" ON public.agents FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Vehicle owners table
CREATE TABLE public.vehicle_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  status approval_status NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved owners visible to all" ON public.vehicle_owners FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own record" ON public.vehicle_owners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own record" ON public.vehicle_owners FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete" ON public.vehicle_owners FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vehicle_owners_updated_at BEFORE UPDATE ON public.vehicle_owners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  locations TEXT[] NOT NULL DEFAULT '{}',
  price NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  includes TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  status approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_agent_owner(_agent_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agents WHERE id = _agent_id AND user_id = auth.uid()
  )
$$;

CREATE POLICY "Approved packages visible to all" ON public.packages FOR SELECT USING (status = 'approved' OR public.is_agent_owner(agent_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Agents can insert packages" ON public.packages FOR INSERT WITH CHECK (public.is_agent_owner(agent_id));
CREATE POLICY "Agents can update own packages" ON public.packages FOR UPDATE USING (public.is_agent_owner(agent_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete packages" ON public.packages FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.vehicle_owners(id) ON DELETE CASCADE,
  vehicle_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  seats INTEGER NOT NULL,
  price_per_km NUMERIC NOT NULL,
  location TEXT NOT NULL,
  contact_phone TEXT,
  images TEXT[] DEFAULT '{}',
  status approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_vehicle_owner(_owner_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vehicle_owners WHERE id = _owner_id AND user_id = auth.uid()
  )
$$;

CREATE POLICY "Approved vehicles visible to all" ON public.vehicles FOR SELECT USING (status = 'approved' OR public.is_vehicle_owner(owner_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (public.is_vehicle_owner(owner_id));
CREATE POLICY "Owners can update own vehicles" ON public.vehicles FOR UPDATE USING (public.is_vehicle_owner(owner_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vehicles" ON public.vehicles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  pickup_location TEXT,
  travel_date DATE NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Agents can view bookings for their packages" ON public.bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.packages p
    JOIN public.agents a ON p.agent_id = a.id
    WHERE p.id = package_id AND a.user_id = auth.uid()
  )
);
CREATE POLICY "Vehicle owners can view bookings for their vehicles" ON public.bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.vehicles v
    JOIN public.vehicle_owners vo ON v.owner_id = vo.id
    WHERE v.id = vehicle_id AND vo.user_id = auth.uid()
  )
);
CREATE POLICY "Authenticated users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.phone);
  -- Default role is customer
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
