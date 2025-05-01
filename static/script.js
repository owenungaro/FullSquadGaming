const loadBtn = document.getElementById('load');
const guildInput = document.getElementById('guild');
const usersSelect = document.getElementById('users');
const step2Div = document.getElementById('step2');
const step3Div = document.getElementById('step3');
const chooseRandomBtn = document.getElementById('chooseRandom');
const resultDiv = document.getElementById('result');
const selectedSpan = document.getElementById('selectedUser');
const confirmBtn = document.getElementById('confirmBtn');

let selectedUserId = null;

//1: Load users
loadBtn.onclick = async function() {
    const guildId = guildInput.value.trim();

    if(!guildId) {
        alert('Please enter a guild ID');
        return;
    }

    try {
        const response = await fetch(
            `https://fullsquad-bot.fly.dev/api/users/${guildId}`
        );

        if(!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const users = await response.json();
        usersSelect.innerHTML = '';

        for(let u of users) {
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = u.name;
            usersSelect.appendChild(option);
        }

        step2Div.style.display = 'none';
        step3Div.style.display = 'none';
        resultDiv.style.display = 'none';
        chooseRandomBtn.disabled = true;
        confirmBtn.disabled = true;

    } catch(err) {
        alert('Error loading users: ' + err.message);
    }
};

//2: Show next steps once at least 3 are selected
usersSelect.addEventListener('change', function() {
    const count = usersSelect.selectedOptions.length;

    if(count >= 3) {
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
});

//3: Choose a random user
chooseRandomBtn.onclick = function() {
    const options = Array.from(usersSelect.selectedOptions);
    const randomIndex = Math.floor(Math.random() * options.length);
    const chosen = options[randomIndex];

    selectedUserId = chosen.value;
    selectedSpan.textContent = chosen.textContent;

    resultDiv.style.display = '';
    confirmBtn.disabled = false;
};

//4: Send prompts
confirmBtn.onclick = async function() {
    if(!selectedUserId) {
        alert('No user chosen!');
        return;
    }

    const promptA = document.getElementById('input1').value.trim();
    const promptB = document.getElementById('input2').value.trim();
    const userIds = Array
        .from(usersSelect.selectedOptions)
        .map(opt => opt.value);

    const payload = {
        guild_id: guildInput.value.trim(),
        user_ids: userIds,
        selected_user: selectedUserId,
        promptA: promptA,
        promptB: promptB
    };

    try {
        const response = await fetch(
            'https://fullsquad-bot.fly.dev/api/message',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        if(!response.ok) {
            throw new Error(result.detail || response.statusText);
        }

        alert(result.detail);

    } catch(err) {
        alert('Failed to send messages: ' + err.message);
    }
};
