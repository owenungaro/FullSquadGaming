// grab all the elements we need
const loadBtn        = document.getElementById('load');
const guildInput     = document.getElementById('guild');
const usersSelect    = document.getElementById('users');
const step2Div       = document.getElementById('step2');
const step3Div       = document.getElementById('step3');
const chooseRandomBt = document.getElementById('chooseRandom');
const resultDiv      = document.getElementById('result');
const selectedSpan   = document.getElementById('selectedUser');
const confirmBt      = document.getElementById('confirmBtn');

loadBtn.onclick = async () => {
  const guildId = guildInput.value.trim();
  if (!guildId) return alert('Please enter a guild ID');

  try {
    const res   = await fetch(`https://fullsquad-bot.fly.dev/api/users/${guildId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const users = await res.json();

    usersSelect.innerHTML = '';
    users.forEach(u => {
      const opt = document.createElement('option');
      opt.value       = u.id;
      opt.textContent = u.name;
      usersSelect.appendChild(opt);
    });

    step2Div.style.display = 'none';
    step3Div.style.display = 'none';
    resultDiv.style.display = 'none';
    chooseRandomBt.disabled = true;
    confirmBt.disabled     = true;

  } catch (e) {
    alert('Error loading users: ' + e.message);
  }
};

usersSelect.addEventListener('change', () => {
  const count = Array.from(usersSelect.selectedOptions)
                     .filter(o => o.value).length;

  if (count >= 3) {
    step2Div.style.display = '';
    step3Div.style.display = '';
    chooseRandomBt.disabled = false;
  } else {
    // hide everything downstream
    step2Div.style.display = 'none';
    step3Div.style.display = 'none';
    resultDiv.style.display = 'none';
    chooseRandomBt.disabled = true;
    confirmBt.disabled     = true;
  }
});

chooseRandomBt.onclick = () => {
  const chosenOpts = Array.from(usersSelect.selectedOptions)
                           .filter(o => o.value);
  if (chosenOpts.length < 3) {
    return alert('Select at least 3 users to continue');
  }

  const randomOpt = chosenOpts[Math.floor(Math.random() * chosenOpts.length)];
  selectedSpan.textContent = randomOpt.textContent;

  resultDiv.style.display = '';
  confirmBt.disabled = false;
};

confirmBt.onclick = () => {

};
