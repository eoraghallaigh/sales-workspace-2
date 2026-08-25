import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import { SpecHeader, SpecSection, StateCard, FlowStep, Callout, CodeRef } from "./blocks";
import ViewController, { type EntityView } from "@/components/ViewController";
import ContactsTableView from "@/components/ContactsTableView";
import CreateCallTaskPanel from "@/components/CreateCallTaskPanel";
import { prospectingCompanies } from "@/data/prospectingCompanies";
import { Company } from "@/components/CompanyCard";
import { calculateCompanyStatus } from "@/utils/companyStatusUtils";

const P1_COMPANIES: Company[] = prospectingCompanies
  .filter((c) => (c.priority ?? "P1") === "P1")
  .map((c) => ({ ...c, status: calculateCompanyStatus(c, new Set()) }))
  .slice(0, 5);

const ViewControllerShowcase = () => {
  const [value, setValue] = useState<EntityView>("contacts");
  return <ViewController value={value} onChange={setValue} />;
};

const ContactsTableShowcase = ({
  withCallTasks = false,
}: {
  withCallTasks?: boolean;
}) => {
  const tasks = withCallTasks
    ? Object.fromEntries(
        P1_COMPANIES.flatMap((c) => c.recommendedContacts.slice(0, 2)).map((ct) => [ct.id, 1]),
      )
    : {};
  return (
    <ContactsTableView
      companies={P1_COMPANIES}
      activeCallTasks={tasks}
      onCreateCallTasks={() => {}}
    />
  );
};

const CreateCallTaskShowcase = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative h-[500px] overflow-hidden border border-border rounded-100">
      <CreateCallTaskPanel
        open={open}
        contactCount={5}
        defaultTitle="P1 call queue"
        onOpenChange={setOpen}
      />
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute inset-0 flex items-center justify-center body-100 text-muted-foreground"
        >
          Click to reopen panel
        </button>
      )}
    </div>
  );
};

const ContactViewsSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Contact views"
      description="A contacts table view within the prospecting tab, allowing reps to toggle between company-level and contact-level views for any PPF bucket (P1–P4) or Play. Includes multi-select, bulk call task creation, and AI agent activity tracking."
    />

    <SpecSection
      title="View controller"
      description="A pill toggle that switches the table between Companies and Contacts. Appears inline with the quick filters in the filter bar."
    >
      <StateCard label="Companies selected (default)" description="The default view when navigating to any PPF or Play view.">
        <ViewController value="companies" onChange={() => {}} />
      </StateCard>
      <StateCard label="Contacts selected" description="Switches the table to a flat list of all recommended contacts across the filtered companies.">
        <ViewController value="contacts" onChange={() => {}} />
      </StateCard>
      <StateCard label="Interactive" description="Toggle between views.">
        <ViewControllerShowcase />
      </StateCard>
    </SpecSection>

    <SpecSection
      title="Quick filters (contacts mode)"
      description="When the contacts view is active, the quick filters change to contact-relevant options. The card/table ViewToggle is hidden."
    >
      <Callout type="behavior">
        The filter bar shows different filters depending on the entity view. Companies mode: Worked Status, All Industries, Signals, Advanced Filters. Contacts mode: Job Title, In Sequence, Signals, Touches since PPF, Industry, Advanced Filters.
      </Callout>
    </SpecSection>

    <SpecSection
      title="Contacts table"
      description="A flat table of all recommended contacts from the filtered companies. Each row shows the contact, their company, and activity data."
    >
      <StateCard
        label="Default state (no call tasks created)"
        description="All contacts shown with their company, industry, email, phone, signals, conversions, last sequence ended date, call tasks count (0), and AI agent activity."
      >
        <div className="w-full overflow-x-auto">
          <ContactsTableShowcase />
        </div>
      </StateCard>

      <StateCard
        label="After call tasks created"
        description="Contacts that have had call tasks created show a non-zero Active Call Tasks count and 'Call notes generating' in the AI Agent Activity column."
      >
        <div className="w-full overflow-x-auto">
          <ContactsTableShowcase withCallTasks />
        </div>
      </StateCard>
    </SpecSection>

    <SpecSection title="Columns" description="The contacts table columns, in order.">
      <div className="bg-[var(--color-fill-surface-raised)] border border-border rounded-100 overflow-hidden">
        <table className="w-full body-100">
          <thead>
            <tr className="bg-[var(--color-fill-surface-recessed)] border-b border-border">
              <th className="text-left px-4 py-2 heading-50">Column</th>
              <th className="text-left px-4 py-2 heading-50">Source</th>
              <th className="text-left px-4 py-2 heading-50">Notes</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr]:border-border [&_tr:last-child]:border-0">
            <tr><td className="px-4 py-2">Contact Name</td><td className="px-4 py-2"><CodeRef>RecommendedContact.name</CodeRef></td><td className="px-4 py-2">Avatar + name + job title subline</td></tr>
            <tr><td className="px-4 py-2">Company</td><td className="px-4 py-2"><CodeRef>Company.name</CodeRef></td><td className="px-4 py-2">Company logo + name</td></tr>
            <tr><td className="px-4 py-2">Industry</td><td className="px-4 py-2"><CodeRef>Company.industry</CodeRef></td><td className="px-4 py-2">From parent company</td></tr>
            <tr><td className="px-4 py-2">Email</td><td className="px-4 py-2"><CodeRef>contactDetails[id].email</CodeRef></td><td className="px-4 py-2">Falls back to derived email from company domain</td></tr>
            <tr><td className="px-4 py-2">Phone Number</td><td className="px-4 py-2"><CodeRef>contactDetails[id].phone</CodeRef></td><td className="px-4 py-2">Falls back to deterministic mock; shows "—" if hasPhone=false</td></tr>
            <tr><td className="px-4 py-2">Last Contacted</td><td className="px-4 py-2"><CodeRef>RecommendedContact.lastContactedDate</CodeRef></td><td className="px-4 py-2">Date string or "—"</td></tr>
            <tr><td className="px-4 py-2">Signals</td><td className="px-4 py-2"><CodeRef>RecommendedContact.signals</CodeRef></td><td className="px-4 py-2">Up to 2 signal chips</td></tr>
            <tr><td className="px-4 py-2">Recent Conversions</td><td className="px-4 py-2"><CodeRef>RecommendedContact.recentConversions</CodeRef></td><td className="px-4 py-2">Green dot if &gt; 0, gray dot otherwise</td></tr>
            <tr><td className="px-4 py-2">Last Sequence Ended</td><td className="px-4 py-2">Derived</td><td className="px-4 py-2">"Active" if enrolled, date if previously enrolled, "—" if never</td></tr>
            <tr><td className="px-4 py-2">Active Call Tasks</td><td className="px-4 py-2">Runtime state</td><td className="px-4 py-2">Starts at 0; increments when tasks are created via the panel</td></tr>
            <tr><td className="px-4 py-2">AI Agent Activity</td><td className="px-4 py-2">Derived + runtime</td><td className="px-4 py-2">Two bullet points: sequence status + call notes status</td></tr>
          </tbody>
        </table>
      </div>
    </SpecSection>

    <SpecSection
      title="AI Agent Activity states"
      description="Each cell in the AI Agent Activity column shows two status lines."
    >
      <div className="bg-[var(--color-fill-surface-raised)] border border-border rounded-100 overflow-hidden">
        <table className="w-full body-100">
          <thead>
            <tr className="bg-[var(--color-fill-surface-recessed)] border-b border-border">
              <th className="text-left px-4 py-2 heading-50">Line</th>
              <th className="text-left px-4 py-2 heading-50">State</th>
              <th className="text-left px-4 py-2 heading-50">Indicator</th>
              <th className="text-left px-4 py-2 heading-50">Condition</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr]:border-border [&_tr:last-child]:border-0">
            <tr><td className="px-4 py-2">Sequences</td><td className="px-4 py-2">Sequence enrolled</td><td className="px-4 py-2">Green dot</td><td className="px-4 py-2"><CodeRef>enrolledInSequence === true</CodeRef></td></tr>
            <tr><td className="px-4 py-2">Sequences</td><td className="px-4 py-2">Sequence generated</td><td className="px-4 py-2">Blue dot</td><td className="px-4 py-2"><CodeRef>outreachStrategyCreated === true</CodeRef></td></tr>
            <tr><td className="px-4 py-2">Sequences</td><td className="px-4 py-2">No sequence generated</td><td className="px-4 py-2">Gray dot</td><td className="px-4 py-2">Default</td></tr>
            <tr><td className="px-4 py-2">Call notes</td><td className="px-4 py-2">Call notes generating</td><td className="px-4 py-2">AI shimmer (24px)</td><td className="px-4 py-2">After call tasks created for this contact</td></tr>
            <tr><td className="px-4 py-2">Call notes</td><td className="px-4 py-2">No notes generated</td><td className="px-4 py-2">Gray dot</td><td className="px-4 py-2">Default (no call tasks)</td></tr>
          </tbody>
        </table>
      </div>
    </SpecSection>

    <SpecSection
      title="Create call tasks flow"
      description="Selecting contacts and creating bulk call tasks via the side panel."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Select contacts"
          description="Check one or more contacts using the row checkboxes. A 'Create Call Tasks' CTA appears in the toolbar beside the search field."
        />
        <FlowStep
          step={2}
          label="Click 'Create Call Tasks'"
          description="The side panel slides in from the right (300ms ease-out, no overlay, white background with drop shadow)."
        />
        <FlowStep
          step={3}
          label="Review task details"
          description="The panel pre-fills: Task Title defaults to '{view name} call queue' (e.g. 'P1 call queue', 'Salesforce Switchers call queue'). Task Type defaults to Call. Due Date defaults to tomorrow. Task Notes is disabled by default with 'Allow Outreach Agent to create this' toggle on."
        />
        <FlowStep
          step={4}
          label="Click 'Create'"
          description="Panel closes. A success Alert (green, top-center) appears for 3 seconds. The Active Call Tasks column increments for the selected contacts. The AI Agent Activity column shows 'Call notes generating' with AI shimmer for those contacts."
          isLast
        />
      </div>
    </SpecSection>

    <SpecSection
      title="Create Call Task panel"
      description="The side panel for bulk call task creation."
    >
      <StateCard
        label="Panel open"
        description="Slides in from the right. Fields: Task Title, Task Notes (with agent toggle), Task Type, Due Date (calendar picker)."
      >
        <div className="w-[480px] h-[520px] relative overflow-hidden border border-border rounded-100">
          <CreateCallTaskShowcase />
        </div>
      </StateCard>
    </SpecSection>

    <SpecSection
      title="P-level descriptions"
      description="Each PPF view (P1–P4) shows a description line below the company/contact count."
    >
      <div className="bg-[var(--color-fill-surface-raised)] border border-border rounded-100 overflow-hidden">
        <table className="w-full body-100">
          <thead>
            <tr className="bg-[var(--color-fill-surface-recessed)] border-b border-border">
              <th className="text-left px-4 py-2 heading-50">View</th>
              <th className="text-left px-4 py-2 heading-50">Description</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr]:border-border [&_tr:last-child]:border-0">
            <tr><td className="px-4 py-2">P1 - Now</td><td className="px-4 py-2">P1s are your top priority leads, with high value and high intent.</td></tr>
            <tr><td className="px-4 py-2">P2 - Next</td><td className="px-4 py-2">P2s are high value leads with low intent. They require some nurturing.</td></tr>
            <tr><td className="px-4 py-2">P3 - Later</td><td className="px-4 py-2">P3s have high intent but lower value.</td></tr>
            <tr><td className="px-4 py-2">P4 - Last</td><td className="px-4 py-2">P4s have low intent and low value.</td></tr>
          </tbody>
        </table>
      </div>
    </SpecSection>

    <SpecSection title="Key files">
      <div className="bg-[var(--color-fill-surface-raised)] border border-border rounded-100 overflow-hidden">
        <table className="w-full body-100">
          <thead>
            <tr className="bg-[var(--color-fill-surface-recessed)] border-b border-border">
              <th className="text-left px-4 py-2 heading-50">File</th>
              <th className="text-left px-4 py-2 heading-50">Purpose</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr]:border-border [&_tr:last-child]:border-0">
            <tr><td className="px-4 py-2"><CodeRef>src/components/ViewController.tsx</CodeRef></td><td className="px-4 py-2">Companies/Contacts pill toggle</td></tr>
            <tr><td className="px-4 py-2"><CodeRef>src/components/ContactsTableView.tsx</CodeRef></td><td className="px-4 py-2">Flat contacts table with all columns</td></tr>
            <tr><td className="px-4 py-2"><CodeRef>src/components/CreateCallTaskPanel.tsx</CodeRef></td><td className="px-4 py-2">Slide-out side panel for bulk call task creation</td></tr>
            <tr><td className="px-4 py-2"><CodeRef>src/pages/Prospecting.tsx</CodeRef></td><td className="px-4 py-2">Parent page — manages entity view state, active call tasks, success alert, quick filters</td></tr>
          </tbody>
        </table>
      </div>
    </SpecSection>
  </SpecLayout>
);

export default ContactViewsSpec;
