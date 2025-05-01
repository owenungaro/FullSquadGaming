document.getElementById("load").onclick = async () => {
  const guildId = document.getElementById("guild").value.trim();
  if (!guildId) {
    return alert("Please enter a guild ID");
  }

  try {
    // absolute URL to your live FastAPI endpoint
    const res = await fetch(`https://fullsquad-bot.fly.dev/api/users/${guildId}`);
    if (!res.ok) {
      throw new Error(`Status ${res.status}: ${await res.text()}`);
    }

    const users = await res.json();
    const sel   = document.getElementById("users");

    // clear old options
    sel.innerHTML = "";

    users.forEach(u => {
      const opt = document.createElement("option");
      opt.value       = u.id;
      opt.textContent = u.name;
      sel.appendChild(opt);
    });
  } catch (e) {
    alert("Error loading users: " + e.message);
  }
};
