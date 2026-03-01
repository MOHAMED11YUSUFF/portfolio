//================== LOAD PERSONAL INFO FROM about.xlsx ==================//
function loadPersonalInfo() {
    const personalInfoDiv = document.getElementById('personal-info');
    const filePath = 'about.json';

    console.log("portfolio.js loaded (about.json)");

    fetch(filePath)
        .then(res => res.json())
        .then(data => {
            personalInfoDiv.innerHTML = ""; // clear existing content

            Object.entries(data).forEach(([key, value]) => {
                const p = document.createElement('p');

                // Capitalize key nicely
                const label = key.charAt(0).toUpperCase() + key.slice(1);

                p.innerHTML = `<strong>${label}:</strong> ${value}`;
                personalInfoDiv.appendChild(p);
            });
        })
        .catch(err => console.error('Error loading personal info:', err));
}

//================== LOAD ABOUT TEXT FROM about.txt ==================//
function loadAboutText() {
    const aboutContent = document.getElementById('about-content');
    fetch('about.txt')
        .then(res => res.text())
        .then(text => {
            // Replace newlines with <br> for proper display
            aboutContent.innerHTML = text.replace(/\n/g, '<br>');
        })
        .catch(err => console.error('Error loading about text:', err));
}



if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEducation);
} else {
    loadEducation();
}

function loadEducation() {
    const container = document.getElementById('education-content');
    if (!container) return;

    fetch('./education.json')
        .then(res => res.json())
        .then(data => {
            container.innerHTML = '';

            data.forEach(blockData => {
                const card = document.createElement('div');
                card.className = 'edu-card';

                // LEFT: text content
                const textDiv = document.createElement('div');
                textDiv.className = 'edu-text';

                Object.entries(blockData).forEach(([key, value]) => {
                    if (!value) return;
                    if (key.toLowerCase() === 'image') return;

                    const row = document.createElement('div');
                    row.className = 'edu-row';

                    row.innerHTML = `
                        <span class="edu-key">${formatKey(key)}</span>
                        <span class="edu-value">${value}</span>
                    `;

                    textDiv.appendChild(row);
                });

                // RIGHT: image
                const imgDiv = document.createElement('div');
                imgDiv.className = 'edu-image';

                if (blockData.image) {
                    const img = document.createElement('img');
                    img.src = blockData.image;
                    img.alt = 'Institute Image';
                    imgDiv.appendChild(img);
                }

                card.appendChild(textDiv);
                card.appendChild(imgDiv);
                container.appendChild(card);
            });
        })
        .catch(err => console.error('Education JSON error:', err));
}

function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) + ':';
}

// =================== LOAD SKILLS (BLACK & WHITE) ===================
async function renderSkillsBW(jsonPath = "skills.json", containerId = "skills-container") {
    try {
        const res = await fetch(jsonPath);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const skillsData = await res.json();

        const container = document.getElementById(containerId);
        if (!container) return console.warn("Skills container not found");
        container.innerHTML = "";

        Object.entries(skillsData).forEach(([category, skills]) => {
            const card = document.createElement("div");
            card.className = "skill-card-bw";

            const title = document.createElement("h3");
            title.textContent = formatTitle(category);

            const list = document.createElement("div");
            list.className = "skill-list-bw";

            skills.forEach(skill => {
                const chip = document.createElement("span");
                chip.className = "skill-chip-bw";
                chip.textContent = skill;
                list.appendChild(chip);
            });

            card.appendChild(title);
            card.appendChild(list);
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Failed to load skills:", err);
    }
}

// Helper function
function formatTitle(text) {
    return text
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Call the function (you can integrate with your existing DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
    renderSkillsBW(); // loads "skills.json" into "skills-container"
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWorkExperience);
} else {
    loadWorkExperience();
}

function loadWorkExperience() {
    const container = document.getElementById('workexperience');
    if (!container) return;

    fetch('./work.json')
        .then(res => res.json())
        .then(data => {
            // Clear existing content except <h2>
            container.querySelectorAll('.edu-card').forEach(el => el.remove());

            data.forEach(blockData => {
                const card = document.createElement('div');
                card.className = 'edu-card'; // reuse education card styles

                // LEFT: text content
                const textDiv = document.createElement('div');
                textDiv.className = 'edu-text';

                Object.entries(blockData).forEach(([key, value]) => {
                    if (!value) return;
                    if (key.toLowerCase() === 'image') return;

                    const row = document.createElement('div');
                    row.className = 'edu-row';

                    row.innerHTML = `
                        <span class="edu-key">${formatKey(key)}</span>
                        <span class="edu-value">${value}</span>
                    `;

                    textDiv.appendChild(row);
                });

                // RIGHT: image
                const imgDiv = document.createElement('div');
                imgDiv.className = 'edu-image';

                if (blockData.image) {
                    const img = document.createElement('img');
                    img.src = blockData.image;
                    img.alt = 'Company Logo';
                    imgDiv.appendChild(img);
                }

                card.appendChild(textDiv);
                card.appendChild(imgDiv);
                container.appendChild(card);
            });
        })
        .catch(err => console.error('Work JSON error:', err));
}

// Reuse your key formatting function
function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) + ':';
}




//================== INITIALIZE ==================//
document.addEventListener('DOMContentLoaded', () => {
    loadPersonalInfo();
    loadAboutText();
    loadEducation();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLeaderships);
} else {
    loadLeaderships();
}


function loadLeaderships() {
    const container = document.getElementById('leaderships');
    if (!container) return;

    // Remove only previous leadership cards — keep heading
    container.querySelectorAll('.executive-tile').forEach(el => el.remove());

    fetch('./leadership.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                const msg = document.createElement('p');
                msg.className = 'executive-empty';
                msg.textContent = 'No leadership entries available yet.';
                container.appendChild(msg);
                return;
            }

            data.forEach(item => {
                if (!item || typeof item !== 'object') return;

                const tile = document.createElement('div');
                tile.className = 'executive-tile';

                // Left: information block
                const infoBlock = document.createElement('div');
                infoBlock.className = 'executive-info';

                Object.entries(item).forEach(([key, value]) => {
                    if (!value && value !== 0) return;
                    if (['image', 'logo', 'photo', 'picture'].includes(key.toLowerCase())) return;

                    const line = document.createElement('div');
                    line.className = 'executive-line';

                    // Longer text fields get full width
                    const lower = key.toLowerCase();
                    if (lower.includes('description') ||
                        lower.includes('bio') ||
                        lower.includes('about') ||
                        lower.includes('responsibilit') ||
                        lower.includes('achiev') ||
                        lower.includes('contrib') ||
                        lower.includes('vision') ||
                        lower.includes('message')) {
                        line.classList.add('executive-wide');
                    }

                    line.innerHTML = `
                        <span class="executive-label">${formatKey(key)}</span>
                        <span class="executive-value">${value}</span>
                    `;

                    infoBlock.appendChild(line);
                });

                // Right: portrait / logo area
                const portraitArea = document.createElement('div');
                portraitArea.className = 'executive-portrait';

                const src = item.image || item.logo || item.photo || item.picture;
                if (src) {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = `${item.name || item.position || 'Leadership member'}`;
                    img.loading = 'lazy';
                    img.className = 'executive-photo';
                    img.onerror = () => {
                        img.src = 'https://via.placeholder.com/260x260?text=Photo';
                    };
                    portraitArea.appendChild(img);
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'executive-no-photo';
                    placeholder.textContent = 'No photo';
                    portraitArea.appendChild(placeholder);
                }

                // Assemble
                tile.appendChild(infoBlock);
                tile.appendChild(portraitArea);
                container.appendChild(tile);
            });

            // Optional: center last item if odd count (desktop only)
            const tiles = container.querySelectorAll('.executive-tile');
            if (tiles.length % 2 === 1 && window.innerWidth > 768) {
                const last = tiles[tiles.length - 1];
                last.style.gridColumn = '1 / -1';
                last.style.maxWidth = '720px';
                last.style.marginInline = 'auto';
            }
        })
        .catch(err => {
            console.error('Leadership fetch error:', err);
            const errMsg = document.createElement('p');
            errMsg.className = 'executive-error';
            errMsg.innerHTML = `Failed to load leadership data.<br>${err.message}`;
            container.appendChild(errMsg);
        });
}

// Keep your existing formatKey function
function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim() + ':';
}





if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHackathons);
} else {
    loadHackathons();
}

function loadHackathons() {
    const container = document.getElementById('hackathons');
    if (!container) return;

    // Only remove previous hackathon cards — keep the <h2> and any other static content
    container.querySelectorAll('.hack-card').forEach(el => el.remove());

    fetch('./hackathons.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            // Expecting { "hackathons": [ ... ] } structure
            const items = Array.isArray(data) ? data : (data.hackathons || []);

            if (items.length === 0) {
                const msg = document.createElement('p');
                msg.style.textAlign = 'center';
                msg.style.color = '#718096';
                msg.textContent = 'No hackathon participations added yet.';
                container.appendChild(msg);
                return;
            }

            items.forEach(item => {
                if (!item || typeof item !== 'object') return;

                const card = document.createElement('div');
                card.className = 'hack-card';

                // ── Main content wrapper ──
                const content = document.createElement('div');
                content.className = 'hack-content';

                // Name & Project Title (prominent)
                if (item.name || item.project_title) {
                    const header = document.createElement('div');
                    header.className = 'hack-header';

                    if (item.name) {
                        const hackName = document.createElement('h3');
                        hackName.className = 'hack-name';
                        hackName.textContent = item.name;
                        header.appendChild(hackName);
                    }

                    if (item.project_title) {
                        const projTitle = document.createElement('div');
                        projTitle.className = 'project-title';
                        projTitle.textContent = item.project_title;
                        header.appendChild(projTitle);
                    }

                    content.appendChild(header);
                }

                // Description (main body)
                if (item.description) {
                    const desc = document.createElement('div');
                    desc.className = 'hack-description';
                    desc.innerHTML = item.description.replace(/\n/g, '<br>'); // preserve line breaks
                    content.appendChild(desc);
                }

                // Metadata row (year, role, prize, technologies, etc.) – if you add them later
                const meta = document.createElement('div');
                meta.className = 'hack-meta';

                // Example fields you can add to JSON later
                ['year', 'role', 'achievement', 'technologies', 'team_size'].forEach(key => {
                    if (item[key]) {
                        const span = document.createElement('span');
                        span.className = 'hack-meta-item';
                        span.innerHTML = `<strong>${formatKeyShort(key)}</strong> ${item[key]}`;
                        meta.appendChild(span);
                    }
                });

                if (meta.children.length > 0) {
                    content.appendChild(meta);
                }

                // Reference / Devpost link
                if (item.reference || item.link || item.devpost) {
                    const link = document.createElement('a');
                    link.className = 'hack-link';
                    link.href = item.reference || item.link || item.devpost;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = 'View on Devpost →';
                    content.appendChild(link);
                }

                card.appendChild(content);

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error loading hackathons:', err);
            const errMsg = document.createElement('p');
            errMsg.style.color = '#e53e3e';
            errMsg.style.textAlign = 'center';
            errMsg.textContent = 'Could not load hackathons.';
            container.appendChild(errMsg);
        });
}

function formatKeyShort(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim() + ':';
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMiniProjects);
} else {
    loadMiniProjects();
}

function loadMiniProjects() {
    const container = document.getElementById('miniprojects');
    if (!container) return;

    // Only remove previous mini-project cards — preserve <h2> and static content
    container.querySelectorAll('.mini-card').forEach(el => el.remove());

    fetch('./projects.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            // Support both flat array and { "mini_projects": [...] } format
            const items = Array.isArray(data) ? data : (data.mini_projects || []);

            if (items.length === 0) {
                const msg = document.createElement('p');
                msg.style.textAlign = 'center';
                msg.style.color = '#718096';
                msg.textContent = 'No mini projects added yet.';
                container.appendChild(msg);
                return;
            }

            items.forEach(item => {
                if (!item || typeof item !== 'object') return;

                const card = document.createElement('div');
                card.className = 'mini-card';

                // ── Main content wrapper ──
                const content = document.createElement('div');
                content.className = 'mini-content';

                // Project Name (title)
                if (item.name || item.title || item.project_name) {
                    const nameEl = document.createElement('h3');
                    nameEl.className = 'mini-name';
                    nameEl.textContent = item.name || item.title || item.project_name;
                    content.appendChild(nameEl);
                }

                // Description
                if (item.description) {
                    const desc = document.createElement('div');
                    desc.className = 'mini-description';
                    desc.innerHTML = item.description.replace(/\n/g, '<br>');
                    content.appendChild(desc);
                }

                // Optional metadata row (you can extend JSON later)
                const meta = document.createElement('div');
                meta.className = 'mini-meta';

                ['tech', 'technologies', 'stack', 'year', 'duration', 'role'].forEach(key => {
                    if (item[key]) {
                        const span = document.createElement('span');
                        span.className = 'mini-meta-item';
                        span.innerHTML = `<strong>${formatKeyShort(key)}</strong> ${item[key]}`;
                        meta.appendChild(span);
                    }
                });

                if (meta.children.length > 0) {
                    content.appendChild(meta);
                }

                // Reference / GitHub link
                if (item.reference || item.github || item.link || item.repo) {
                    const link = document.createElement('a');
                    link.className = 'mini-link';
                    link.href = item.reference || item.github || item.link || item.repo;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.innerHTML = 'View on GitHub →';
                    content.appendChild(link);
                }

                card.appendChild(content);
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error loading mini projects:', err);
            const errMsg = document.createElement('p');
            errMsg.style.color = '#e53e3e';
            errMsg.style.textAlign = 'center';
            errMsg.textContent = 'Could not load mini projects.';
            container.appendChild(errMsg);
        });
}

function formatKeyShort(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim() + ':';
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPatents);
} else {
    loadPatents();
}

function loadPatents() {
    const container = document.getElementById('researchpapers');
    if (!container) return;

    // Only remove previous patent cards — keep <h2> and any static content
    container.querySelectorAll('.patent-card').forEach(el => el.remove());

    fetch('./research.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            // Support both flat array and { "patents": [...] } structure
            const items = Array.isArray(data) ? data : (data.patents || []);

            if (items.length === 0) {
                const msg = document.createElement('p');
                msg.style.textAlign = 'center';
                msg.style.color = '#718096';
                msg.textContent = 'No patents or publications added yet.';
                container.appendChild(msg);
                return;
            }

            items.forEach(item => {
                if (!item || typeof item !== 'object') return;

                const card = document.createElement('div');
                card.className = 'patent-card';

                // ── Main content wrapper ──
                const content = document.createElement('div');
                content.className = 'patent-content';

                // Patent Title (prominent)
                if (item.title || item.name) {
                    const titleEl = document.createElement('h3');
                    titleEl.className = 'patent-title';
                    titleEl.textContent = item.title || item.name;
                    content.appendChild(titleEl);
                }

                // Application Number / ID
                if (item.application_number || item.patent_number || item.id) {
                    const appNum = document.createElement('div');
                    appNum.className = 'patent-app-number';
                    appNum.innerHTML = `<strong>Application No.:</strong> ${item.application_number || item.patent_number || item.id}`;
                    content.appendChild(appNum);
                }

                // Description
                if (item.description) {
                    const desc = document.createElement('div');
                    desc.className = 'patent-description';
                    desc.innerHTML = item.description.replace(/\n/g, '<br>');
                    content.appendChild(desc);
                }

                // Optional metadata (extend JSON later: status, filing_date, inventors, etc.)
                const meta = document.createElement('div');
                meta.className = 'patent-meta';

                ['status', 'filing_date', 'publication_date', 'inventors', 'assignee'].forEach(key => {
                    if (item[key]) {
                        const span = document.createElement('span');
                        span.className = 'patent-meta-item';
                        span.innerHTML = `<strong>${formatKeyShort(key)}</strong> ${item[key]}`;
                        meta.appendChild(span);
                    }
                });

                if (meta.children.length > 0) {
                    content.appendChild(meta);
                }

                // Optional reference / link (if added to JSON later)
                if (item.reference || item.link || item.google_patent || item.ipindia_link) {
                    const link = document.createElement('a');
                    link.className = 'patent-link';
                    link.href = item.reference || item.link || item.google_patent || item.ipindia_link;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.innerHTML = 'View Patent Details →';
                    content.appendChild(link);
                }

                card.appendChild(content);
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error loading patents:', err);
            const errMsg = document.createElement('p');
            errMsg.style.color = '#e53e3e';
            errMsg.style.textAlign = 'center';
            errMsg.textContent = 'Could not load patent information.';
            container.appendChild(errMsg);
        });
}

function formatKeyShort(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim() + ':';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAchievements);
} else {
    loadAchievements();
}

function loadAchievements() {
    const container = document.getElementById('achievements');
    if (!container) return;

    // Only remove previous achievement cards — keep <h2> and static content
    container.querySelectorAll('.achievement-card').forEach(el => el.remove());

    fetch('./achievement.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const achievements = data.achievements || {};
            const contests = achievements.contests || [];
            const certifications = achievements.certifications || [];

            if (contests.length === 0 && certifications.length === 0) {
                const msg = document.createElement('p');
                msg.style.textAlign = 'center';
                msg.style.color = '#718096';
                msg.textContent = 'No achievements added yet.';
                container.appendChild(msg);
                return;
            }

            // ── Contests subsection ──
            if (contests.length > 0) {
                const contestWrapper = document.createElement('div');
                contestWrapper.className = 'achievement-group';
                contestWrapper.innerHTML = '<h3 class="group-title">Contests & Competitions</h3>';

                contests.forEach(item => {
                    const card = createAchievementCard(item, 'contest');
                    contestWrapper.appendChild(card);
                });

                container.appendChild(contestWrapper);
            }

            // ── Certifications subsection ──
            if (certifications.length > 0) {
                const certWrapper = document.createElement('div');
                certWrapper.className = 'achievement-group';
                certWrapper.innerHTML = '<h3 class="group-title">Certifications</h3>';

                certifications.forEach(item => {
                    const card = createCertificationCard(item);
                    certWrapper.appendChild(card);
                });

                container.appendChild(certWrapper);
            }
        })
        .catch(err => {
            console.error('Error loading achievements:', err);
            const errMsg = document.createElement('p');
            errMsg.style.color = '#e53e3e';
            errMsg.style.textAlign = 'center';
            errMsg.textContent = 'Could not load achievements.';
            container.appendChild(errMsg);
        });
}

function createAchievementCard(item, type = 'contest') {
    const card = document.createElement('div');
    card.className = `achievement-card ${type}`;

    const content = document.createElement('div');
    content.className = 'ach-content';

    // Title / Contest name
    const title = document.createElement('h4');
    title.className = 'ach-title';
    title.textContent = item.title || item.name || 'Untitled Achievement';
    content.appendChild(title);

    // Position / Rank
    if (item.position) {
        const pos = document.createElement('div');
        pos.className = 'ach-position';
        pos.textContent = item.position;
        content.appendChild(pos);
    }

    // Year (if present)
    if (item.year) {
        const yearEl = document.createElement('div');
        yearEl.className = 'ach-year';
        yearEl.textContent = item.year;
        content.appendChild(yearEl);
    }

    card.appendChild(content);
    return card;
}

function createCertificationCard(item) {
    const card = document.createElement('div');
    card.className = 'achievement-card certification';

    const content = document.createElement('div');
    content.className = 'ach-content';

    // Platform name
    const platform = document.createElement('div');
    platform.className = 'ach-platform';
    platform.textContent = item.platform || 'Certification';
    content.appendChild(platform);

    // Main certification name
    const name = document.createElement('h4');
    name.className = 'ach-title';
    name.textContent = item.certification || item.name || '';

    // Handle array of certifications (like HackerRank)
    if (Array.isArray(item.certifications)) {
        name.textContent = item.certifications.join(' • ');
    }
    content.appendChild(name);

    // Level / Badge (e.g. Silver Medal)
    if (item.level) {
        const level = document.createElement('div');
        level.className = 'ach-level';
        level.textContent = item.level;
        content.appendChild(level);
    }

    card.appendChild(content);
    return card;
}