import { loadOrganizationData, getCategories } from './organizations-data.js';
import { getSelectedCategory, saveSelectedCategory } from './storage.js';
import { createOrganizationModal } from './organization-modal.js';

export async function initOrganizationDirectory() {
    const orgList = document.getElementById('org-list');
    const orgCount = document.getElementById('org-count');
    const categoryButtons = document.getElementById('category-buttons');
    let organizations = [];
    const modal = createOrganizationModal();
    const savedCategory = getSelectedCategory();

    try {
        organizations = await loadOrganizationData();
        renderCategories(getCategories(organizations), savedCategory);
        renderOrganizationCards(organizations, savedCategory);
    } catch (error) {
        orgList.innerHTML = '<div class="loading">Unable to load organizations at this time.</div>';
        console.error(error);
    }

    function renderCategories(categories, activeCategory = 'All') {
        categoryButtons.innerHTML = categories.map(category => `
            <button type="button" data-category="${category}">${category}</button>
        `).join('');

        categoryButtons.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                saveSelectedCategory(category);
                categoryButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderOrganizationCards(organizations, category);
            });
        });

        const targetButton = Array.from(categoryButtons.querySelectorAll('button')).find(button => button.dataset.category === activeCategory) || categoryButtons.querySelector('button');
        targetButton?.classList.add('active');
    }

    function renderOrganizationCards(list, category = 'All') {
        const filtered = category === 'All' ? list : list.filter(org => org.category === category);

        if (!filtered.length) {
            orgList.innerHTML = '<p class="loading">No organizations match this category.</p>';
            orgCount.textContent = '0 organizations found.';
            return;
        }

        orgCount.textContent = `${filtered.length} organizations found`;
        orgList.innerHTML = filtered.map(org => `
            <article class="organization-card">
                <img src="${org.image}" alt="${org.name} illustration" loading="lazy">
                <div class="org-card-body">
                    <h2>${org.name}</h2>
                    <div class="org-card-meta">
                        <span>${org.category}</span>
                        <span>${org.location}</span>
                        <span>${org.founded}</span>
                    </div>
                    <p>${org.description}</p>
                    <div class="org-card-meta">
                        <span>${org.address}</span>
                        <span>${org.phone}</span>
                    </div>
                    <div class="org-card-actions">
                        <button type="button" class="button button-secondary details-button" data-id="${org.id}">More details</button>
                        <a class="button button-primary" href="${org.website}" target="_blank" rel="noopener noreferrer">Visit website</a>
                    </div>
                </div>
            </article>
        `).join('');

        orgList.querySelectorAll('.details-button').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const organization = organizations.find(item => item.id === id);
                if (organization) {
                    openOrganizationModal(organization);
                }
            });
        });
    }

    function openOrganizationModal(org) {
        modal.openModal(`
            <h2 id="modal-title">${org.name}</h2>
            <p class="modal-meta"><strong>Category:</strong> ${org.category}</p>
            <p><strong>Location:</strong> ${org.location}</p>
            <p><strong>Address:</strong> ${org.address}</p>
            <p><strong>Phone:</strong> ${org.phone}</p>
            <p><strong>Founded:</strong> ${org.founded}</p>
            <p><strong>Mission:</strong> ${org.mission}</p>
            <p><strong>Programs:</strong> ${org.programs}</p>
            <p>${org.impact}</p>
            <p><a href="${org.website}" target="_blank" rel="noopener noreferrer">Visit organization website</a></p>
        `);
    }
}
