/* ==========================================================
   DATA DUMMY & STATE MANAGEMENT
   ========================================================== */
const initialDestinations = [
  {
    id: 1,
    title: "Pantai Sorake",
    category: "Pantai",
    location: "Nias Selatan",
    desc: "Destinasi selancar internasional kelas dunia dengan ombak kanan terbaik.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Desa Bawomataluo",
    category: "Budaya",
    location: "Nias Selatan",
    desc: "Desa adat di atas bukit ikonik dengan tradisi lompat batu (Hombo Batu).",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Pantai Tureloto",
    category: "Alam",
    location: "Nias Utara",
    desc: "Pantai unik berkarang dengan keindahan laut tenang menyerupai Laut Mati.",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Museum Pusaka Nias",
    category: "Sejarah",
    location: "Kota Gunungsitoli",
    desc: "Pusat konservasi benda budaya, sejarah, dan flora-fauna khas Nias.",
    img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
  },
];

const defaultFishList = [
  {
    id: 1,
    name: "Ikan Cakalang Segar",
    category: "Ikan Pelagis",
    price: 35000,
    stock: 45,
    sold: 120,
    market: "Pasar Gusit (Gunungsitoli)",
    img: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=500&q=80",
    desc: "Tangkapan segar nelayan laut lepas.",
  },
  {
    id: 2,
    name: "Kakap Merah",
    category: "Ikan Karang",
    price: 65000,
    stock: 12,
    sold: 85,
    market: "Pasar Teluk Dalam (Nias Selatan)",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80",
    desc: "Kualitas super cocok untuk hidangan resto.",
  },
  {
    id: 3,
    name: "Lobster Mutiara",
    category: "Udang & Kerang",
    price: 180000,
    stock: 5,
    sold: 30,
    market: "Pasar Sirombu (Nias Barat)",
    img: "https://images.unsplash.com/photo-1559742811-822863c46f83?auto=format&fit=crop&w=500&q=80",
    desc: "Lobster hidup hasil tangkapan karang luar.",
  },
];

let fishData =
  JSON.parse(localStorage.getItem("sipasarFishData")) || defaultFishList;
let currentUser = JSON.parse(localStorage.getItem("sipasarUser")) || {
  role: "pengunjung",
  name: "Pengunjung",
};

/* INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
  updateUserUI();
  renderDestinations(initialDestinations);
  renderFishCatalog();
});

/* ROLE SYSTEM */
function setUserRole(role, name) {
  currentUser = { role, name };
  localStorage.setItem("sipasarUser", JSON.stringify(currentUser));
  updateUserUI();
  renderFishCatalog();

  const modalEl = document.getElementById("loginModal");
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}

function updateUserUI() {
  const badge = document.getElementById("userRoleBadge");
  const addBtn = document.getElementById("addFishBtn");

  if (badge) {
    badge.innerHTML = `<i class="fa-solid fa-user me-1"></i> ${currentUser.name}`;
  }
  if (addBtn) {
    if (currentUser.role === "admin" || currentUser.role === "pedagang") {
      addBtn.classList.remove("d-none");
    } else {
      addBtn.classList.add("d-none");
    }
  }
}

/* DESTINATION RENDER */
function renderDestinations(items) {
  const grid = document.getElementById("destinationGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const searchInput =
    document.getElementById("searchDestInput")?.value.toLowerCase() || "";
  const catInput =
    document.getElementById("categoryDestFilter")?.value || "semua";

  const filtered = items.filter((dest) => {
    const matchSearch =
      dest.title.toLowerCase().includes(searchInput) ||
      dest.location.toLowerCase().includes(searchInput);
    const matchCat = catInput === "semua" || dest.category === catInput;
    return matchSearch && matchCat;
  });

  if (filtered.length === 0) {
    document.getElementById("noDestMsg")?.classList.remove("d-none");
    return;
  }
  document.getElementById("noDestMsg")?.classList.add("d-none");

  filtered.forEach((dest) => {
    grid.innerHTML += `
            <div class="col-lg-3 col-md-6">
                <div class="card custom-card h-100 shadow-sm">
                    <div class="card-thumb">
                        <img src="${dest.img}" alt="${dest.title}">
                        <span class="badge-tag">${dest.category}</span>
                    </div>
                    <div class="card-body p-3">
                        <small class="text-danger fw-semibold d-block mb-1"><i class="bi bi-geo-alt-fill me-1"></i>${dest.location}</small>
                        <h5 class="fw-bold mb-2">${dest.title}</h5>
                        <p class="text-muted small mb-0">${dest.desc}</p>
                    </div>
                </div>
            </div>
        `;
  });
}

/* SIPASAR FISH CATALOG RENDER */
function renderFishCatalog() {
  const grid = document.getElementById("fishGrid");
  if (!grid) return;

  const search =
    document.getElementById("searchFishInput")?.value.toLowerCase() || "";
  const category =
    document.getElementById("categoryFishFilter")?.value || "semua";
  const market = document.getElementById("marketFishFilter")?.value || "semua";

  const filtered = fishData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search);
    const matchCat = category === "semua" || item.category === category;
    const matchMarket = market === "semua" || item.market === market;
    return matchSearch && matchCat && matchMarket;
  });

  grid.innerHTML = "";
  updateFishStats();

  if (filtered.length === 0) {
    document.getElementById("emptyFishMsg")?.classList.remove("d-none");
    return;
  }
  document.getElementById("emptyFishMsg")?.classList.add("d-none");

  filtered.forEach((item) => {
    let statusBadge = '<span class="badge bg-success">Melimpah</span>';
    if (item.stock === 0)
      statusBadge = '<span class="badge bg-danger">Kosong</span>';
    else if (item.stock <= 20)
      statusBadge = '<span class="badge bg-warning text-dark">Terbatas</span>';

    let actionButton = "";
    if (currentUser.role === "pembeli") {
      actionButton = `<button class="btn btn-emerald btn-sm w-100 fw-bold mt-2" onclick="openBuyModal(${item.id})" ${item.stock === 0 ? "disabled" : ""}>Beli Sekarang</button>`;
    } else if (
      currentUser.role === "admin" ||
      currentUser.role === "pedagang"
    ) {
      actionButton = `<div class="d-flex gap-1 mt-2">
                <button class="btn btn-outline-primary btn-sm w-50" onclick="openEditFishModal(${item.id})">Edit</button>
                <button class="btn btn-outline-danger btn-sm w-50" onclick="deleteFish(${item.id})">Hapus</button>
            </div>`;
    }

    grid.innerHTML += `
            <div class="col-lg-4 col-md-6">
                <div class="card custom-card h-100 shadow-sm">
                    <div class="card-thumb">
                        <img src="${item.img}" alt="${item.name}">
                        <span class="badge-tag bg-teal">${item.category}</span>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <small class="text-muted"><i class="bi bi-shop me-1"></i>${item.market}</small>
                            ${statusBadge}
                        </div>
                        <h5 class="fw-bold mb-2">${item.name}</h5>
                        <p class="text-muted small mb-2">${item.desc || ""}</p>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="fs-5 fw-bold text-teal">Rp ${item.price.toLocaleString("id-ID")} /kg</span>
                            <small class="text-muted">Stok: <strong>${item.stock} kg</strong></small>
                        </div>
                        ${actionButton}
                    </div>
                </div>
            </div>
        `;
  });
}

function updateFishStats() {
  if (!document.getElementById("statTotal")) return;
  document.getElementById("statTotal").innerText = fishData.length;
  document.getElementById("statMelimpah").innerText = fishData.filter(
    (i) => i.stock > 20,
  ).length;
  document.getElementById("statTerbatas").innerText = fishData.filter(
    (i) => i.stock > 0 && i.stock <= 20,
  ).length;
  document.getElementById("statKosong").innerText = fishData.filter(
    (i) => i.stock === 0,
  ).length;
}

/* CRUD FISH DATA (ADMIN/PEDAGANG) */
function openAddFishModal() {
  document.getElementById("fishForm").reset();
  document.getElementById("fishIdInput").value = "";
  document.getElementById("fishModalTitle").innerText = "Tambah Tangkapan Baru";
  const modal = new bootstrap.Modal(document.getElementById("fishModal"));
  modal.show();
}

function openEditFishModal(id) {
  const item = fishData.find((f) => f.id === id);
  if (!item) return;

  document.getElementById("fishIdInput").value = item.id;
  document.getElementById("fishNameInput").value = item.name;
  document.getElementById("fishCategoryInput").value = item.category;
  document.getElementById("fishMarketInput").value = item.market;
  document.getElementById("fishPriceInput").value = item.price;
  document.getElementById("fishStockInput").value = item.stock;
  document.getElementById("fishImgInput").value = item.img;
  document.getElementById("fishDescInput").value = item.desc || "";

  document.getElementById("fishModalTitle").innerText = "Edit Data Tangkapan";
  const modal = new bootstrap.Modal(document.getElementById("fishModal"));
  modal.show();
}

document.getElementById("fishForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("fishIdInput").value;
  const name = document.getElementById("fishNameInput").value;
  const category = document.getElementById("fishCategoryInput").value;
  const market = document.getElementById("fishMarketInput").value;
  const price = parseInt(document.getElementById("fishPriceInput").value);
  const stock = parseInt(document.getElementById("fishStockInput").value);
  const img =
    document.getElementById("fishImgInput").value ||
    "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=500&q=80";
  const desc = document.getElementById("fishDescInput").value;

  if (id) {
    // Edit Existing
    const item = fishData.find((f) => f.id === parseInt(id));
    if (item) {
      item.name = name;
      item.category = category;
      item.market = market;
      item.price = price;
      item.stock = stock;
      item.img = img;
      item.desc = desc;
    }
  } else {
    // Create New
    const newItem = {
      id: Date.now(),
      name,
      category,
      market,
      price,
      stock,
      sold: 0,
      img,
      desc,
    };
    fishData.push(newItem);
  }

  localStorage.setItem("sipasarFishData", JSON.stringify(fishData));
  renderFishCatalog();
  bootstrap.Modal.getInstance(document.getElementById("fishModal")).hide();
});

function deleteFish(id) {
  if (confirm("Apakah Anda yakin ingin menghapus komoditas ini?")) {
    fishData = fishData.filter((f) => f.id !== id);
    localStorage.setItem("sipasarFishData", JSON.stringify(fishData));
    renderFishCatalog();
  }
}

/* BUY TRANSACTIONS */
function openBuyModal(id) {
  const item = fishData.find((f) => f.id === id);
  if (!item) return;
  document.getElementById("buyItemId").value = item.id;
  document.getElementById("buyItemName").innerText = item.name;
  document.getElementById("buyItemInfo").innerText =
    `Harga: Rp ${item.price.toLocaleString("id-ID")}/kg | Stok: ${item.stock} kg`;
  document.getElementById("buyQty").value = 1;
  document.getElementById("buyQty").max = item.stock;

  updateTotalPrice(item.price, 1);

  const buyQtyInput = document.getElementById("buyQty");
  buyQtyInput.oninput = () => {
    updateTotalPrice(item.price, parseInt(buyQtyInput.value) || 0);
  };

  const buyModal = new bootstrap.Modal(document.getElementById("buyModal"));
  buyModal.show();
}

function updateTotalPrice(pricePerKg, qty) {
  const total = pricePerKg * qty;
  document.getElementById("buyTotalPrice").innerText =
    `Total: Rp ${total.toLocaleString("id-ID")}`;
}

document.getElementById("buyForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("buyItemId").value);
  const qty = parseInt(document.getElementById("buyQty").value);
  const item = fishData.find((f) => f.id === id);

  if (item && qty <= item.stock) {
    item.stock -= qty;
    item.sold += qty;
    localStorage.setItem("sipasarFishData", JSON.stringify(fishData));
    renderFishCatalog();
    bootstrap.Modal.getInstance(document.getElementById("buyModal")).hide();
    alert("Transaksi berhasil! Pesanan Anda sedang diproses.");
  } else {
    alert("Jumlah pembelian melebihi stok yang tersedia.");
  }
});
