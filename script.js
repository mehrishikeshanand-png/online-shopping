const products=[
  {id:1,name:'Cloud Rib Throw',cat:'Home',price:86,rating:4.9,desc:'A weighty organic cotton throw with a plush ribbed handfeel.',a:'#d8e8d9',b:'#fff0c7'},
  {id:2,name:'Sora Ceramic Cup',cat:'Home',price:34,rating:4.8,desc:'Hand-glazed stoneware cup for coffee, tea, and desk rituals.',a:'#f6efe1',b:'#b9cfbd'},
  {id:3,name:'Amber Glow Serum',cat:'Wellness',price:48,rating:4.9,desc:'Lightweight botanical facial oil with calendula and sea buckthorn.',a:'#f1b36d',b:'#c9785b'},
  {id:4,name:'Linen Market Tote',cat:'Travel',price:62,rating:4.7,desc:'Roomy washed-linen carryall with inside pocket and brass snap.',a:'#eeddbf',b:'#6c8b77'},
  {id:5,name:'Brass Desk Tray',cat:'Office',price:42,rating:4.6,desc:'A tidy landing place for keys, clips, rings, and daily notes.',a:'#e0b45b',b:'#a36d40'},
  {id:6,name:'Hinoki Hand Balm',cat:'Wellness',price:26,rating:4.8,desc:'Fast-absorbing balm scented with hinoki, bergamot, and cedar.',a:'#c9ded1',b:'#f4d9c5'},
  {id:7,name:'Commuter Cord Pouch',cat:'Travel',price:38,rating:4.5,desc:'Padded pouch for chargers, lip balm, cards, and small tech.',a:'#8fa697',b:'#263b32'},
  {id:8,name:'Morning Pages Journal',cat:'Office',price:30,rating:4.9,desc:'Lay-flat notebook with warm ivory pages and recycled cover stock.',a:'#fff3d8',b:'#c9785b'},
  {id:9,name:'Studio Incense Set',cat:'Home',price:28,rating:4.7,desc:'Low-smoke incense with three grounding scents for quiet evenings.',a:'#d4b7a1',b:'#775247'},
  {id:10,name:'Moon Silk Scrunchie',cat:'Style',price:18,rating:4.6,desc:'Mulberry silk hair tie in a luminous pearl champagne finish.',a:'#fff7ea',b:'#d9b88f'},
  {id:11,name:'City Rain Bottle',cat:'Travel',price:44,rating:4.8,desc:'Slim stainless bottle that keeps drinks cold for morning errands.',a:'#b7cad8',b:'#324354'},
  {id:12,name:'Petal Clay Mask',cat:'Wellness',price:36,rating:4.7,desc:'Gentle mineral mask with rose clay and oat for soft weekly resets.',a:'#e6afa0',b:'#f7e2d5'}
];

const state={category:'All',search:'',sort:'featured',cart:[],wishlist:new Set(),promo:null};
const $=s=>document.querySelector(s);
const grid=$('#productGrid');
const filters=$('#categoryFilters');
const cartDrawer=$('#cartDrawer');
const toast=$('#toast');
const money=n=>'$'+n.toFixed(2);

function init(){
  renderFilters();renderProducts();updateCart();bindEvents();
}
function bindEvents(){
  $('#searchInput').addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();renderProducts();});
  $('#sortSelect').addEventListener('change',e=>{state.sort=e.target.value;renderProducts();});
  $('#clearFilters').addEventListener('click',resetFilters);$('#emptyReset').addEventListener('click',resetFilters);
  $('#openCart').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);
  cartDrawer.addEventListener('click',e=>{if(e.target===cartDrawer)closeCart();});
  $('#applyPromo').addEventListener('click',applyPromo);
  $('#checkoutBtn').addEventListener('click',openCheckout);$('#closeCheckout').addEventListener('click',closeCheckout);
  $('#checkoutModal').addEventListener('click',e=>{if(e.target.id==='checkoutModal')closeCheckout();});
  $('#continueShopping').addEventListener('click',()=>{closeCheckout();closeCart();document.querySelector('#shop').scrollIntoView({behavior:'smooth'});});
  $('#checkoutForm').addEventListener('submit',submitCheckout);
  $('#newsletterForm').addEventListener('submit',submitNewsletter);
  $('#navToggle').addEventListener('click',toggleNav);
  document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>setNav(false)));
  document.querySelectorAll('.collection-card').forEach(btn=>btn.addEventListener('click',()=>{state.category=btn.dataset.jump;state.search='';$('#searchInput').value='';renderFilters();renderProducts();document.querySelector('#shop').scrollIntoView({behavior:'smooth'});}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeCheckout();setNav(false);}});
}
function renderFilters(){
  const cats=['All',...new Set(products.map(p=>p.cat))];
  filters.innerHTML=cats.map(c=>`<button class='filter-chip ${state.category===c?'active':''}' data-cat='${c}' aria-pressed='${state.category===c}'>${c}</button>`).join('');
  filters.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.category=b.dataset.cat;renderFilters();renderProducts();}));
}
function getVisible(){
  let list=products.filter(p=>(state.category==='All'||p.cat===state.category)&&(p.name.toLowerCase().includes(state.search)||p.desc.toLowerCase().includes(state.search)||p.cat.toLowerCase().includes(state.search)));
  if(state.sort==='priceLow')list.sort((a,b)=>a.price-b.price);
  if(state.sort==='priceHigh')list.sort((a,b)=>b.price-a.price);
  if(state.sort==='rating')list.sort((a,b)=>b.rating-a.rating);
  return list;
}
function renderProducts(){
  const list=getVisible();
  $('#resultCount').textContent=`${list.length} product${list.length===1?'':'s'} shown`;
  $('#emptyState').hidden=list.length>0;
  grid.innerHTML=list.map(p=>`
    <article class='product-card'>
      <div class='product-art' style='background:linear-gradient(145deg,${p.a}55,${p.b}44)'>
        <button class='wish ${state.wishlist.has(p.id)?'active':''}' data-wish='${p.id}' aria-label='Save ${p.name}'>♥</button>
        <div class='product-shape' style='--a:${p.a};--b:${p.b}'></div>
      </div>
      <div class='product-info'>
        <div class='product-meta'><span>${p.cat}</span><span>★ ${p.rating}</span></div>
        <h3 class='product-title'>${p.name}</h3>
        <p class='product-desc'>${p.desc}</p>
        <div class='product-foot'><span class='price'>${money(p.price)}</span><button class='add-btn' data-add='${p.id}'>Add</button></div>
      </div>
    </article>`).join('');
  grid.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>addToCart(+btn.dataset.add)));
  grid.querySelectorAll('[data-wish]').forEach(btn=>btn.addEventListener('click',()=>toggleWish(+btn.dataset.wish)));
}
function addToCart(id){
  const item=state.cart.find(i=>i.id===id);
  if(item)item.qty++;else state.cart.push({id,qty:1});
  const p=products.find(x=>x.id===id);showToast(`${p.name} added to cart`);updateCart();
}
function toggleWish(id){
  state.wishlist.has(id)?state.wishlist.delete(id):state.wishlist.add(id);
  const p=products.find(x=>x.id===id);showToast(state.wishlist.has(id)?`${p.name} saved`:`${p.name} removed from wishlist`);renderProducts();
}
function updateCart(){
  const wrap=$('#cartItems');
  const count=state.cart.reduce((s,i)=>s+i.qty,0);
  $('#cartCount').textContent=count;
  $('#cartEmpty').style.display=count?'none':'block';
  $('#checkoutBtn').disabled=!count;
  wrap.innerHTML=state.cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class='cart-line'>
    <div class='mini-art' style='--a:${p.a};--b:${p.b}'></div><div><h4>${p.name}</h4><p>${money(p.price)} each</p><div class='qty'><button data-dec='${p.id}' aria-label='Decrease ${p.name}'>−</button><strong>${i.qty}</strong><button data-inc='${p.id}' aria-label='Increase ${p.name}'>+</button></div><button class='remove' data-remove='${p.id}'>Remove</button></div><strong class='line-total'>${money(p.price*i.qty)}</strong></div>`}).join('');
  wrap.querySelectorAll('[data-inc]').forEach(b=>b.addEventListener('click',()=>changeQty(+b.dataset.inc,1)));
  wrap.querySelectorAll('[data-dec]').forEach(b=>b.addEventListener('click',()=>changeQty(+b.dataset.dec,-1)));
  wrap.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>removeItem(+b.dataset.remove)));
  const subtotal=state.cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  const shipping=subtotal>0?(subtotal>=120?0:8):0;
  const discount=state.promo?subtotal*.15:0;
  $('#cartSubtotal').textContent=money(subtotal);$('#cartShipping').textContent=shipping?money(shipping):'Free';$('#cartDiscount').textContent='-'+money(discount);$('#cartTotal').textContent=money(Math.max(0,subtotal+shipping-discount));
}
function changeQty(id,delta){
  const item=state.cart.find(i=>i.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)removeItem(id);else updateCart();
}
function removeItem(id){state.cart=state.cart.filter(i=>i.id!==id);updateCart();showToast('Cart updated');}
function openCart(){cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');document.body.classList.add('drawer-open');}
function closeCart(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');document.body.classList.remove('drawer-open');}
function applyPromo(){
  const msg=$('#promoMessage');const code=$('#promoInput').value.trim().toUpperCase();
  msg.className='form-message';
  if(!code){msg.textContent='Enter a promo code.';msg.classList.add('error');return;}
  if(code==='LUMA15'){state.promo=code;msg.textContent='LUMA15 applied for 15% off.';msg.classList.add('success');showToast('Promo applied');}
  else{state.promo=null;msg.textContent='That code is not active. Try LUMA15.';msg.classList.add('error');}
  updateCart();
}
function openCheckout(){if(!state.cart.length)return;$('#checkoutModal').hidden=false;document.body.classList.add('modal-open');$('#checkoutFormWrap').hidden=false;$('#successState').hidden=true;}
function closeCheckout(){$('#checkoutModal').hidden=true;document.body.classList.remove('modal-open');}
function submitCheckout(e){
  e.preventDefault();const form=e.currentTarget;const msg=$('#checkoutMessage');msg.className='form-message';
  if(!form.checkValidity()){msg.textContent='Please complete all required checkout fields.';msg.classList.add('error');form.reportValidity();return;}
  const total=$('#cartTotal').textContent;const name=new FormData(form).get('name').split(' ')[0];
  $('#checkoutFormWrap').hidden=true;$('#successState').hidden=false;$('#successText').textContent=`Thanks, ${name}. Your demo order for ${total} has been reserved in this preview.`;
  state.cart=[];state.promo=null;updateCart();form.reset();
}
function submitNewsletter(e){
  e.preventDefault();const input=$('#newsletterEmail');const msg=$('#newsletterMessage');msg.className='form-message';
  if(!input.checkValidity()){msg.textContent='Enter a valid email to join the list.';msg.classList.add('error');input.focus();return;}
  msg.textContent='Welcome to the member list. Watch for the next drop note.';msg.classList.add('success');input.value='';showToast('You joined the list');
}
function resetFilters(){state.category='All';state.search='';state.sort='featured';$('#searchInput').value='';$('#sortSelect').value='featured';renderFilters();renderProducts();}
function toggleNav(){setNav(!$('#navLinks').classList.contains('open'));}
function setNav(open){$('#navLinks').classList.toggle('open',open);$('#navToggle').setAttribute('aria-expanded',open?'true':'false');}
let toastTimer;
function showToast(text){clearTimeout(toastTimer);toast.textContent=text;toast.classList.add('show');toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);}
init();