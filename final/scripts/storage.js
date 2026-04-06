const selectedCategoryKey = 'haiti-orgs-selected-category';

export function getSelectedCategory() {
    const saved = localStorage.getItem(selectedCategoryKey);
    return saved ? saved : 'All';
}

export function saveSelectedCategory(category) {
    localStorage.setItem(selectedCategoryKey, category);
}
