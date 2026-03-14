// members.js - Fetch and display member data with grid/list view toggle

let members = [];
let currentView = 'grid';

document.addEventListener('DOMContentLoaded', async function() {
  // Load members from JSON file
  await loadMembers();

  // Set up view toggle buttons
  setupViewToggle();

  // Display members in grid view by default
  displayMembers('grid');
});

/**
 * Fetch members data from JSON file
 */
async function loadMembers() {
  try {
    const response = await fetch('data/members.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    members = await response.json();
    console.log('Members loaded successfully:', members);
  } catch (error) {
    console.error('Error loading members:', error);
    const memberDirectory = document.getElementById('member-directory');
    memberDirectory.innerHTML = '<p>Error loading members. Please try again later.</p>';
  }
}

/**
 * Set up view toggle button event listeners
 */
function setupViewToggle() {
  const gridViewBtn = document.getElementById('grid-view');
  const listViewBtn = document.getElementById('list-view');

  gridViewBtn.addEventListener('click', function() {
    displayMembers('grid');
    updateToggleButtons('grid');
  });

  listViewBtn.addEventListener('click', function() {
    displayMembers('list');
    updateToggleButtons('list');
  });
}

/**
 * Update the active state of view toggle buttons
 */
function updateToggleButtons(view) {
  const gridViewBtn = document.getElementById('grid-view');
  const listViewBtn = document.getElementById('list-view');

  if (view === 'grid') {
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
  } else {
    gridViewBtn.classList.remove('active');
    listViewBtn.classList.add('active');
  }
}

/**
 * Display members in either grid or list view
 */
function displayMembers(view) {
  const memberDirectory = document.getElementById('member-directory');
  currentView = view;

  // Clear existing content
  memberDirectory.innerHTML = '';

  // Update container class
  memberDirectory.classList.remove('member-grid', 'member-list');
  memberDirectory.classList.add(view === 'grid' ? 'member-grid' : 'member-list');

  // Create member cards
  members.forEach(member => {
    const memberCard = createMemberCard(member);
    memberDirectory.appendChild(memberCard);
  });
}

/**
 * Create a member card element
 */
function createMemberCard(member) {
  const card = document.createElement('div');
  card.className = 'member-card';

  // Get membership level badge
  const badgeClass = getMembershipBadge(member.membershipLevel);
  const badgeText = getMembershipText(member.membershipLevel);

  // Create card HTML
  card.innerHTML = `
    <img src="images/${member.image}" alt="${member.name}" class="member-image" onerror="this.src='images/placeholder.jpg'">
    <div class="member-content">
      ${badgeClass ? `<span class="member-badge ${badgeClass}">${badgeText}</span>` : ''}
      <h3 class="member-name">${escapeHtml(member.name)}</h3>
      <p class="member-description">${escapeHtml(member.description)}</p>
      <div class="member-details">
        <p><strong>Address:</strong> ${escapeHtml(member.address)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(member.phone)}</p>
      </div>
      <a href="${escapeHtml(member.website)}" target="_blank" class="member-website">Visit Website</a>
    </div>
  `;

  return card;
}

/**
 * Get membership badge class based on membership level
 */
function getMembershipBadge(level) {
  switch(level) {
    case 3:
      return 'gold';
    case 2:
      return 'silver';
    case 1:
    default:
      return 'member';
  }
}

/**
 * Get membership text based on membership level
 */
function getMembershipText(level) {
  switch(level) {
    case 3:
      return 'Gold Member';
    case 2:
      return 'Silver Member';
    case 1:
    default:
      return 'Member';
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}