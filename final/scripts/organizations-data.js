export async function loadOrganizationData() {
    const response = await fetch('data/organizations.json');
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
    }

    const organizations = await response.json();
    return organizations;
}

export function getCategories(organizations) {
    return ['All', ...new Set(organizations.map(org => org.category))];
}
