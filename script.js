const drivers = [
  {name:"Rahul Kumar", car:"White Swift Dzire", type:"Sedan", area:"Indiranagar", distance:1.2, status:"available", initials:"RK"},
  {name:"Priya Sharma", car:"Blue Hyundai i20", type:"Mini", area:"MG Road", distance:2.1, status:"available", initials:"PS"},
  {name:"Arjun Mehta", car:"Silver Ertiga", type:"SUV", area:"Koramangala", distance:3.4, status:"busy", initials:"AM"},
  {name:"Sneha Rao", car:"Red WagonR", type:"Mini", area:"Domlur", distance:1.8, status:"available", initials:"SR"},
  {name:"Vikram Das", car:"Black Honda City", type:"Sedan", area:"Jayanagar", distance:4.2, status:"available", initials:"VD"},
  {name:"Kiran Nair", car:"Grey Creta", type:"SUV", area:"Whitefield", distance:5.1, status:"busy", initials:"KN"},
  {name:"Meera Iyer", car:"Blue Baleno", type:"Mini", area:"HSR Layout", distance:2.8, status:"available", initials:"MI"},
  {name:"Aman Singh", car:"White Innova", type:"SUV", area:"BTM Layout", distance:6.0, status:"offline", initials:"AS"},
  {name:"Divya P.", car:"Silver Swift", type:"Mini", area:"Malleshwaram", distance:3.9, status:"offline", initials:"DP"},
  {name:"Rohit N.", car:"White Amaze", type:"Sedan", area:"Ulsoor", distance:2.5, status:"busy", initials:"RN"}
];
let rides = 128;
let rideNumber = 1025;

function renderDrivers(){
  const list = document.getElementById("driverList");
  list.innerHTML = drivers.map((d,i)=>`<div class="driver"><div class="driver-avatar">${d.initials}</div><div class="driver-info"><b>${d.name}</b><small>${d.car} · ${d.distance.toFixed(1)} km</small></div><span class="driver-state ${d.status}">${d.status==="available"?"Ready":d.status==="busy"?"On trip":"Offline"}</span></div>`).join("");
  const counts = {available:0,busy:0,offline:0};
  drivers.forEach(d=>counts[d.status]++);
  document.getElementById("fleetAvailable").textContent=counts.available;
  document.getElementById("fleetBusy").textContent=counts.busy;
  document.getElementById("fleetOffline").textContent=counts.offline;
  document.getElementById("availableCars").textContent=counts.available;
  document.getElementById("activeDrivers").textContent=drivers.filter(d=>d.status!=="offline").length;
  const msg = counts.available>=4 ? "Good coverage: enough drivers are ready for new ride requests." : "Low availability: consider moving an idle vehicle into this service area.";
  document.getElementById("balanceMessage").textContent=msg;
}
function scrollToBooking(){document.getElementById("book").scrollIntoView({behavior:"smooth"});document.getElementById("pickup").focus();}
document.getElementById("rideForm").addEventListener("submit",function(e){
  e.preventDefault();
  const pickup=document.getElementById("pickup").value.trim();
  const dropoff=document.getElementById("dropoff").value.trim();
  const type=document.getElementById("rideType").value;
  const passengers=Number(document.getElementById("passengers").value);
  const result=document.getElementById("matchResult");
  const candidates=drivers.filter(d=>d.status==="available" && (type==="Any" || d.type===type) && (d.type==="SUV" || passengers<=4));
  if(!candidates.length){
    result.classList.remove("hidden");
    result.innerHTML="<b>No suitable driver available right now.</b><br>Try another vehicle type or check again in a few minutes.";
    return;
  }
  candidates.sort((a,b)=>a.distance-b.distance);
  const assigned=candidates[0];
  assigned.status="busy";
  const fare=Math.round(70+assigned.distance*18+Math.max(0,passengers-1)*15);
  const id="#CM-"+rideNumber++;
  rides++;
  document.getElementById("totalRides").textContent=rides;
  result.classList.remove("hidden");
  result.innerHTML=`<b>✓ Driver matched successfully!</b><br><strong>${assigned.name}</strong> · ${assigned.car}<br>Pickup: ${escapeText(pickup)}<br>Drop-off: ${escapeText(dropoff)}<br>Estimated pickup: ${Math.max(2,Math.ceil(assigned.distance*2))} min · Estimated fare: ₹${fare}<br><small>Ride ${id} · Matched using nearest-driver logic</small>`;
  const row=document.createElement("tr");
  row.innerHTML=`<td>${id}</td><td>${escapeText(pickup)} → ${escapeText(dropoff)}</td><td>${assigned.name}</td><td>₹${fare}</td><td><span class="status ongoing">Assigned</span></td>`;
  document.getElementById("rideTable").prepend(row);
  renderDrivers();
});
function escapeText(value){return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
renderDrivers();
