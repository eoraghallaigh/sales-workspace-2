import { cn } from "@/lib/utils";
import chevronDownSvg from "@/assets/chevron-down.svg";

// Maps icon name to the PascalCase filename on the HubSpot CDN
// Some filenames have suffixes like -1 that differ from the name
const ICON_FILE_MAP: Record<string, string> = {
  add: "Add",
  appointment: "Appointment",
  approvals: "Approvals",
  artificialIntelligence: "ArtificialIntelligence",
  artificialIntelligenceEnhanced: "ArtificialIntelligenceEnhanced",
  attach: "Attach",
  bank: "Bank",
  block: "Block",
  book: "Book",
  bulb: "Bulb",
  calling: "Calling",
  callingHangup: "CallingHangup",
  callingMade: "CallingMade",
  callingMissed: "CallingMissed",
  callingVoicemail: "CallingVoicemail",
  callTranscript: "CallTranscript",
  campaigns: "Campaigns",
  cap: "Cap",
  checkCircle: "CheckCircle",
  circleFilled: "CircleFilled",
  circleHollow: "CircleHollow",
  clock: "Clock",
  comment: "Comment",
  contact: "Contact",
  copy: "Copy",
  crm: "Crm",
  dataSync: "DataSync",
  date: "Date",
  delay: "Delay",
  delete: "Delete",
  description: "Description",
  developerProjects: "DeveloperProjects",
  documents: "Documents",
  downCarat: "DownCarat",
  download: "Download",
  edit: "Edit",
  ellipses: "Ellipses",
  email: "Email",
  emailOpen: "EmailOpen",
  emailThreadedReplies: "EmailThreadedReplies",
  enrichment: "Enrichment",
  enroll: "Enroll",
  exclamation: "Exclamation",
  exclamationCircle: "ExclamationCircle",
  externalLink: "ExternalLink",
  facebook: "Facebook",
  faceHappy: "FaceHappy",
  faceHappyFilled: "FaceHappyFilled",
  faceNeutral: "FaceNeutral",
  faceNeutralFilled: "FaceNeutralFilled",
  faceSad: "FaceSad",
  faceSadFilled: "FaceSadFilled",
  favoriteHollow: "FavoriteHollow",
  file: "File",
  filledXCircleIcon: "FilledXCircleIcon",
  filter: "Filter",
  flame: "Flame",
  folder: "Folder",
  folderOpen: "FolderOpen",
  forward: "Forward",
  gauge: "Gauge",
  generateChart: "GenerateChart",
  gift: "Gift",
  globe: "Globe",
  globeLine: "GlobeLine",
  goal: "Goal",
  googlePlus: "GooglePlus",
  guidedActions: "GuidedActions",
  hash: "Hash",
  hide: "Hide-1",
  home: "Home-1",
  hubDB: "HubDB",
  image: "Image",
  imageGallery: "ImageGallery",
  inbox: "Inbox",
  info: "Info",
  infoNoCircle: "InfoNoCircle",
  insertVideo: "InsertVideo",
  instagram: "Instagram",
  integrations: "Integrations",
  invoice: "Invoice-1",
  key: "Key",
  language: "Globe",
  left: "Left",
  lessCircle: "LessCircle",
  lesson: "Lesson",
  light: "Light",
  link: "Link",
  linkedin: "Linkedin",
  listView: "ListView",
  location: "Location",
  locked: "Locked",
  mention: "Mention",
  messages: "Messages",
  mobile: "Mobile",
  moreCircle: "MoreCircle",
  notEditable: "NotEditable",
  notification: "Notification",
  notificationOff: "NotificationOff",
  objectAssociations: "ObjectAssociations",
  objectAssociationsManyToMany: "ObjectAssociationsManyToMany",
  objectAssociationsManyToOne: "ObjectAssociationsManyToOne",
  office365: "Office365",
  order: "Order",
  paymentSubscriptions: "PaymentSubscriptions",
  pin: "Pin",
  pinterest: "Pinterest",
  powerPointFile: "PowerPointFile",
  presentation: "Presentation",
  product: "Product",
  publish: "Publish",
  question: "Question",
  questionAnswer: "QuestionAnswer",
  questionCircle: "QuestionCircle",
  quickbooks: "Quickbooks",
  quote: "Quote",
  readMore: "ReadMore",
  readOnlyView: "ReadOnlyView",
  realEstateListing: "RealEstateListing",
  recentlySelected: "RecentlySelected",
  record: "Record",
  redo: "Redo",
  refresh: "Refresh",
  registration: "Registration",
  remove: "Remove",
  replace: "Replace",
  reports: "Reports",
  right: "Right",
  robot: "Robot",
  rotate: "Rotate",
  rss: "Rss",
  salesQuote: "SalesQuote",
  salesTemplates: "SalesTemplates",
  save: "Save",
  search: "Search",
  send: "Send",
  sequences: "Sequences",
  settings: "Settings",
  shoppingCart: "ShoppingCart",
  signal: "Signal",
  signalPoor: "SignalPoor",
  signature: "Signature",
  snooze: "Snooze",
  sortAlpAsc: "SortAlpAsc",
  sortAlpDesc: "SortAlpDesc",
  sortAmtAsc: "SortAmtAsc",
  sortAmtDesc: "SortAmtDesc",
  sortNumAsc: "SortNumAsc",
  sortNumDesc: "SortNumDesc",
  sortTableAsc: "SortTableAsc",
  sortTableDesc: "SortTableDesc",
  spellCheck: "SpellCheck",
  sprocket: "Sprocket",
  star: "Star",
  stopRecord: "StopRecord",
  strike: "Strike",
  styles: "Styles",
  success: "Success",
  tablet: "Tablet",
  tag: "Tag",
  tasks: "Tasks",
  test: "Test",
  text: "Text",
  textBodyExpanded: "TextBodyExpanded",
  textColor: "TextColor",
  textDataType: "TextDataType",
  textSnippet: "TextSnippet-1",
  thumbsDown: "ThumbsDown",
  thumbsUp: "ThumbsUp",
  ticket: "Ticket",
  translate: "Translate",
  trophy: "Trophy",
  twitter: "Twitter",
  undo: "Undo",
  upCarat: "UpCarat",
  upload: "Upload",
  video: "Video",
  videoFile: "VideoFile",
  videoPlayerSubtitles: "VideoPlayerSubtitles",
  view: "View",
  viewDetails: "ViewDetails",
  warning: "Warning",
  website: "Website",
  workflows: "Workflows",
  x: "X",
  xCircle: "XCircle",
  xing: "Xing",
  youtube: "Youtube",
  youtubePlay: "YoutubePlay",
  zoomIn: "ZoomIn",
  zoomOut: "ZoomOut",
};

const CDN_BASE =
  "https://developers.hubspot.com/hubfs/Knowledge_Base_2023-24-25/uie-icons/trellis";

export type TrellisIconName = keyof typeof ICON_FILE_MAP;

export const TRELLIS_ICON_NAMES = Object.keys(ICON_FILE_MAP) as TrellisIconName[];

export interface TrellisIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Icon name from the Trellis icon set */
  name: TrellisIconName;
  /** Size in pixels (default 16) */
  size?: number;
}

export function TrellisIcon({ name, size = 16, className, style, ...props }: TrellisIconProps) {
  const file = ICON_FILE_MAP[name];
  if (!file) {
    console.warn(`TrellisIcon: unknown icon name "${name}"`);
    return null;
  }

  const LOCAL_OVERRIDES: Record<string, string> = {
    downCarat: chevronDownSvg,
  };

  const iconSrc = LOCAL_OVERRIDES[name] || `${CDN_BASE}/${file}.png`;

  return (
    <img
      src={iconSrc}
      alt={name}
      width={size}
      height={size}
      className={cn("inline-block shrink-0", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
}

export default TrellisIcon;
