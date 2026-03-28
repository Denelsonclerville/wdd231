document.addEventListener("DOMContentLoaded", () => {
    // 1. KÒD POU PAJ JOIN.HTML (Fòmilè)
    const timestampField = document.querySelector("#timestamp");
    if (timestampField) {
        // Ranpli hidden field la ak dat/lè kounye a
        timestampField.value = new Date().toISOString();

        // Animasyon pou kat yo depi paj la chaje
        const cards = document.querySelectorAll(".card");
        cards.forEach((card, index) => {
            // Nou ajoute yon delay diferan pou chak kat nan JS
            card.style.animationDelay = `${(index + 1) * 0.2}s`;
            card.classList.add("animate-card");
        });
    }

    // 2. KÒD POU PAJ THANKYOU.HTML (Afichaj done)
    const resultsContainer = document.querySelector("#results");
    if (resultsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Nou rekipere 6 champ yo mande nan ribrik la
        const data = {
            "First Name": urlParams.get("fname"),
            "Last Name": urlParams.get("lname"),
            "Email": urlParams.get("email"),
            "Phone": urlParams.get("phone"),
            "Business Name": urlParams.get("organization"),
            "Application Date": urlParams.get("timestamp")
        };

        // Kreye yon div pou afiche done yo
        let displayHTML = `<div class="results-card"><h2>Submission Details</h2>`;
        
        for (const [key, value] of Object.entries(data)) {
            // Si se dat la, nou fòmate l pou l bèl
            let displayValue = value;
            if (key === "Application Date" && value) {
                displayValue = new Date(value).toLocaleString();
            }
            displayHTML += `<p><strong>${key}:</strong> ${displayValue || "Not provided"}</p>`;
        }
        
        displayHTML += `</div>`;
        resultsContainer.innerHTML = displayHTML;
    }
});