/**
 * Mock Data Generator
 * 
 * PURPOSE: Generate realistic mock data for demo purposes
 * Simulates what real Microsoft 365 tenant data would look like
 */

type Provider = 'M365' | 'SharePoint' | 'Teams' | 'OneDrive' | 'Exchange';
type Risk = 'high' | 'medium' | 'low';
type IssueType = 'external_share' | 'stale' | 'orphaned' | 'waste';
type FileType = 'file' | 'site' | 'channel' | 'folder';

export interface RemediationItem {
  id: string;
  name: string;
  type: FileType;
  provider: Provider;
  risk: Risk;
  issue: IssueType;
  size: string;
  lastModified: string;
  owner: string;
  externalUsers?: number;
}

const FILE_NAMES = [
  // Financial
  'Q1 2025 Budget Forecast.xlsx',
  'Q2 2025 Financial Projections.xlsx',
  'Q3 2025 Revenue Analysis.xlsx',
  'Q4 2025 Budget Planning.xlsx',
  'Annual Financial Report 2024.pdf',
  '2025 Tax Documents.zip',
  'Quarterly Earnings Call Notes.docx',
  'Board Meeting Financial Package.pptx',
  
  // Marketing
  'Campaign Assets 2024.zip',
  'Brand Guidelines v3.pdf',
  'Social Media Calendar Q1.xlsx',
  'Marketing Analytics Dashboard.pbix',
  'Product Launch Presentation.pptx',
  'Customer Journey Map.vsd',
  'Email Campaign Templates.zip',
  'Website Redesign Mockups.fig',
  
  // HR
  'Employee Handbook 2025.pdf',
  'Performance Review Templates.docx',
  'Onboarding Checklist.xlsx',
  'Benefits Enrollment Guide.pdf',
  'Salary Benchmarking Data.xlsx',
  'Exit Interview Templates.docx',
  'Training Materials Archive.zip',
  
  // Engineering
  'API Documentation v2.1.pdf',
  'System Architecture Diagram.vsd',
  'Database Schema Export.sql',
  'Code Review Guidelines.md',
  'Sprint Planning Notes.docx',
  'QA Test Cases.xlsx',
  'Production Deployment Log.txt',
  'Bug Tracking Backup.csv',
  
  // Legal
  'Contract Templates 2024.zip',
  'NDA Agreement Master.docx',
  'Vendor Agreements Archive.pdf',
  'Compliance Audit Report.pdf',
  'Intellectual Property Docs.zip',
  'Terms of Service v4.docx',
  
  // Operations
  'Vendor Contact List.xlsx',
  'Office Lease Agreement.pdf',
  'IT Asset Inventory.xlsx',
  'Security Incident Log.xlsx',
  'Disaster Recovery Plan.docx',
  'Network Diagram 2024.vsd',
  
  // Sales
  'Customer Database Backup.xlsx',
  'Sales Pipeline Q1 2025.xlsx',
  'Proposal Template Master.pptx',
  'Contract Negotiation Notes.docx',
  'RFP Response Templates.zip',
  'Client Presentation Archive.zip',
  
  // Generic Waste
  'Untitled Folder',
  'New folder (1)',
  'Copy of Copy of Budget.xlsx',
  'FINAL_FINAL_v3_USE_THIS.docx',
  'Old Marketing Materials',
  'Archived Projects 2019',
  'Temp Files DO NOT DELETE',
  'Video Project Renders 2023',
  'Meeting Recordings Archive',
  'Desktop Backup 2022.zip'
];

const OWNERS = [
  'Sarah Chen',
  'Marcus Johnson',
  'Alex Rivera',
  'Jordan Lee',
  'Taylor Swift',
  'Morgan Freeman',
  'Casey Miller',
  'Jamie Rodriguez',
  'Pat Anderson',
  'Sam Williams',
  'Drew Patterson',
  'Chris Martinez',
  'Kelly Thompson',
  'Dana Garcia',
  'Robin Davis'
];

const SITE_NAMES = [
  'Marketing Hub',
  'Engineering Wiki',
  'HR Portal',
  'Sales Central',
  'Finance Dashboard',
  'Legal Vault',
  'Operations Center',
  'Customer Success',
  'Product Team',
  'Executive Suite',
  'Project Phoenix',
  'Project Atlas',
  'Innovation Lab',
  'Research Archive',
  'Training Center'
];

const TEAM_NAMES = [
  'Marketing Team',
  'Engineering',
  'Sales',
  'Product Management',
  'Customer Support',
  'Finance',
  'HR Operations',
  'Legal',
  'Executive Leadership',
  'IT Infrastructure'
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSize(): string {
  const type = Math.random();
  if (type < 0.6) {
    // Most files are small (KB to MB)
    const size = randomInt(10, 999);
    return Math.random() < 0.7 ? `${size} KB` : `${(size / 1000).toFixed(1)} MB`;
  } else if (type < 0.9) {
    // Some files are medium (MB)
    return `${randomInt(1, 500)} MB`;
  } else {
    // Few files are large (GB)
    return `${(randomInt(1, 20) / 10).toFixed(1)} GB`;
  }
}

function randomDate(): string {
  const daysAgo = randomInt(1, 720); // Up to 2 years ago
  if (daysAgo < 30) return `${daysAgo}d ago`;
  if (daysAgo < 365) return `${Math.floor(daysAgo / 30)}mo ago`;
  return `${Math.floor(daysAgo / 365)}y ago`;
}

export function generateRemediationItems(count: number = 100): RemediationItem[] {
  const items: RemediationItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const type: FileType = randomItem<FileType>(['file', 'file', 'file', 'file', 'site', 'folder', 'channel']);
    const issue: IssueType = randomItem<IssueType>(['external_share', 'stale', 'stale', 'orphaned', 'waste', 'waste']);
    
    let name: string;
    let provider: Provider;
    
    if (type === 'site') {
      name = randomItem(SITE_NAMES);
      provider = 'SharePoint';
    } else if (type === 'channel') {
      name = `${randomItem(TEAM_NAMES)} - General`;
      provider = 'Teams';
    } else if (type === 'folder') {
      name = randomItem([
        `${randomItem(SITE_NAMES)} Archive`,
        `Shared Documents/${randomItem(['Marketing', 'Sales', 'Finance', 'Legal'])}`,
        randomItem(FILE_NAMES).replace(/\.[^/.]+$/, '') + ' Folder'
      ]);
      provider = randomItem<Provider>(['SharePoint', 'OneDrive']);
    } else {
      name = randomItem(FILE_NAMES);
      provider = randomItem<Provider>(['SharePoint', 'OneDrive', 'Teams']);
    }
    
    const risk: Risk = 
      issue === 'external_share' && Math.random() > 0.5 ? 'high' :
      issue === 'orphaned' && Math.random() > 0.6 ? 'medium' :
      issue === 'waste' && Math.random() > 0.7 ? 'low' :
      randomItem<Risk>(['low', 'medium', 'high']);
    
    items.push({
      id: `item-${i + 1}`,
      name,
      type,
      provider,
      risk,
      issue,
      size: randomSize(),
      lastModified: randomDate(),
      owner: randomItem(OWNERS),
      externalUsers: issue === 'external_share' ? randomInt(1, 15) : undefined,
    });
  }
  
  return items;
}

// Search items helper
export function searchRemediationItems(
  items: RemediationItem[],
  query: string,
  riskFilter: 'all' | Risk,
  issueFilter: 'all' | IssueType
): RemediationItem[] {
  return items.filter(item => {
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.owner.toLowerCase().includes(query.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || item.risk === riskFilter;
    const matchesIssue = issueFilter === 'all' || item.issue === issueFilter;
    
    return matchesSearch && matchesRisk && matchesIssue;
  });
}
