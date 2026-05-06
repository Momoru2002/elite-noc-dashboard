let gauge, traffic, usage, resource;

async function load(){
 const r = await fetch('/api/stats');
 const d = await r.json();
 ['hostname','ip','os','cores'].forEach(k=>document.getElementById(k).innerText=d[k]);
 draw(d);
}

function draw(d){
 if(!gauge){
  gauge = new Chart(document.getElementById('gauge'), {
   type:'doughnut',
   data:{labels:['CPU','MEM','DISK'],datasets:[{data:[d.cpu,d.mem,d.disk],backgroundColor:['#22c55e','#eab308','#ef4444']}]}
  });

  traffic = new Chart(document.getElementById('traffic'), {
   type:'bar',
   data:{labels:['Upload','Download'],datasets:[{data:[d.sent,d.recv],backgroundColor:['#3b82f6','#8b5cf6']}]}
  });

  usage = new Chart(document.getElementById('usage'), {
   type:'line',
   data:{labels:d.history.map((_,i)=>i),datasets:[{data:d.history.map(x=>x.cpu)}]}
  });

  resource = new Chart(document.getElementById('resource'), {
   type:'radar',
   data:{labels:['CPU','MEM','DISK'],datasets:[{data:[d.cpu,d.mem,d.disk],backgroundColor:'rgba(59,130,246,.2)'}]}
  });
  return;
 }
 gauge.data.datasets[0].data=[d.cpu,d.mem,d.disk];
 traffic.data.datasets[0].data=[d.sent,d.recv];
 usage.data.datasets[0].data=d.history.map(x=>x.cpu);
 usage.data.labels=d.history.map((_,i)=>i);
 resource.data.datasets[0].data=[d.cpu,d.mem,d.disk];
 [gauge,traffic,usage,resource].forEach(x=>x.update());
}

load();
setInterval(load,2000);
