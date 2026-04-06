import { initNavigation } from './app.js';

initNavigation();

const resultsContainer = document.getElementById('results-container');
const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const email = params.get('email');
const organization = params.get('organization');
const support = params.get('support');

if (!name || !email || !organization || !support) {
    resultsContainer.innerHTML = `
        <p class="loading">No submission data was found. Please return to the <a href="interest-form.html">interest form</a> and submit your details.</p>
    `;
} else {
    resultsContainer.innerHTML = `
        <article class="result-card">
            <h2>Thank you, ${escapeHtml(name)}!</h2>
            <p>Your submission was received for <strong>${escapeHtml(organization)}</strong>.</p>
            <dl>
                <dt>Email</dt>
                <dd>${escapeHtml(email)}</dd>
                <dt>Support interest</dt>
                <dd>${escapeHtml(support)}</dd>
            </dl>
            <p>We recommend that you follow up directly with the organization for more details.</p>
        </article>
    `;
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
