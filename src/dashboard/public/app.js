async function loadStats(){
  const r = await fetch('/api/stats'); const d = await r.json();
  document.getElementById('stats').innerHTML = `
    <div class="stat"><b>${d.totalUsers}</b><br>Utilisateurs</div>
    <div class="stat"><b>${d.totalTickets}</b><br>Tickets</div>
    <div class="stat"><b>${d.guilds.length}</b><br>Serveurs</div>`;
}
loadStats();

let currentGuild = null;
async function loadGuild(){
  const id = document.getElementById('guildId').value.trim();
  if(!id) return alert('Guild ID requis');
  currentGuild = id;
  const r = await fetch(`/api/guild/${id}`); const d = await r.json();
  document.getElementById('guildInfo').innerHTML = `
    <p>Welcome: ${d.config.welcome_channel||'—'} | Logs: ${d.config.log_channel||'—'} | AutoMod: ${d.config.auto_mod?'ON':'OFF'} | XP: ${d.config.xp_enabled?'ON':'OFF'}</p>
    <label><input type="checkbox" id="xpToggle" ${d.config.xp_enabled?'checked':''}> XP activé</label>
    <label><input type="checkbox" id="modToggle" ${d.config.auto_mod?'checked':''}> AutoMod</label>
    <button onclick="saveConfig()">Sauvegarder</button>
    <p>Tickets récents: ${d.tickets.length}</p>
  `;
  document.getElementById('shopCard').style.display='block';
  document.getElementById('usersCard').style.display='block';
  document.getElementById('shopList').innerHTML = d.shop.map(s=> `<li>${s.name} - ${s.price} coins <button onclick="delShop(${s.id})">✕</button></li>`).join('') || '<li>Shop vide</li>';
  document.querySelector('#usersTable tbody').innerHTML = d.users.map(u=> `<tr><td>${u.id}</td><td>${u.coins}</td><td>${u.xp}</td><td>${u.level}</td></tr>`).join('');
}

async function saveConfig(){
  const xp = document.getElementById('xpToggle').checked;
  const am = document.getElementById('modToggle').checked;
  await fetch(`/api/guild/${currentGuild}/config`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ xp_enabled: xp, auto_mod: am }) });
  alert('✅ Sauvegardé');
}

async function addShop(){
  const name=document.getElementById('shopName').value;
  const price=parseInt(document.getElementById('shopPrice').value);
  const role=document.getElementById('shopRole').value;
  if(!name||!price) return alert('Nom + prix requis');
  await fetch(`/api/guild/${currentGuild}/shop`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, price, role_id: role||null }) });
  loadGuild();
}

async function delShop(id){
  await fetch(`/api/shop/${id}`, { method:'DELETE' });
  loadGuild();
}
