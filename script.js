
// const API_URL = "https://script.google.com/macros/s/AKfycbzAE7pKleaknGGJvUXq2Kdhdi2dCzrlP4SU_qLm2t60W6OIjXIaMh8sNiWOxudPjTOPCA/exec";

// const assets = [
//   { id: 1, name: "Finance Sense", type: "Book", status: "Available", user: "", returnDate: "" },
//   { id: 2, name: "Smart Swarm", type: "Book", status: "Available", user: "", returnDate: "" },
//   { id: 3, name: "The Art of Thinking Clearly", type: "Book", status: "Available", user: "", returnDate: "" },
// ];

// function renderAssets() {
//   const app = document.getElementById("app");
//   app.innerHTML = `
//     <header><h1>Acies Library Portal</h1></header>
//     <div class="container">
//       ${assets.map(asset => `
//         <div class="asset">
//           <div><strong>${asset.name}</strong> (${asset.type})</div>
//           <div>Status: <em>${asset.status}</em></div>
//           ${asset.status === "Issued" ? `<div>With: ${asset.user} until ${asset.returnDate}</div>` : ""}
//           <button onclick="toggleStatus(${asset.id})">
//             ${asset.status === "Available" ? "Issue" : "Return"}
//           </button>
//         </div>
//       `).join('')}
//     </div>
//   `;
// }

// // function toggleStatus(id) {
// //   const asset = assets.find(a => a.id === id);
// //   if (asset.status === "Available") {
// //     const user = prompt("Enter your name:");
// //     if (!user) return;
// //     const returnDate = prompt("Enter return date (DD-MM-YYYY):");
// //     if (!returnDate) return;
// //     asset.status = "Issued";
// //     asset.user = user;
// //     asset.returnDate = returnDate;
// //     postToSheet(asset);
// //   } else {
// //     asset.status = "Available";
// //     asset.user = "";
// //     asset.returnDate = "";
// //     postToSheet(asset);
// //   }
// //   renderAssets();
// // }

// function toggleStatus(id) {
//   const asset = assets.find(a => a.id === id);

//   if (asset.status === "Available") {
//     const user = prompt("Enter your name:");

//     if (!user || user.trim() === "") {
//       alert("❗ Name is required to issue an asset.");
//       console.log("⚠️ No user provided, canceling post.");
//       return;
//     }

//     const returnDate = prompt("Enter return date (DD-MM-YYYY):");
//     if (!returnDate || returnDate.trim() === "") {
//       alert("❗ Return date is required.");
//       return;
//     }

//     asset.status = "Issued";
//     asset.user = user.trim();
//     asset.returnDate = returnDate.trim();

//     console.log("✅ Data captured:", asset); // <--- SEE HERE
//     postToSheet(asset);
//   } else {
//     asset.status = "Available";
//     asset.user = "";
//     asset.returnDate = "";
//     console.log("🔄 Returning asset:", asset);
//     postToSheet(asset);
//   }

//   renderAssets();
// }


// function postToSheet(asset) {
//   console.log("Sending to sheet:", asset);
//   fetch(API_URL, {
//     method: "POST",
//     mode: "no-cors",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(asset)
//   });
// }

// renderAssets();

const API_URL = "https://script.google.com/macros/s/AKfycbwzXLm5Lx1XyjJ8cwXAIZ3iLK_aR0m_T1Lbt843ypZRL3reE4OaeqrRh1KL5ds-cKHNgw/exec";

let assets = [
  { id: 1, name: "Finance Sense", type: "Book", status: "Available", user: "", returnDate: "" },
  { id: 2, name: "Smart Swarm", type: "Book", status: "Available", user: "", returnDate: "" },
  { id: 3, name: "The Art of Thinking Clearly", type: "Book", status: "Available", user: "", returnDate: "" },
];

document.getElementById("app").innerText = "Loading assets...";

// Render initial assets
renderAssets();

// Fetch from sheet and overwrite if valid
fetchAssets();

async function fetchAssets() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Map Google Sheet keys to internal keys
    assets = data.map(item => ({
      id: item.ID,
      name: item.Name,
      type: item.Type,
      status: item.Status,
      user: item.User || "",
      returnDate: item["Return Date"] || ""
    }));

    renderAssets();
  } catch (err) {
    console.error("❌ Failed to fetch assets from Google Sheet:", err);
    document.getElementById("app").innerText = "⚠️ Failed to load assets from Google Sheet.";
  }
}

function renderAssets() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <header><h1>Acies Library Portal</h1></header>
    <div class="container">
      ${assets.map(asset => `
        <div class="asset">
          <div><strong>${asset.name || "N/A"}</strong> (${asset.type || "N/A"})</div>
          <div>Status: <em>${asset.status || "N/A"}</em></div>
          ${asset.status === "Issued" ? `<div>With: ${asset.user || "Unknown"} until ${asset.returnDate || "Unknown"}</div>` : ""}
          <button onclick="toggleStatus('${asset.id}')">
            ${asset.status === "Available" ? "Issue" : "Return"}
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function toggleStatus(id) {
  const asset = assets.find(a => String(a.id) === String(id));

  if (!asset) {
    alert("❗ Asset not found.");
    return;
  }

  if (asset.status === "Available") {
    const user = prompt("Enter your name:");
    if (!user || user.trim() === "") {
      alert("❗ Name is required to issue an asset.");
      return;
    }
    const returnDate = prompt("Enter return date (DD-MM-YYYY):");
    if (!returnDate || returnDate.trim() === "") {
      alert("❗ Return date is required.");
      return;
    }

    asset.status = "Issued";
    asset.user = user.trim();
    asset.returnDate = returnDate.trim();
  } else {
    asset.status = "Available";
    asset.user = "";
    asset.returnDate = "";
  }

  postToSheet(asset);
  renderAssets();
}

function postToSheet(asset) {
  fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asset)
  })
    .then(() => console.log("✅ POST success:", asset))
    .catch(err => console.error("❌ POST failed", err));
}
