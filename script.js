const STORAGE_KEY = "campuscare-reports-v1";
const starterReports = [
  {id:1,title:"Wi-Fi connection issue in library",category:"Wi-Fi & Technology",location:"Central Library",status:"In progress",date:"Today"},
  {id:2,title:"Water cooler needs maintenance",category:"Water & Electricity",location:"Academic Block",status:"Open",date:"Today"},
  {id:3,title:"Classroom projector not working",category:"Classroom",location:"Block 25, Room 204",status:"Resolved",date:"Yesterday"},
  {id:4,title:"Cleanliness near common area",category:"Cleanliness",location:"Student Centre",status:"In progress",date:"Yesterday"}
];
const symbols = {"Wi-Fi & Technology":"⌁","Hostel":"⌂","Classroom":"▤","Cleanliness":"✧","Water & Electricity":"ϟ","Other":"＋"};
let reports = loadReports();
function loadReports(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):starterReports.slice();}catch(e){return starterReports.slice();}}
function saveReports(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(reports));}catch(e){}}
function updateStats(){
  document.getElementById("totalStat").textContent = 20 + reports.length;
  document.getElementById("progressStat").textContent = reports.filter(r=>r.status==="In progress").length + 6;
  document.getElementById("resolvedStat").textContent = reports.filter(r=>r.status==="Resolved").length + 13;
}
function renderReports(){
  const filter=document.getElementById("filter").value;
  const list=document.getElementById("reportsList");
  list.innerHTML="";
  const filtered=reports.filter(r=>filter==="All"||r.status===filter);
  document.getElementById("emptyState").hidden=filtered.length!==0;
  filtered.slice().reverse().forEach(r=>{
    const item=document.createElement("article");item.className="report-item";
    const symbol=document.createElement("span");symbol.className="report-symbol";symbol.textContent=symbols[r.category]||"＋";
    const info=document.createElement("div");info.className="report-info";
    const title=document.createElement("h3");title.textContent=r.title;
    const meta=document.createElement("p");meta.textContent=`${r.category} · ${r.location}`;
    const status=document.createElement("span");status.className="status "+r.status.replace(" ","-");status.textContent=r.status;
    info.append(title,meta,status);
    const date=document.createElement("span");date.className="report-date";date.textContent=r.date;
    item.append(symbol,info,date);list.append(item);
  });
  updateStats();
}
document.getElementById("issueForm").addEventListener("submit",event=>{
  event.preventDefault();
  const title=document.getElementById("title").value.trim();
  const category=document.getElementById("category").value;
  const location=document.getElementById("location").value.trim();
  const description=document.getElementById("description").value.trim();
  if(!title||!category||!location||!description)return;
  reports.push({id:Date.now(),title,category,location,status:"Open",date:"Just now",description});
  saveReports();renderReports();
  document.getElementById("formMessage").textContent="✓ Report added! It is now visible in Recent reports on this device.";
  event.target.reset();document.getElementById("charCount").textContent="0 / 500 characters";
  document.getElementById("dashboard").scrollIntoView({behavior:"smooth"});
});
document.getElementById("description").addEventListener("input",event=>{
  document.getElementById("charCount").textContent=`${event.target.value.length} / 500 characters`;
});
document.getElementById("filter").addEventListener("change",renderReports);
document.getElementById("demoBtn").addEventListener("click",()=>{
  reports=starterReports.slice();saveReports();renderReports();
  document.getElementById("formMessage").textContent="Demo reports restored.";
  document.getElementById("report").scrollIntoView({behavior:"smooth"});
});
renderReports();