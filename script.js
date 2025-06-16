const assets = [
  { id: 1, name: "Finance Sense", type: "Book", status: "Available", borrowedBy: "", returnDate: "" },
  { id: 2, name: "Smart Swarm", type: "Book", status: "Issued", borrowedBy: "Alice", returnDate: "2025-06-20" },
  { id: 3, name: "The Art of Thinking Clearly", type: "Book", status: "Available", borrowedBy: "", returnDate: "" },
];

function renderAssets() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <header><h1>Acies Library Portal</h1></header>
    <div class="container">
      ${assets.map(asset => `
        <div class="asset">
          <div>
            <strong>${asset.name}</strong> (${asset.type}) - <em>${asset.status}</em>
            ${asset.status === "Issued" ? `<br><small>Borrowed by: ${asset.borrowedBy}, Due: ${asset.returnDate}</small>` : ""}
          </div>
          <button onclick="toggleStatus(${asset.id})">
            ${asset.status === "Available" ? "Issue" : "Return"}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

const API_URL = "https://script.google.com/a/macros/aciesglobal.com/s/AKfycbyJrvRkFlGGimgrGIvOKAP8rzMOHtMN1WPo-MHUfiDHd0s7a_btmQQDcv5EjeqiTgJ2Og/exec"; // ← replace this with your Apps Script URL

function toggleStatus(id) {
  const asset = assets.find(a => a.id === id);
  
  if (asset.status === "Available") {
    const name = prompt("Enter borrower's name:");
    if (!name) return;
    const today = new Date();
    const returnDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];

    asset.status = "Issued";
    asset.borrowedBy = name;
    asset.returnDate = returnDate;
  } else {
    asset.status = "Available";
    asset.borrowedBy = "";
    asset.returnDate = "";
  }

  // Send to Google Sheets
  fetch(API_URL, {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(asset),
  });

  renderAssets();
}
