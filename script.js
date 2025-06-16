
const API_URL = "https://script.google.com/a/macros/aciesglobal.com/s/AKfycbyJrvRkFlGGimgrGIvOKAP8rzMOHtMN1WPo-MHUfiDHd0s7a_btmQQDcv5EjeqiTgJ2Og/exec";

const assets = [
  { id: 1, name: "Finance Sense", type: "Book", status: "Available", user: "", returnDate: "" },
  { id: 2, name: "Smart Swarm", type: "Book", status: "Available", user: "", returnDate: "" },
  { id: 3, name: "The Art of Thinking Clearly", type: "Book", status: "Available", user: "", returnDate: "" },
];

function renderAssets() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <header><h1>Acies Library Portal</h1></header>
    <div class="container">
      ${assets.map(asset => `
        <div class="asset">
          <div><strong>${asset.name}</strong> (${asset.type})</div>
          <div>Status: <em>${asset.status}</em></div>
          ${asset.status === "Issued" ? `<div>With: ${asset.user} until ${asset.returnDate}</div>` : ""}
          <button onclick="toggleStatus(${asset.id})">
            ${asset.status === "Available" ? "Issue" : "Return"}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleStatus(id) {
  const asset = assets.find(a => a.id === id);
  if (asset.status === "Available") {
    const user = prompt("Enter your name:");
    if (!user) return;
    const returnDate = prompt("Enter return date (DD-MM-YYYY):");
    if (!returnDate) return;
    asset.status = "Issued";
    asset.user = user;
    asset.returnDate = returnDate;
    postToSheet(asset);
  } else {
    asset.status = "Available";
    asset.user = "";
    asset.returnDate = "";
    postToSheet(asset);
  }
  renderAssets();
}

function postToSheet(asset) {
  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asset)
  });
}

renderAssets();
