# Internal training presentations

Self-contained animated walkthrough decks (single-file HTML), published online as Claude
Artifacts and linked from the mockup's **Release notes** page.

## Users at the client level
- **Source:** [`users-client-level.html`](./users-client-level.html)
- **Live (online):** https://claude.ai/code/artifact/85774a4e-9559-468b-9e47-4daf806965ba
- **Linked from:** Release notes → *"Users now live at the client level"* → **Watch the 2-minute walkthrough**
- Covers the move of user management from per-data-group to the client-level grid
  (before/after, the filter, edit-membership and bulk-create modals, benefits). Uses the
  official shalion mark; theme-aware (light/dark); keyboard + autoplay navigation.

## MSRP → Client Configuration
- **Source:** [`client-configuration.html`](./client-configuration.html)
- **Live (online):** https://claude.ai/code/artifact/7579f72c-56e7-431a-8793-3ec244edef35
- **Linked from:** Release notes → *"MSRP is now Client Configuration"* → **Read the full story**
- The story of MSRP becoming Client Configuration: flexible pricing across Global / Region /
  Store / Region & Store with rightmost-wins precedence, the fields that moved off the client
  SKU (business unit, client category, hero, validity dates), and the downstream table renames
  (`msrp_* → client_configuration_*`) + Airbyte/ETL migration. Built from the product spec.

To update: edit the HTML, then re-publish it as a Claude Artifact — it redeploys to the same
URL, so the Release-notes link keeps working.
