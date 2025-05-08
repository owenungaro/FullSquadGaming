# FullSquadGaming

FullSquadGaming is a dual-component project consisting of a Discord bot and a connected web interface. Together, they allow for easy listing of users in a Discord server and the distribution of customized messages to those users via a browser-based dashboard.

This tool is ideal for community moderators, game teams, and event hosts who want to interact with their Discord audiences in a streamlined and user-friendly way.

## Overview

The platform includes:

1. **A Discord Bot and API Server**  
   A Python application using `discord.py` and `FastAPI`, responsible for fetching server members and sending direct messages.

2. **A Web Dashboard**  
   A frontend dashboard styled after Discord's UI, which allows users to load server members, filter them, choose a random recipient, and send tailored messages.

## Functionality

### Discord Bot and API Server

- Connects to Discord and initializes as a background task.
- Fetches all users from a server using the server's Guild ID.
- Sends two different messages: one to all selected users, and a unique message to one randomly chosen user.
- Exposes RESTful API endpoints using FastAPI.
- Configured for deployment using Docker and Fly.io.

### Web Dashboard

- Accessible interface styled like Discord's dark mode.
- Users input a Discord server's Guild ID to retrieve member data.
- Members are displayed with avatar images and full Discord tags.
- Search bar filters users by name in real-time.
- Users can select any number of members, and then randomly choose one as the "winner" or highlight recipient.
- Input fields allow definition of two messages: one for the selected user, one for the others.
- Final "Confirm" button sends the appropriate message to each recipient.

## API Endpoints

### `GET /api/users/{guild_id}`

Returns a list of users in the specified Discord server.

**Path Parameter:**
- `guild_id`: The numeric ID of the Discord server.

**Response Format:**

```json
[
  {
    "id": "123456789012345678",
    "name": "User#1234",
    "avatar_url": "https://cdn.discordapp.com/avatars/..."
  },
  ...
]
```

### `POST /api/message`

Sends customized messages to a list of users.

**Request Body:**

```json
{
  "guild_id": 123456789012345678,
  "user_ids": ["111", "222", "333"],
  "selected_user": "222",
  "promptA": "Thanks for joining!",
  "promptB": "Congrats! You've been selected!"
}
```

**Behavior:**

- All listed `user_ids` receive `promptA`
- The `selected_user` receives `promptB` instead

**Response:**

```json
{ "detail": "Messages sent" }
```

## User Interface Details

The dashboard consists of the following components:

### Sidebar

- **Server ID Field**: Pre-filled with a default Guild ID; editable by the user.
- **Load Users Button**: Triggers a fetch to retrieve users from the specified server.

### User Section

- Displays user avatars, usernames, and tags.
- Click to select; selected entries are highlighted.
- When at least 3 users are selected, message input and action panels become visible.

### Search Bar

- Filters displayed users in real-time based on their names.

### Input Fields

- Two fields for custom messages:
  - Input 1: Sent to all selected users.
  - Input 2: Sent only to the randomly chosen user.

### Action Panel

- **Choose Random User**: Enabled after 3+ users are selected.
- Randomly picks one of the selected users and displays their name.

### Result Panel

- Shows the selected user's name and a "Confirm" button to send messages.

## Deployment

This project is designed to run both locally and in the cloud using [Fly.io](https://fly.io).

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set your Discord token as an environment variable
export DISCORD_TOKEN=your_discord_token_here

# Run the server
python bot.py
```

The server will launch at `http://localhost:8000` and the bot will connect to Discord.

### Fly.io Deployment

1. Ensure you have [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) installed.
2. Authenticate and set your bot token via secrets:

```bash
flyctl secrets set DISCORD_TOKEN=your_discord_token_here
```

3. Deploy:

```bash
flyctl deploy --remote-only -a fullsquad-bot
```

4. Check logs:

```bash
flyctl logs -a fullsquad-bot --no-tail
```

## Environment Variables

| Variable         | Required | Description                      |
|------------------|----------|----------------------------------|
| `DISCORD_TOKEN`  | Yes      | Discord bot token (must have the `members` intent enabled) |

## Technologies Used

**Backend:**
- Python 3.11
- discord.py
- FastAPI
- Uvicorn

**Frontend:**
- HTML, CSS (Discord-themed), and Vanilla JavaScript
- No frameworks or build tools required

**Hosting:**
- Docker
- Fly.io

## Future Improvements

- Authentication and role-based access for dashboard users
- Multi-server management interface
- Message scheduling or logging
- Enhanced error handling in frontend and API

## License

This project is licensed under the MIT License.

## Author

Created and maintained by Owen Ungaro. For questions or feedback, please visit [github.com/owenungaro](https://github.com/owenungaro).

## Important Notes

In order for the dashboard and API to function properly:

- The bot **must already be a member** of the Discord server you're trying to access.
- You will need to provide the correct `guild_id` (server ID) that matches a server the bot is currently in.
- The bot must have permission to view server members and send direct messages.

### Bot Invite Link

To add the bot to your server, use the following invite URL:

[Invite FullSquad Bot](https://discord.com/oauth2/authorize?client_id=1367285712545910858&scope=bot%20applications.commands&permissions=8)
