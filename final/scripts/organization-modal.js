export function createOrganizationModal() {
    const modalRoot = document.createElement('div');
    modalRoot.className = 'modal hidden';
    modalRoot.innerHTML = `
        <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
            <div class="modal-content">
                <button type="button" class="modal-close" aria-label="Close organization details">×</button>
                <div class="modal-body" id="modal-body"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modalRoot);

    const closeButton = modalRoot.querySelector('.modal-close');
    const backdrop = modalRoot.querySelector('.modal-backdrop');
    const body = modalRoot.querySelector('#modal-body');

    function closeModal() {
        modalRoot.classList.add('hidden');
        modalRoot.classList.remove('open');
    }

    function openModal(contentHtml) {
        body.innerHTML = contentHtml;
        modalRoot.classList.remove('hidden');
        modalRoot.classList.add('open');
        closeButton.focus();
    }

    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!modalRoot.classList.contains('open')) return;
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    return { openModal, closeModal };
}
