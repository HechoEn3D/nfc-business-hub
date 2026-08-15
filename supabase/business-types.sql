-- NFC Business Hub — Business type foundation
-- Run this once in Supabase SQL Editor.
-- The dashboard can then use business_type to personalize modules per business.

alter table public.businesses
  add column if not exists business_type text;

alter table public.businesses
  drop constraint if exists businesses_business_type_check;

alter table public.businesses
  add constraint businesses_business_type_check
  check (business_type is null or business_type in (
    'restaurant',
    'gym',
    'barbershop',
    'beauty',
    'shop',
    'bazaar',
    'hotel',
    'other'
  ));

create index if not exists businesses_business_type_idx
  on public.businesses (business_type);
