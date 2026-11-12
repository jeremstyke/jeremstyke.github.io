# AI Connector for Telegram Channels & Groups

Manage your Telegram channels and groups from **Claude, ChatGPT and Gemini**. Just ask your AI to post, schedule, edit, pin or moderate.

🌐 Website: https://jeremstyke.github.io/tg-ai-connector/
🤖 Bot: [@Tgaiconnectorbot](https://t.me/Tgaiconnectorbot)

## How it works

1. Open [@Tgaiconnectorbot](https://t.me/Tgaiconnectorbot?start=src_github) and press **Start**: you get your personal connector URL and the setup steps for each AI.
2. Add **@Tgaiconnectorbot** as an admin of your channel or group (post, edit and delete rights).
3. Add your connector URL to your AI:
   - **Claude**: Settings > Connectors > Add custom connector
   - **ChatGPT** (paid plans): Settings > Apps > Advanced settings > Developer mode, then Create
   - **Gemini**: Settings > Connected Apps > Add a custom app, or Gemini CLI: `gemini mcp add --transport http telegram YOUR_URL`
4. Ask: *"Schedule a post on my channel tomorrow at 9am."*

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
| Pro | 450 Stars/month | 5 channels, unlimited posts and scheduling |
| Agency | 1500 Stars/month | Unlimited channels |

Paid in Telegram Stars inside the bot (/upgrade). Questions: [message me](https://t.me/jeremstyke?direct).

## Privacy

The connector only acts on channels and groups where you made the bot an admin. It never accesses your personal Telegram account or private messages.

---

by [@jeremstyke](https://t.me/jeremstyke)
