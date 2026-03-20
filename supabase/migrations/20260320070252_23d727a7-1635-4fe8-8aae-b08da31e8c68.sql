-- Insert SoaringX agency
INSERT INTO public.agents (user_id, agency_name, owner_name, phone, email, instagram, description, address, status, is_verified)
VALUES (
  NULL,
  'SoaringX Tours & Packages',
  'SoaringX Team',
  '9390071812',
  'soaring.xofficial@gmail.com',
  'https://www.instagram.com/soaringx.tour',
  'Pack Your Bags. We Handle the Rest. Premium tour packages covering Kerala, Ooty, Coorg, Goa, and more. Trusted by 5000+ happy travelers.',
  'Bengaluru',
  'approved',
  true
);

-- Insert Kerala Adventure package
INSERT INTO public.packages (agent_id, title, description, price, duration, locations, includes, itinerary, status)
VALUES (
  (SELECT id FROM public.agents WHERE agency_name = 'SoaringX Tours & Packages' LIMIT 1),
  'Kerala Adventure Trip',
  'Experience the ultimate Kerala adventure! Explore the misty hills of Munnar, witness the breathtaking sunrise at Kolukkumalai, and cruise through the serene backwaters of Alleppey.',
  6499,
  '3 Days / 2 Nights',
  ARRAY['Munnar', 'Kolukkumalai', 'Alleppey'],
  ARRAY['Transport', 'Hygienic Stay', 'Food Included', 'Jeep Ride', 'Shikara Boat Ride'],
  '["Day 1: Pickup from Bengaluru, drive to Munnar. Evening: Explore local markets and tea gardens", "Day 2: Early morning Kolukkumalai Jeep Ride, Mattupetty Dam, Echo Point. Drive to Alleppey", "Day 3: Alleppey Shikara Boat Ride, Alleppey Beach, Return journey"]'::jsonb,
  'approved'
);

-- Insert Ooty Escape package
INSERT INTO public.packages (agent_id, title, description, price, duration, locations, includes, itinerary, status)
VALUES (
  (SELECT id FROM public.agents WHERE agency_name = 'SoaringX Tours & Packages' LIMIT 1),
  'Misty Ooty Escape',
  'Escape to the Queen of Hill Stations! Budget-friendly Ooty package with transport, meals, Toy Train ride, entry tickets, and 3-star hotel stay.',
  4499,
  '1 Night / 2 Days',
  ARRAY['Bengaluru', 'Ooty'],
  ARRAY['Transport', '4 Meals + Snacks + Tea/Coffee', 'Toy Train Ticket', 'Entry Tickets + Boating', '1 Night 3-Star Hotel Stay'],
  '["Day 1: Bengaluru to Ooty, Botanical Garden, Ooty Lake Boating, Toy Train Ride, Hotel check-in", "Day 2: Rose Garden, Tea Factory Visit, Doddabetta Peak, Shopping, Return to Bengaluru"]'::jsonb,
  'approved'
);

-- Insert vehicle owner
INSERT INTO public.vehicle_owners (user_id, owner_name, phone, email, status, is_verified)
VALUES (NULL, 'Payana Fleet Services', '9390071812', 'fleet@payanabookings.com', 'approved', true);

-- Insert Tourist Bus
INSERT INTO public.vehicles (owner_id, vehicle_name, vehicle_type, seats, price_per_km, location, status, contact_phone)
VALUES (
  (SELECT id FROM public.vehicle_owners WHERE owner_name = 'Payana Fleet Services' LIMIT 1),
  'Luxury Tourist Bus', 'Tourist Bus', 40, 45, 'Hubli', 'approved', '9390071812'
);

-- Insert Tempo Traveller
INSERT INTO public.vehicles (owner_id, vehicle_name, vehicle_type, seats, price_per_km, location, status, contact_phone)
VALUES (
  (SELECT id FROM public.vehicle_owners WHERE owner_name = 'Payana Fleet Services' LIMIT 1),
  'Tempo Traveller (12 Seater)', 'Tempo Traveller', 12, 25, 'Bangalore', 'approved', '9390071812'
);