const destinations = [
  {name:"Ooty",category:"nature",budget:6000,location:"Tamil Nadu, India"},
  {name:"Kodaikanal",category:"nature",budget:5000,location:"Tamil Nadu, India"},
  {name:"Pondicherry",category:"beach",budget:4500,location:"Puducherry, India"},
  {name:"Madurai",category:"culture",budget:3000,location:"Tamil Nadu, India"},
  {name:"Goa",category:"beach",budget:9000,location:"Goa, India"},
  {name:"Manali",category:"adventure",budget:11000,location:"Himachal Pradesh, India"}
];
let trip = [];
let saved = new Set();
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const toast = (message) => {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(window.__toastTimer); window.__toastTimer = setTimeout(()=>el.classList.remove("show"),2300);
};
function filterCards(category="all", query="") {
  let visible = 0;
  $$(".destination-card").forEach(card => {
    const matchesCategory = category === "all" || card.dataset.category === category;
    const matchesQuery = card.dataset.name.toLowerCase().includes(query.toLowerCase());
    card.hidden = !(matchesCategory && matchesQuery);
    if (!card.hidden) visible++;
  });
  $("#emptyState").hidden = visible !== 0;
}
$$(".filter").forEach(button => button.addEventListener("click", () => {
  $$(".filter").forEach(b=>b.classList.remove("active"));
  button.classList.add("active");
  filterCards(button.dataset.filter, $("#destinationSearch").value.trim());
}));
$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  const category = $("#styleSearch").value;
  $$(".filter").forEach(b=>b.classList.toggle("active", b.dataset.filter===category));
  filterCards(category, $("#destinationSearch").value.trim());
  $("#explore").scrollIntoView({behavior:"smooth"});
  if ($$(".destination-card:not([hidden])").length) toast("Here are places to explore!");
});
function renderTrip() {
  const items = $("#tripItems");
  items.innerHTML = "";
  if (!trip.length) {
    items.innerHTML = '<div class="trip-placeholder">Your selected destinations will appear here.</div>';
    $("#tripTotal").hidden = true; return;
  }
  trip.forEach(name => {
    const place = destinations.find(d=>d.name===name);
    const row = document.createElement("div"); row.className="trip-item";
    const info = document.createElement("div");
    const title = document.createElement("span"); title.textContent=place.name;
    const meta = document.createElement("small"); meta.textContent=`${place.location} · From ₹${place.budget.toLocaleString("en-IN")}`;
    info.append(title,meta);
    const remove = document.createElement("button"); remove.className="remove-trip"; remove.type="button"; remove.textContent="Remove";
    remove.addEventListener("click",()=>{trip=trip.filter(x=>x!==name);renderTrip();});
    row.append(info,remove);items.append(row);
  });
  const total=trip.reduce((sum,name)=>sum+destinations.find(d=>d.name===name).budget,0);
  $("#totalAmount").textContent="₹"+total.toLocaleString("en-IN");
  $("#tripTotal").hidden=false;
}
function addToTrip(name) {
  if (trip.includes(name)) { toast(`${name} is already on your trip board.`); return; }
  trip.push(name); renderTrip(); toast(`${name} added to your trip board.`);
}
$$("[data-add]").forEach(button=>button.addEventListener("click",()=>addToTrip(button.dataset.add)));
$$("[data-save]").forEach(button=>button.addEventListener("click",()=>{
  const name=button.dataset.save;
  if(saved.has(name)){saved.delete(name);button.classList.remove("saved");button.textContent="♡";toast(`${name} removed from saved places.`);}
  else{saved.add(name);button.classList.add("saved");button.textContent="♥";toast(`${name} saved for later.`);}
}));
$("#plannerForm").addEventListener("submit",event=>{
  event.preventDefault();
  const style=$("#tripStyle").value, budget=Number($("#tripBudget").value);
  let matches=destinations.filter(d=>(style==="any"||d.category===style)&&d.budget<=budget);
  if(!matches.length) matches=destinations.filter(d=>style==="any"||d.category===style);
  matches.sort((a,b)=>a.budget-b.budget);
  trip=[...new Set([...trip,...matches.slice(0,3).map(d=>d.name)])];
  renderTrip();
  $("#tripResult").scrollIntoView({behavior:"smooth",block:"center"});
  toast(matches.length?`Found ${Math.min(matches.length,3)} ideas for your trip.`:"Try adjusting your preferences.");
});
$("#clearTrip").addEventListener("click",()=>{trip=[];renderTrip();toast("Trip board cleared.");});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$$('#mainNav a').forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
$("#year").textContent=new Date().getFullYear();
renderTrip();