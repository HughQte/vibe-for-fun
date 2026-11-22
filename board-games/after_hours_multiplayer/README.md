# After Hours 18+ — Realtime Multiplayer

A responsive browser-based party card game. Every player joins **the same room** on their own phone/computer. The server synchronizes player order, face-down cards, live reveals and turn changes. No app installation or database required.

## Run on a computer

Install [Node.js](https://nodejs.org/) version 18 or higher, open Terminal in this folder, then run:

```bash
npm start
```

Visit **http://localhost:3000** to create a room. There are **no npm dependencies** to install.

## Let friends join from their own devices

**Over the public internet (recommended):** deploy the folder to a Node-compatible hosting service (for example, Render), then share the live site URL or the in-game invite link. Example Render web service settings:

- Runtime: Node
- Build command: `echo Ready`
- Start command: `npm start`
- Port: provided automatically by host through `PORT`

You can place this folder in a GitHub repository and connect the repository to the hosting service. Hosting fees and sleeping/idle behavior depend on the provider plan.

**Same home Wi-Fi:** find the hosting computer's LAN IP and visit `http://COMPUTER_IP:3000` from each phone on the same network. The computer and server must remain running. Open the firewall port if prompted. `localhost` only works on the hosting computer itself.

## How to play

1. Host enters their name and presses **Create Room**.
2. Host copies the invitation link and shares it with friends.
3. Each friend opens the link, enters their own name and presses **Join Room**.
4. Players appear in the order they join. Host chooses Spicy/Wild and starts.
5. **Only the active player** can reveal the face-down card. Everyone sees the same revealed card immediately.
6. Active player reveals and presses **Next Player**. They can skip. Host can also skip a card if someone disconnects.
7. Host can return to the lobby for another shuffled round with the same players.

## Customize

In the lobby, host selects **Add a card**, sets category and intensity, and saves it to the room's deck. Custom cards remain in the room for rematches, but are **not persisted across server restarts**.

## Important limitations

- The app is **multiplayer only when the Node server is running**. Opening `index.html` directly will not sync anything.
- Rooms are held **in server memory**, with a 24-hour expiry. Server restarts reset rooms and custom cards.
- Player sessions persist in each browser's local storage, so refreshing generally rejoins. Using the same browser profile for multiple participants will reuse the same session; use different devices or separate private profiles for testing.
- No account system; invite links are effectively room invitations. Share only with your intended group.
- Age 18+; all challenges consensual, with skips and nonalcoholic choices. No drinking is required.
- One web server process only; do not deploy in a multi-instance environment without shared storage/pub-sub.

## 🎮 Play After Hours Multiplayer

[Play the game online](https://vibe-for-fun.onrender.com)
