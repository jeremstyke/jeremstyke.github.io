# AI Connector for Telegram Channels & Groups

Manage your Telegram channels and groups from **Claude, ChatGPT and Gemini**. Just ask your AI to post, schedule, edit, pin or moderate.

🌐 Website: https://jeremstyke.github.io/tg-ai-connector/
🤖 Bot: [@Tgaiconnectorbot](https://t.me/Tgaiconnectorbot)

## How it works

1. Add **@Tgaiconnectorbot** as an admin of your channel or group (post, edit and delete rights).
2. Add your connector URL to your AI:
   - **Claude**: Settings > Connectors > Add custom connector
   - **ChatGPT**: Settings > Apps > Developer mode > add the URL
   - **Gemini / other MCP clients**: add it as a remote MCP server (Streamable HTTP)
3. Ask: *"Schedule a post on my channel tomorrow at 9am."*

## Tools

| Tool | What it does |
|---|---|
| `list_chats` | Lists your channels and groups with member counts |
| `add_chat` | Registers a channel or group where the bot is admin |
| `get_chat_info` | Title, description, members, pinned message |
| `publish_post` | Posts now: HTML text, image, link buttons, silent, pin |
| `schedule_post` | Schedules a post at a given date and time |
| `list_scheduled` | Lists scheduled posts |
| `cancel_scheduled` | Cancels a scheduled post |
| `edit_post` | Edits a published post |
| `delete_post` | Deletes a message |
| `pin_post` | Pins or unpins a message |
| `update_chat` | Changes title and description |
| `create_invite_link` | Creates a named invite link (track your ads) |
| `ban_user` | Bans or unbans a user |

Channels are detected automatically when you add the bot as admin. Posts are rate-limited per chat to respect Telegram limits.

## Pricing

| Plan | Price | Limits |
|---|---|---|
| Free | 0 | 1 channel, 5 posts/day, 3 scheduled posts |
| Pro | ~9 €/month | 5 channels, unlimited posts and scheduling |
| Agency | ~29 €/month | Unlimited channels |

Paid in Telegram Stars inside the bot. Early access is free: [message me](https://t.me/jeremstyke?direct).

## Privacy

The connector only acts on channels and groups where you made the bot an admin. It never accesses your personal Telegram account or private messages.

---

by [@jeremstyke](https://t.me/jeremstyke)
