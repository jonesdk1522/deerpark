# Sequential Team Approval Workflow Setup

This workflow enforces a strict sequential approval process for pull requests.

## Quick Start

1. **Copy the workflow file** to `.github/workflows/approval.yml`

2. **Create your configuration file** at `.github/approval-config.yml`:
   ```yaml
   teams:
     - slug: team-1-slug
       name: Team 1 Name
       slaHours: 24
     - slug: team-2-slug
       name: Team 2 Name
       slaHours: 48
   ```

3. **Set up authentication** (choose one):
   - Create a PAT with `repo` and `read:org` permissions and add it as `ACTIONS_PAT` secret
   - OR use the default `GITHUB_TOKEN` (limited permissions)

4. **Optional: Configure runners** via repository variables:
   - `USE_SELF_HOSTED`: Set to `false` to use GitHub-hosted runners
   - `SELF_HOSTED_RUNNER`: Your self-hosted runner label
   - `CONTAINER_IMAGE`: Container image for self-hosted runners

## Features

- ✅ Enforces sequential team approvals
- 🏷️ Automatic label management
- 💬 Status comments on PRs
- ⏰ SLA tracking and violations
- 🔔 Automated reminders
- 📊 Scheduled checks for all open PRs

## Configuration

### Teams Configuration

Teams must be listed in the order they need to approve:

```yaml
teams:
  - slug: frontend-team      # GitHub team slug (required)
    name: Frontend Team      # Display name
    description: UI review   # Optional description
    slaHours: 24             # Response time SLA
```

### Finding Team Slugs

1. Go to https://github.enterprise.irs.gov/orgs/YOUR_ORG/teams
2. Click on a team
3. The URL will be: `github.enterprise.irs.gov/orgs/YOUR_ORG/teams/TEAM_SLUG`
4. Use the `TEAM_SLUG` part in your configuration

### Options

All options and their defaults:

```yaml
options:
  autoRequestReview: true     # Auto-request next team
  updateLabels: true          # Manage PR labels
  postComments: true          # Post status comments
  requireAllTeams: true       # Require all teams
  createLabelsIfMissing: true # Create labels
  enableSLATracking: true     # Track SLAs
  sendReminders: true         # Send reminders
  reminderIntervalHours: 24   # Reminder frequency
  skipDraftPRs: true          # Skip draft PRs
```

## Labels Created

The workflow will automatically create these labels:
- `Pending: Team Name` - For each team (yellow)
- `Ready to Merge` - When all teams approved (green)
- `SLA Overdue: Team Name` - When SLA violated (red)

## Scheduled Runs

The workflow runs every 4 hours on weekdays to:
- Check for SLA violations
- Send reminders for pending approvals
- Update status of all open PRs

## Troubleshooting

### "Configuration file is required" error
- Create `.github/approval-config.yml` with at least one team

### "Team not found" errors
- Verify team slugs are correct
- Ensure the GitHub token has `read:org` permission

### Labels not being created
- Check that the token has `issues:write` permission
- Verify `createLabelsIfMissing: true` in config

### Workflow not triggering
- Ensure workflow file is in default branch
- Check GitHub Actions is enabled for the repository
