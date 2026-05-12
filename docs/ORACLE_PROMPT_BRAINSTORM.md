# Oracle Prompt Brainstorm for Live Mode

Use this as a working brief for brainstorming generic Oracle Search prompts with Gemini. The goal is to keep live prompts useful for any tenant, including tenants with very little indexed content.

## Recommendation

Live Mode prompts should avoid pretending that specific documents exist. They should invite searches by document type, business function, risk posture, owner, or date. Demo Mode can keep more cinematic sample prompts because it has known mock data.

## Strong Generic Prompt Candidates

- Find policy documents
- Search for contracts
- Show recently modified files
- Find files shared externally
- Search for budget documents
- Find onboarding materials
- Show large files
- Find stale documents
- Search by owner email
- Find meeting notes
- Search for invoices
- Find project documents
- Show files missing an owner
- Find documents with public links
- Search for procedures or SOPs
- Find HR documents
- Find finance documents
- Search for audit materials

## Higher-Intent Variants

- What files may need cleanup?
- Which documents look stale?
- Which files are likely business critical?
- What documents should I review first?
- Which files appear externally exposed?
- What content should become a workspace?
- Which files are related to a project keyword?

## Empty-State Prompt Copy

- Search by filename, owner, project term, or document type.
- Try a document type like policy, contract, invoice, or meeting notes.
- Use an owner email, team name, or business function to narrow results.
- Run Microsoft Discovery first if live search returns no results.

## Prompts to Avoid in Live Mode

- Prompts with fake people, projects, or exact documents, such as "Sarah Chen annual financial report."
- Prompts implying data exists, such as "Show me exposed board decks."
- Prompts with precise metrics, such as "Find files over 2 TB."
- Prompts that require unbuilt reasoning, such as "Which files violate policy?"
- Prompts tied to demo-only providers unless the live tenant has connected them.

## Future Dynamic Prompt Strategy

After discovery, prompts can be generated from tenant signals:

- If file extensions exist: "Find PDF documents" or "Find PowerPoint decks."
- If owners exist: "Search files owned by [owner email]."
- If stale counts exist: "Show files older than 12 months."
- If external share counts exist: "Review externally shared files."
- If workspace candidates exist: "Find documents for [top keyword]."
- If no indexed files exist: "Run Microsoft Discovery" and "Create an empty workspace."

## Product Direction

For V1, hardcode conservative generic prompts and show a clear no-results path. For V1.5, shift toward tenant-aware prompt suggestions generated from indexed metadata, not invented examples.
