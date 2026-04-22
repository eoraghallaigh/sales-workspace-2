

## Replace Detailed Elements with Grey Placeholder Blocks

Replace contact cards, intent signals, and strategy stats in Variants A, B, and C with simple grey placeholder blocks that label what the content is.

### Changes

**Variant B (`src/components/CompanyCardVariantB.tsx`)**
- Replace the contact cards section (lines 68–117) with a single grey rounded block: `"Contact Cards (3 contacts)"`
- Replace the signal tags section (lines 120–130) with a grey block: `"Intent Signals"`

**Variant C (`src/components/CompanyCardVariantC.tsx`)**
- Replace the contact cards section (lines 89–147) with a grey block: `"Contact Cards (3 contacts)"`

**Variant A (`src/components/CompanyCardVariantA.tsx`)**
- Replace the strategy stats row (lines 88–95) with a grey block: `"Strategy Details (outreach targets, emails drafted, call scripts)"`
- Replace the signal tags (lines 99–106) with a grey block: `"Intent Signals"`

### Grey Block Style
Each placeholder will be a simple `div` with:
- `bg-fill-surface-recessed` (the existing grey token)
- `rounded-lg`, `px-4 py-3`
- `detail-200 text-muted-foreground text-center`
- The label text describing what content belongs there

