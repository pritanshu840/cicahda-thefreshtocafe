/* script.js
   Simple menu + cart functionality
*/

const menuData = [
  { id:1, name:"Classic Caprese Pesto Sandwich", price:970.00, desc:"Mozzarella, basil pesto, tomato, balsamic" },
  { id:2, name:"Spicy Chipotle Paneer Sandwich", price:460.00, desc:"Marinated paneer, chipotle sauce, greens" },
  { id:3, name:"Garlic Aioli Veggie Melt", price:430.00, desc:"Grilled veggies, garlic aioli, melted cheese" },
  { id:4, name:"Honey Mustard Tofu & Cheddar", price:490.00, desc:"Tofu, cheddar, honey mustard" },
  { id:5, name:"Romesco Roasted Veg Sandwich", price:450.00, desc:"Roasted seasonal veg, romesco spread" },
  { id:6, name:"Harissa Paneer Power Sandwich", price:430.00, desc:"Harissa-glazed paneer, roasted peppers" },
  { id:7, name:"Sriracha Crispy Veg Crunch", price:410.00, desc:"Crispy veggies, sriracha mayo, slaw" },
  { id:8, name:"FOCACCIA TEXI", price:440.00, desc:"House focaccia special" },
  { id:9, name:"Chimichurri Grilled Soya Sandwich", price:430.00, desc:"Grilled soya, chimichurri, caramelized onion" },
  { id:10, name:"Falafal Habibi", price:450.00, desc:"Falafel, tahini, pickles" },
  { id:11, name:"Mediterranean Veggie Bagel Sandwich / CROISSANT", price:440.00, desc:"Hummus, veggies, olives" },
  { id:12, name:"Cream Cheese & Grilled Veggie Bagel/CROISSANT", price:430.00, desc:"Cream cheese, grilled veggies" }
];

let cart = [];

function q(sel){ return document.querySelector(sel) }
function qa(sel){ return document.querySelectorAll(sel) }

function renderMenu(items){
  const ul = q('#menuList');
  ul.innerHTML = '';
  items.forEach(it => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = `
      <div class="item-left">
        <div class="item-name">${it.name}</div>
        <div class="item-desc">${it.desc}</div>
      </div>
      <div class="item-right">
        <div class="price">₹${it.price.toFixed(2)}</div>
        <button class="add-btn" data-id="${it.id}">Add</button>
      </div>
    `;
    ul.appendChild(li);
  });
  // attach add buttons
  qa('.add-btn').forEach(b=>{
    b.onclick = ()=> addToCart(parseInt(b.dataset.id));
  });
}

function addToCart(id){
  const item = menuData.find(x=>x.id===id);
  if(!item) return;
  const existing = cart.find(ci=>ci.id === id);
  if(existing) existing.qty++;
  else cart.push({ ...item, qty:1 });
  updateCartUI();
}

function updateCartUI(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  q('#cartCount').textContent = count;
  const itemsContainer = q('#cartItems');
  itemsContainer.innerHTML = '';
  if(cart.length === 0){
    itemsContainer.innerHTML = '<li class="muted">Your cart is empty — add something tasty 🍞</li>';
    q('#cartTotal').textContent = '₹0.00';
    return;
  }
  cart.forEach(ci=>{
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div>
        <div style="font-weight:700">${ci.name}</div>
        <small>₹${ci.price.toFixed(2)} × ${ci.qty}</small>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700">₹${(ci.price*ci.qty).toFixed(2)}</div>
        <div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end">
          <button class="btn btn-ghost dec" data-id="${ci.id}">−</button>
          <button class="btn btn-ghost inc" data-id="${ci.id}">+</button>
        </div>
      </div>
    `;
    itemsContainer.appendChild(li);
  });

  // attach inc/dec
  qa('.inc').forEach(b=>{ b.onclick = () => { changeQty(parseInt(b.dataset.id), 1) }});
  qa('.dec').forEach(b=>{ b.onclick = () => { changeQty(parseInt(b.dataset.id), -1) }});

  q('#cartTotal').textContent = '₹' + cart.reduce((s,i)=>s+(i.price*i.qty),0).toFixed(2);
}

function changeQty(id, delta){
  const idx = cart.findIndex(c=>c.id === id);
  if(idx === -1) return;
  cart[idx].qty += delta;
  if(cart[idx].qty < 1) cart.splice(idx,1);
  updateCartUI();
}

function clearCart(){
  cart = [];
  updateCartUI();
}

/* Search and sort */
function applySearchAndSort(){
  const qstr = q('#menuSearch').value.trim().toLowerCase();
  let results = menuData.filter(it => {
    return it.name.toLowerCase().includes(qstr) || it.desc.toLowerCase().includes(qstr);
  });

  const sortVal = q('#sortSelect').value;
  if(sortVal === 'price-asc') results.sort((a,b)=>a.price-b.price);
  if(sortVal === 'price-desc') results.sort((a,b)=>b.price-a.price);
  renderMenu(results);
}

/* Modal behavior */
function openCart(){ q('#cartModal').setAttribute('aria-hidden','false') }
function closeCart(){ q('#cartModal').setAttribute('aria-hidden','true') }

document.addEventListener('DOMContentLoaded', ()=>{
  // initial render
  renderMenu(menuData);
  updateCartUI();
  q('#year').textContent = new Date().getFullYear();

  // event listeners
  q('#menuSearch').addEventListener('input', ()=> applySearchAndSort());
  q('#sortSelect').addEventListener('change', applySearchAndSort);

  q('#cartBtn').addEventListener('click', openCart);
  q('#closeCart').addEventListener('click', closeCart);

  q('#clearCart').addEventListener('click', ()=>{
    if(confirm('Clear cart?')) clearCart();
  });

  q('#checkout').addEventListener('click', ()=>{
    if(cart.length === 0) { alert('Cart is empty — add something yummy first!'); return; }
    const total = cart.reduce((s,i)=>s+(i.price*i.qty),0).toFixed(2);
    alert(`Checkout — Total: ₹${total}\n\n( This is a demo — integrate with your payment backend )`);
    // For demo, clear cart after checkout
    cart = [];
    updateCartUI();
    closeCart();
  });

  // contact form demo
  q('#sendMsg').addEventListener('click', ()=>{
    const nm = q('#name').value.trim();
    const em = q('#email').value.trim();
    if(!nm || !em){ alert('Please enter name and email'); return; }
    alert('Thanks for messaging us — we will get back to you soon!');
    q('#name').value = q('#email').value = q('#message').value = '';
  });

  // keyboard: close cart on Escape
  document.addEventListener('keydown', (e)=> {
    if(e.key === 'Escape') closeCart();
  });
});
