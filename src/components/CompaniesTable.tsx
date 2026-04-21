import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ExternalLink, Info, ChevronUp } from "lucide-react";
const CompaniesTable = () => {
  const contacts = Array(8).fill({
    id: 1,
    name: "John Doe",
    company: "ACME Inc.",
    recentQlType: "In-app trial",
    date: "May 1 2025",
    time: "1:25PM",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  });
  return <div className="w-full max-w-7xl mx-auto p-6 bg-background">
      {/* Header with search and edit columns */}
      <div style={{
      display: 'flex',
      padding: 'var(--space-400, 16px)',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      alignSelf: 'stretch',
      border: '1px solid #CFCCCB',
      borderBottom: 'none',
      background: 'var(--color-fill-surface-recessed, #F8F7F6)'
    }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search Companies" style={{
          display: 'flex',
          width: '332px',
          height: '40px',
          alignItems: 'center',
          borderRadius: 'var(--borderRadius-transitional-full-3, 999999px)',
          border: '1px solid #CFCCCB',
          background: 'var(--color-fill-field-default, #FFF)',
          paddingLeft: '40px'
        }} />
        </div>
        <Button variant="secondary-alt" size="small" style={{
        borderRadius: 'var(--borderRadius-100, 4px)',
        border: '1px solid var(--color-border-tertiary-default, #8C8787)',
        background: 'var(--color-fill-tertiary-default, #FFF)',
        fontFamily: 'var(--typography-detail-100-fontFamily, "Lexend Deca")',
        fontSize: 'var(--typography-detail-100-fontSize, 12px)',
        fontStyle: 'normal',
        fontWeight: 'var(--typography-detail-100-fontWeight, 300)',
        lineHeight: 'var(--typography-detail-100-lineHeight, 14px)',
        letterSpacing: 'var(--typography-detail-100-letterSpacing, 0)'
      }}>
          Edit Columns
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-card border border-trellis-neutral-500 rounded-0">
        {/* Table Header */}
        <div className="flex border-b border-trellis-neutral-500">
          <div className="flex flex-col justify-center items-center" style={{
          display: 'flex',
          width: '72px',
          minHeight: '44px',
          maxHeight: '44px',
          padding: '12px 24px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F5F3F2'
        }}>
            <Checkbox />
          </div>
          <div className="flex flex-col justify-center items-start" style={{
          display: 'flex',
          flex: '1 0 0',
          minHeight: '44px',
          maxHeight: '44px',
          padding: '12px 24px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#F5F3F2'
        }}>
            <div className="flex items-center gap-1 table-header-text">
              CONTACT
              <ChevronUp className="h-3 w-3" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start" style={{
          display: 'flex',
          flex: '1 0 0',
          minHeight: '44px',
          maxHeight: '44px',
          padding: '12px 24px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#F5F3F2'
        }}>
            <div className="flex items-center gap-1 table-header-text">
              COMPANY
              <ChevronUp className="h-3 w-3" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start" style={{
          display: 'flex',
          flex: '1 0 0',
          minHeight: '44px',
          maxHeight: '44px',
          padding: '12px 24px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#F5F3F2'
        }}>
            <div className="flex items-center gap-1 table-header-text">
              RECENT QL TYPE
              <Info className="h-3 w-3" />
              <ChevronUp className="h-3 w-3" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start" style={{
          display: 'flex',
          flex: '1 0 0',
          minHeight: '44px',
          maxHeight: '44px',
          padding: '12px 24px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#F5F3F2'
        }}>
            <div className="flex items-center gap-1 table-header-text">
              RECENT QL DATE (GMT+2)
              <ChevronUp className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div>
          {contacts.map((contact, index) => <div key={index} className={`flex hover:bg-muted/10 transition-colors ${index < contacts.length - 1 ? 'border-b border-trellis-neutral-500' : ''}`}>
              <div style={{
            display: 'flex',
            width: '72px',
            minHeight: '56px',
            padding: '16px 24px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            background: '#FFF'
          }}>
                <Checkbox />
              </div>
              <div style={{
            display: 'flex',
            minHeight: '56px',
            padding: '16px 24px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            background: '#FFF'
          }}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span style={{
                fontFamily: 'var(--typography-body-125-fontFamily, "Lexend Deca")',
                fontSize: 'var(--typography-body-125-fontSize, 14px)',
                fontStyle: 'normal',
                fontWeight: 'var(--typography-body-125-fontWeight, 600)',
                lineHeight: 'var(--typography-body-125-lineHeight, 24px)',
                letterSpacing: 'var(--typography-body-125-letterSpacing, 0)'
              }} className="text-foreground">
                    {contact.name}
                  </span>
                </div>
              </div>
              <div style={{
            display: 'flex',
            minHeight: '56px',
            padding: '16px 24px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            background: '#FFF'
          }}>
                <div className="flex items-center gap-2">
                  <span style={{
                fontFamily: 'var(--typography-body-125-fontFamily, "Lexend Deca")',
                fontSize: 'var(--typography-body-125-fontSize, 14px)',
                fontStyle: 'normal',
                fontWeight: 'var(--typography-body-125-fontWeight, 600)',
                lineHeight: 'var(--typography-body-125-lineHeight, 24px)',
                letterSpacing: 'var(--typography-body-125-letterSpacing, 0)'
              }} className="text-foreground">
                    {contact.company}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div style={{
            display: 'flex',
            minHeight: '56px',
            padding: '16px 24px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            background: '#FFF'
          }}>
                <span style={{
              fontFamily: 'var(--typography-body-100-fontFamily, "Lexend Deca")',
              fontSize: 'var(--typography-body-100-fontSize, 14px)',
              fontStyle: 'normal',
              fontWeight: 'var(--typography-body-100-fontWeight, 300)',
              lineHeight: 'var(--typography-body-100-lineHeight, 24px)',
              letterSpacing: 'var(--typography-body-100-letterSpacing, 0)'
            }} className="text-core">
                  {contact.recentQlType}
                </span>
              </div>
              <div style={{
            display: 'flex',
            minHeight: '56px',
            padding: '16px 24px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            background: '#FFF'
          }}>
                <span style={{
              fontFamily: 'var(--typography-body-100-fontFamily, "Lexend Deca")',
              fontSize: 'var(--typography-body-100-fontSize, 14px)',
              fontStyle: 'normal',
              fontWeight: 'var(--typography-body-100-fontWeight, 300)',
              lineHeight: 'var(--typography-body-100-lineHeight, 24px)',
              letterSpacing: 'var(--typography-body-100-letterSpacing, 0)'
            }} className="text-foreground">
                  {contact.date}
                </span>
                <span style={{
              fontFamily: 'var(--typography-detail-100-fontFamily, "Lexend Deca")',
              fontSize: 'var(--typography-detail-100-fontSize, 12px)',
              fontStyle: 'normal',
              fontWeight: 'var(--typography-detail-100-fontWeight, 300)',
              lineHeight: 'var(--typography-detail-100-lineHeight, 14px)',
              letterSpacing: 'var(--typography-detail-100-letterSpacing, 0)'
            }} className="text-muted-foreground">
                  {contact.time}
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default CompaniesTable;