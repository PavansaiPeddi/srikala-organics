function renderCart(){
 const box=document.getElementById("cart-items"), foot=document.getElementById("cart-footer"); if(!box)return;
 const c=cart(); updateCartCount();
 if(!c.length){box.innerHTML='<div class="empty">Your cart is empty.<br><br><a class="btn primary" href="index.html#shop">Continue shopping</a></div>';foot.innerHTML="";return;}
 let total=0;
 box.innerHTML=c.map((p,i)=>{const t=p.price*p.quantity;total+=t;return `<div class="cart-row"><img src="${p.image_url}" alt=""><div><strong>${p.name}</strong><div class="weight">${p.weight||""}</div></div><div class="qty"><button onclick="changeQty(${i},-1)">−</button><b>${p.quantity}</b><button onclick="changeQty(${i},1)">+</button></div><strong>₹${t.toLocaleString("en-IN")}</strong><button class="remove" onclick="removeItem(${i})">Remove</button></div>`}).join("");
 foot.innerHTML=`<div class="cart-total">Total: ₹${total.toLocaleString("en-IN")}</div><div style="text-align:right;margin-top:18px"><a class="btn primary" href="checkout.html">Proceed to checkout →</a></div>`;
}
function changeQty(i,d){const c=cart();c[i].quantity+=d;if(c[i].quantity<=0)c.splice(i,1);else if(c[i].quantity>c[i].stock)c[i].quantity=c[i].stock;saveCart(c);renderCart();}
function removeItem(i){const c=cart();c.splice(i,1);saveCart(c);renderCart();}
document.addEventListener("DOMContentLoaded",renderCart);