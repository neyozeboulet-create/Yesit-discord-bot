# Yesit — Discord Bot + Dashboard Pro

Bot Discord professionnel + Dashboard de gestion — 61 commandes, logs persistants, configuration temps réel.

## Stack
`discord.js 14`, `Express 4`, `SQLite`, `helmet`, `rate-limit`, `Lucide Icons`

## Architecture
```
src/
  bot/
    index.js          → client, handler, events, logs
    deploy-commands.js→ déploiement guild (61 cmds)
    commands/         → 61 fichiers (mod/util/admin/fun/level/ticket/giveaway/secu)
    utils/            → embeds, permissions, time
  database/
    db.js             → SQLite + migrations + logs/warns/giveaways
  dashboard/
    server.js         → API sécurisée + pages
    public/
      index.html      → landing
      dashboard.html  → sélecteur serveurs
      server.html     → gestion serveur (sidebar, overview, logs, config)
      commands.html   → doc auto-générée
      css/main.css    → design system sombre
```

## Commandes (61)
- **Modération (14)**: ban, unban, kick, timeout, untimeout, warn, unwarn, warnings, clear, slowmode, lock, unlock, nick, softban
- **Utilitaire (14)**: avatar, banner, userinfo, serverinfo, roleinfo, channelinfo, membercount, poll, embed, say, remind, afk, invite, botinfo
- **Admin (7)**: setlog, setwelcome, setgoodbye, setautorole, setautomod, settickets, setlevel
- **Fun (8)**: 8ball, coinflip, roll, choose, rps, rate, ship, trivia
- **Niveaux (4)**: leaderboard, profile, rep, + rank/economy existants
- **Giveaway (3)**: gstart, gend, greroll
- **Tickets (3)**: ticketclose, ticketadd, ticketremove (+ ticket setup)
- **Sécurité (3)**: lockdown, antinuke, verify
+ 5 legacy (economy, mod, rank, ticket, fun, config)

Toutes avec permissions Discord vérifiées côté serveur, embeds pros, validation, logs.

## Dashboard
- **/** — landing avec stats live, features, commandes populaires
- **/dashboard** — grille serveurs (icône, nom, membres, salons) + recherche
- **/server/:id** — sidebar (overview, logs, membres, welcome, modération, automod, tickets, niveaux, sécurité, commandes)
  - Overview: KPIs, graphique par type, événements récents, uptime
  - Logs: recherche, filtre type/user/date, pagination, timestamps
  - Config: PUT /api/guild/:id/config avec validation + rate-limit
- **/commands** — doc interactive filtrable

Design : sombre cohérent, Lucide icons (pas d'emojis), responsive, skeletons, toasts, empty states.

## API
- `GET /api/stats`, `/api/bot/guilds`, `/api/bot/invite`
- `GET /api/guild/:id/overview`, `/api/guild/:id/logs`, `/api/guild/:id/members`, `/api/guild/:id/config`
- `PUT /api/guild/:id/config` (whitelist + validation)
- `GET /api/commands` (généré depuis le code)

Sécurité: helmet, rate-limit 120/min sur /api, validation guild_id regex, permissions côté bot, pas de token exposé frontend.

## Lancer
```bash
npm install
# .env: DISCORD_TOKEN, CLIENT_ID, GUILD_ID, DASHBOARD_PORT
npm run deploy   # 61 cmds guild
npm run dev      # bot + dashboard
# dashboard http://localhost:3000
```

Bot : Yesit#6520 sur Neyo Community (1309964414899720253)
