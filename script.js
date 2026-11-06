const products=[
{id:1,name:"Aero Trail 27.5",type:"mountain",label:"Mountain bike",desc:"Sepeda tangguh untuk rute harian dan jalur santai.",price:1850000,image:"assets/bike-trail.jpg"},
{id:2,name:"Mini City Basket",type:"compact",label:"Compact bike",desc:"Praktis dan ekspresif, lengkap dengan keranjang depan.",price:1250000,image:"assets/bike-mini.jpg"},
{id:3,name:"Urban Classic",type:"city",label:"City bike",desc:"Gaya klasik dengan rak depan untuk kebutuhan harian.",price:1650000,image:"assets/bike-city.jpg"}
];
const fmt=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
let cart={},filter="all";
const productsEl=document.getElementById("products");
function renderProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 const shown=products.filter(p=>(filter==="all"||p.type===filter)&&(p.name+" "+p.label+" "+p.desc).toLowerCase().includes(q));
 productsEl.innerHTML=shown.length?shown.map(p=>`<article class="product"><span class="tag">${p.label}</span><div class="product-photo"><img src="${p.image}" alt="${p.name}"></div><div class="product-info"><div class="product-type">RODA collection</div><h3>${p.name}</h3><div class="desc">${p.desc}</div><div class="price-row"><span class="price">${fmt(p.price)}</span><button class="add" data-add="${p.id}" aria-label="Tambah ${p.name}">+</button></div></div></article>`).join(""):`<div class="no-results">Produk tidak ditemukan. Coba kata kunci lain.</div>`;
}
function renderCart(){
 const entries=Object.entries(cart).filter(([id,qty])=>qty>0);
 document.getElementById("cartCount").textContent=entries.reduce((s,[id,q])=>s+q,0);
 document.getElementById("cartItems").innerHTML=entries.length?entries.map(([id,qty])=>{const p=products.find(x=>x.id===+id);return `<div class="cart-item"><img src="${p.image}" alt=""><div style="flex:1"><strong>${p.name}</strong><small>${fmt(p.price)}</small><div class="qty"><button data-minus="${id}">−</button><span>${qty}</span><button data-plus="${id}">+</button></div></div></div>`}).join(""):`<div class="empty">Tas belanjamu masih kosong.<br>Yuk, temukan sepeda favoritmu!</div>`;
 document.getElementById("cartTotal").textContent=fmt(entries.reduce((s,[id,q])=>s+products.find(p=>p.id===+id).price*q,0));
}
productsEl.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=b.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();const t=document.getElementById("toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1700)});
document.getElementById("cartItems").addEventListener("click",e=>{const plus=e.target.closest("[data-plus]"),minus=e.target.closest("[data-minus]");if(plus){const id=plus.dataset.plus;cart[id]=(cart[id]||0)+1}if(minus){const id=minus.dataset.minus;cart[id]=Math.max(0,(cart[id]||0)-1)}renderCart()});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;renderProducts()}));
document.getElementById("search").addEventListener("input",renderProducts);
const modal=document.getElementById("cartModal");document.getElementById("openCart").onclick=()=>modal.classList.add("open");document.getElementById("closeCart").onclick=()=>modal.classList.remove("open");modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
document.getElementById("checkout").onclick=()=>{const entries=Object.entries(cart).filter(([id,q])=>q>0);if(!entries.length){alert("Tas belanja masih kosong.");return}const lines=entries.map(([id,q])=>{const p=products.find(x=>x.id===+id);return `- ${p.name} x${q} = ${fmt(p.price*q)}`});const total=entries.reduce((s,[id,q])=>s+products.find(p=>p.id===+id).price*q,0);const msg=encodeURIComponent("Halo RODA, saya ingin memesan:\n"+lines.join("\n")+"\nTotal: "+fmt(total)+"\nMohon info ketersediaan dan pengirimannya.");window.open("https://wa.me/?text="+msg,"_blank")};
renderProducts();renderCart();