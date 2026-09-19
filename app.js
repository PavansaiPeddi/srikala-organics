const fallbackProducts = [
  {id:"demo-honey",name:"Pure Honey",price:299,weight:"500g",stock:50,description:"Naturally sourced honey with no added sugar.",image_url:"images/honey.svg"},
  {id:"demo-turmeric",name:"Turmeric",price:149,weight:"250g",stock:75,description:"Quality turmeric powder for everyday cooking.",image_url:"images/turmeric.svg"},
  {id:"demo-peanut",name:"Peanut Butter",price:249,weight:"500g",stock:40,description:"Roasted peanut butter made for everyday use.",image_url:"images/peanut.svg"},
  {id:"demo-rice",name:"Brown Rice",price:199,weight:"1 kg",stock:40,description:"Minimally processed brown rice.",image_url:"images/rice.svg"}
];

const imageMap = {
  "Honey":"images/honey.svg","Pure Honey":"images/honey.svg",
  "Turmeric":"images/turmeric.svg","Turmeric Powder":"images/turmeric.svg",
  "Peanut Butter":"images/peanut.svg","Brown Rice":"images/rice.svg"
};

function productImage(p){return p.image_url || imageMap[p.name] || "images/honey.svg";}
function cart(){return JSON.parse(localStorage.getItem("cart")||"[]");}
function saveCart(c){localStorage.setItem("cart",JSON.stringify(c));updateCartCount();}
function updateCartCount(){const n=cart().reduce((s,p)=>s+Number(p.quantity||1),0);document.querySelectorAll("#cart-count").forEach(e=>e.textContent=n);}
function safe(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

async function getProducts(){
  try{
    const r=await fetch(`${SUPABASE_URL}/rest/v1/products?active=eq.true&select=*`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    if(!r.ok) throw new Error(await r.text());
    const data=await r.json();
    if(Array.isArray(data)&&data.length) return data;
  }catch(e){console.warn("Supabase products unavailable; using local fallback.",e);}
  return fallbackProducts;
}

async function loadProducts(){
  const box=document.getElementById("products"); if(!box)return;
  const products=await getProducts();
  window.srikalaProducts=products;
  box.innerHTML=products.map(p=>`
    <article class="product-card">
      <div class="product-img"><img src="${productImage(p)}" alt="${safe(p.name)}"></div>
      <div class="product-body">
        <h3>${safe(p.name)}</h3><div class="weight">${safe(p.weight||"")}</div>
        <p class="desc">${safe(p.description||"Quality everyday essential.")}</p>
        <div class="price-row"><span class="price">₹${Number(p.price).toLocaleString("en-IN")}</span><span class="stock">${Number(p.stock||0)} in stock</span></div>
        <div class="card-actions"><a class="small-btn" href="product.html?id=${encodeURIComponent(p.id)}">View</a><button class="add-btn" data-id="${safe(p.id)}">Add to cart</button></div>
      </div>
    </article>`).join("");
  box.querySelectorAll(".add-btn").forEach(b=>b.addEventListener("click",()=>{
    const p=products.find(x=>String(x.id)===String(b.dataset.id)); addToCart(p);
  }));
}
function addToCart(p){
  const c=cart(), existing=c.find(x=>String(x.id)===String(p.id));
  if(existing){if(existing.quantity < Number(p.stock||999)){existing.quantity++;}else{return alert("Maximum available stock reached.");}}
  else c.push({id:p.id,name:p.name,price:Number(p.price),weight:p.weight,image_url:productImage(p),quantity:1,stock:Number(p.stock||999)});
  saveCart(c); alert(`${p.name} added to cart.`);
}
document.addEventListener("DOMContentLoaded",()=>{updateCartCount();loadProducts();const m=document.getElementById("menu-btn"),n=document.getElementById("mobile-nav");if(m)m.onclick=()=>n.classList.toggle("open");});
