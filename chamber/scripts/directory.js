const businesses = [
{
src: "images/img1.svg",
address: "12 Rue du Commerce, Port-au-Prince",
phone: "509-3456-7890",
email: "tech@ayiti.ht"
},

{
src: "images/img2.png",
address: "45 Rue des Entrepreneurs, Cap-Haïtien",
phone: "509-3333-2222",
email: "lakay@biz.ht"
},

{
src: "images/img3.webp",
address: "101 Boulevard des Arts, Pétion-Ville",
phone: "509-3788-9000",
email: "mk@biz.ht"
},

{
src: "images/img4.svg",
address: "8 Avenue de la Paix, Port-au-Prince",
phone: "509-3677-1111",
email: "food@biz.ht"
},

{
src: "images/img5.svg",
address: "200 Rue des Banques, Port-au-Prince",
phone: "509-3000-2222",
email: "bank@biz.ht"
},

{
src: "images/img6.svg",
address: "33 Route des Ingénieurs, Carrefour",
phone: "509-3333-4444",
email: "bati@biz.ht"
},

{
src: "images/img7.svg",
address: "77 Rue des Technologies, Pétion-Ville",
phone: "509-3555-8888",
email: "digital@biz.ht"
},

{
src: "images/img8.svg",
address: "14 Rue du Transport, Delmas",
phone: "509-3666-9999",
email: "transport@biz.ht"
},

{
src: "images/img9.webp",
address: "5 Boulevard du Tourisme, Cap-Haïtien",
phone: "509-3777-0000",
email: "tourism@biz.ht"
}

];


const container = document.querySelector("#business-container");

businesses.forEach((business, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    if ([0, 2, 4, 6, 8].includes(index)) {
        card.classList.add("special-bg");
    }

    card.innerHTML = `
        <img src="${business.src}" alt="Business logo">
        <div class="details">
            <p class="address">${business.address}</p>
            <p class="phone">${business.phone}</p>
            <p class="email"><a href="mailto:${business.email}">${business.email}</a></p>
        </div>
        <div class="contact">
            <p class="email"><a href="mailto:${business.email}">${business.email}</a></p>
        </div>
    `;

    container.appendChild(card);
});

const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

function setGridView() {
    container.classList.remove('list-view');
    gridViewBtn.setAttribute('aria-pressed', 'true');
    listViewBtn.setAttribute('aria-pressed', 'false');
}

function setListView() {
    container.classList.add('list-view');
    gridViewBtn.setAttribute('aria-pressed', 'false');
    listViewBtn.setAttribute('aria-pressed', 'true');
}

gridViewBtn.addEventListener('click', setGridView);
listViewBtn.addEventListener('click', setListView);
