const loadBtn = document.getElementById('load');
const guildInput = document.getElementById('guild');
const usersContainer = document.getElementById('users');
const step2Div = document.getElementById('step2');
const step3Div = document.getElementById('step3');
const chooseRandomBtn = document.getElementById('chooseRandom');
const resultDiv = document.getElementById('result');
const selectedSpan = document.getElementById('selectedUser');
const confirmBtn = document.getElementById('confirmBtn');

let selectedUserId = null;

// 1: Load users
loadBtn.onclick = async function () {
  const guildId = guildInput.value.trim();

  if (!guildId) {
    alert('Please enter a guild ID');
    return;
  }

  try {
    const response = await fetch(`https://fullsquad-bot.fly.dev/api/users/${guildId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const users = await response.json();
    usersContainer.innerHTML = '';
    selectedUserId = null;

    // Render Discord-style user entries
    for (let u of users) {
      const div = document.createElement('div');
      div.className = 'user-entry';
      div.dataset.id = u.id;

      const avatar = document.createElement('div');
      avatar.className = 'avatar';

      const name = document.createElement('span');
      name.className = 'username';
      name.textContent = u.name;

      div.appendChild(avatar);
      div.appendChild(name);
      usersContainer.appendChild(div);

      // Toggle selection on click
      div.onclick = function () {
        div.classList.toggle('selected');

        const selected = document.querySelectorAll('.user-entry.selected');

        if (selected.length >= 3) {
          step2Div.style.display = '';
          step3Div.style.display = '';
          chooseRandomBtn.disabled = false;
        } else {
          step2Div.style.display = 'none';
          step3Div.style.display = 'none';
          resultDiv.style.display = 'none';
          chooseRandomBtn.disabled = true;
          confirmBtn.disabled = true;
        }
      };
    }

    step2Div.style.display = 'none';
    step3Div.style.display = 'none';
    resultDiv.style.display = 'none';
    chooseRandomBtn.disabled = true;
    confirmBtn.disabled = true;

  } catch (err) {
    alert('Error loading users: ' + err.message);
  }
};

// 2: Choose a random user
chooseRandomBtn.onclick = function () {
  const options = Array.from(document.querySelectorAll('.user-entry.selected'));
  if (options.length === 0) return;

  const randomIndex = Math.floor(Math.random() * options.length);
  const chosen = options[randomIndex];

  selectedUserId = chosen.dataset.id;
  selectedSpan.textContent = chosen.querySelector('.username').textContent;

  resultDiv.style.display = '';
  confirmBtn.disabled = false;
};

// 3: Send prompts
confirmBtn.onclick = async function () {
  if (!selectedUserId) {
    alert('No user chosen!');
    return;
  }

  const promptA = document.getElementById('input1').value.trim();
  const promptB = document.getElementById('input2').value.trim();
  const userIds = Array.from(document.querySelectorAll('.user-entry.selected'))
    .map(el => el.dataset.id);

  const payload = {
    guild_id: guildInput.value.trim(),
    user_ids: userIds,
    selected_user: selectedUserId,
    promptA: promptA,
    promptB: promptB
  };

  try {
    const response = await fetch('https://fullsquad-bot.fly.dev/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || response.statusText);
    }

    alert(result.detail);

  } catch (err) {
    alert('Failed to send messages: ' + err.message);
  }
};
