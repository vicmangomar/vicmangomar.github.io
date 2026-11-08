/* Víctor González 7.0 */
(function(){
'use strict';
document.documentElement.classList.add('js');
/* las entradas del Cuaderno empiezan siempre arriba */
if(document.body&&document.body.classList.contains('article')||/\/cuaderno\//.test(location.pathname)){
  try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
  var toTop=function(){if(location.hash)return;window.scrollTo(0,0);var t=document.getElementById('top');if(t&&t.scrollIntoView)t.scrollIntoView({block:'start'})};
  toTop();window.addEventListener('load',toTop);window.addEventListener('pageshow',toTop);
}
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function(s,c){return (c||document).querySelector(s)}, $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

/* menú móvil */
var burger=$('.burger'), menu=$('#menu');
if(burger){burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',String(o))});
  $$('#menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')})});}

/* barra de progreso */
var prog=$('#prog');
function onScroll(){if(!prog)return;var h=document.documentElement;var p=h.scrollTop/((h.scrollHeight-h.clientHeight)||1);prog.style.width=(p*100).toFixed(1)+'%'}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* pestaña: En pausa… / Actualizado ✓ */
var T=document.title, tm;
document.addEventListener('visibilitychange',function(){
  clearTimeout(tm);
  if(document.hidden){document.title='En pausa… · Víctor González'}
  else{document.title='Actualizado ✓ · Víctor González';tm=setTimeout(function(){document.title=T},1800)}
});

/* aparición al hacer scroll */
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
$$('.rv').forEach(function(el){io?io.observe(el):el.classList.add('in')});

/* contadores */
function countUp(el){
  var raw=el.getAttribute('data-count'); var m=raw.match(/^([^\d]*)([\d.,]+)(.*)$/); if(!m||RM){return}
  var pre=m[1], num=m[2], suf=m[3]; var dec=num.indexOf(',')>-1?num.split(',')[1].length:0;
  var val=parseFloat(num.replace(/\./g,'').replace(',','.')); var t0=null, dur=1200;
  function fmt(v){var s=v.toFixed(dec).split('.');s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return pre+s.join(',')+suf}
  var first=el.firstChild;
  function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur);k=1-Math.pow(1-k,3);first.nodeValue=fmt(val*k);if(k<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
}
var cio=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target)}})},{threshold:.6}):null;
$$('[data-count]').forEach(function(el){cio&&cio.observe(el)});

/* versiones: "Actualizando a la versión X.0…" y el agente que se asoma */
var upd=$('#upd'), updn=$('#upd-n'), last=null, ut;
var vio=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return; var v=e.target.getAttribute('data-v'); e.target.classList.add('seen');
  if(upd&&v!==last&&!RM){last=v;updn.textContent=v;upd.classList.remove('on');void upd.offsetWidth;upd.classList.add('on');clearTimeout(ut);ut=setTimeout(function(){upd.classList.remove('on')},1300)}
})},{threshold:.35}):null;
$$('.ver').forEach(function(el){vio?vio.observe(el):el.classList.add('seen')});

/* ¿Te suena?: mensajes uno a uno con "escribiendo…" */
var chat=$('#chat');
if(chat){
  var msgs=$$('.msg',chat), typing=$('.typing',chat), started=false;
  function show(i){
    if(i>=msgs.length){typing.classList.remove('show');chat.classList.remove('wait');return}
    chat.insertBefore(typing,msgs[i]); typing.classList.add('show');
    setTimeout(function(){msgs[i].style.display='block';typing.classList.remove('show');setTimeout(function(){show(i+1)},250)},RM?0:900);
  }
  if(RM||!('IntersectionObserver' in window)){chat.classList.remove('wait')}
  else{var chio=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!started){started=true;show(0);chio.disconnect()}},{threshold:.3});chio.observe(chat)}
}

/* sistema operativo: misión y visión escribiéndose */
var term=$('#term');
if(term&&!RM&&'IntersectionObserver' in window){
  var vs=$$('.v',term); vs.forEach(function(v){v.textContent=''});
  var tio=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;tio.disconnect();
    var i=0;(function next(){if(i>=vs.length)return;var el=vs[i],s=el.getAttribute('data-type'),k=0;el.classList.add('caret');
      (function ty(){el.textContent=s.slice(0,++k);if(k<s.length)setTimeout(ty,28);else{el.classList.remove('caret');i++;setTimeout(next,300)}})()})()},{threshold:.4});
  tio.observe(term);
}

/* oficina */
var stage=$('#stage');
if(stage&&window.AGENTS){
  var A=window.AGENTS, bDay=$('#b-day'), bNight=$('#b-night'), card=$('#card');
  var VER={"1.0 Sedifa":"v1","2.0 Openservice":"v2","3.0 Licoralia":"v3","4.0 GomarMedia":"v4","5.0 Bella Pilar":"v5","6.0 Looplan":"v6"};
  function setNight(on){stage.classList.toggle('is-night',on);bDay.setAttribute('aria-pressed',String(!on));bNight.setAttribute('aria-pressed',String(on))}
  bDay.onclick=function(){setNight(false)}; bNight.onclick=function(){setNight(true)};
  function tick(){var h=12,m='00';try{var f=new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Madrid',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    h=+f.filter(function(p){return p.type==='hour'})[0].value;m=f.filter(function(p){return p.type==='minute'})[0].value}catch(e){}
    $('#clock').textContent='Sabadell · '+String(h).padStart(2,'0')+':'+m;return h}
  var hr=tick(); setNight(hr>=20||hr<7); setInterval(tick,30000);
  function open(id){var a=A[id];if(!a)return;card.style.setProperty('--c',a.col);
    $('#c-img').src='img/'+id+'-2.webp';$('#c-img').alt=a.name+'IA';
    $('#c-name').innerHTML=a.name+'<span>IA</span>';
    $('#c-role').textContent=a.role+(a.soon?' · en formación':'');
    $('#c-bio').textContent=a.bio;
    $('#c-tags').innerHTML=a.skills.map(function(s){return '<li>'+s+'</li>'}).join('');
    var v=VER[a.era]; $('#c-era').innerHTML='Aprendió en: '+(v?'<a href="#'+v+'">'+a.era+'</a>':a.era);
    card.hidden=false; $$('.spot').forEach(function(s){s.classList.toggle('on',s.getAttribute('data-agent')===id)})}
  $('#c-x').onclick=function(){card.hidden=true;$$('.spot.on').forEach(function(s){s.classList.remove('on')})};
  $$('.spot').forEach(function(s){s.addEventListener('click',function(){open(s.getAttribute('data-agent'))})});
  var sc=$('.scroller'); if(sc.scrollWidth>sc.clientWidth)sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)/2;
  var team=$('#team');
  Object.keys(A).forEach(function(id){var a=A[id];var b=document.createElement('button');b.type='button';b.style.setProperty('--c',a.col);
    b.innerHTML='<img src="img/'+id+'-2.webp" alt="" loading="lazy"><span>'+a.name+'<span>IA</span></span><small>'+a.role+'</small>';
    b.onclick=function(){open(id);stage.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})};team.appendChild(b)});
}

/* mapa */
var map=$('#map'), tip=$('#tip');
if(map&&window.MAPDATA){
  var D=window.MAPDATA, hideT;
  function showTip(g){var d=D[+g.getAttribute('data-i')];var r=map.getBoundingClientRect(),b=g.getBoundingClientRect();
    var vers={v1:'1.0',v2:'2.0',v3:'3.0',v4:'4.0',v5:'5.0',v6:'6.0'};
    tip.innerHTML='<b>'+d.h+'</b><span>'+d.s+'</span>'+(d.u?'<a href="'+d.u+'" target="_blank" rel="noopener">Web oficial ↗</a> · ':'')+'<a href="#'+d.v+'">Versión '+vers[d.v]+' →</a>';
    var x=b.left-r.left+b.width/2, y=b.top-r.top; x=Math.max(130,Math.min(r.width-130,x)); if(y<120){tip.style.transform='translate(-50%,24px)'}else{tip.style.transform=''}
    tip.style.left=x+'px';tip.style.top=y+'px';tip.hidden=false}
  $$('.pt',map).forEach(function(g){
    g.addEventListener('mouseenter',function(){clearTimeout(hideT);showTip(g)});
    g.addEventListener('focus',function(){showTip(g)});
    g.addEventListener('click',function(){showTip(g)});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showTip(g)}});
    g.addEventListener('mouseleave',function(){hideT=setTimeout(function(){tip.hidden=true},700)});
  });
  tip.addEventListener('mouseenter',function(){clearTimeout(hideT)});
  tip.addEventListener('mouseleave',function(){tip.hidden=true});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')tip.hidden=true});
}

/* contacto: email directo, sin terceros */
var mail=$('#mail');
if(mail){var addr=mail.getAttribute('data-u')+'@'+mail.getAttribute('data-d');mail.textContent=addr;mail.href='mailto:'+addr;
  var cp=$('#copy');cp&&cp.addEventListener('click',function(){var ok=function(){cp.textContent='¡Copiado!';setTimeout(function(){cp.textContent='Copiar'},1800)};
    if(navigator.clipboard){navigator.clipboard.writeText(addr).then(ok,function(){window.prompt('Copia el email:',addr)})}else{window.prompt('Copia el email:',addr)}});
}
var form=$('#form'), pop=$('#pop');
if(form&&mail){
  form.addEventListener('input',function(){form.classList.add('is-typing')},{once:true});
  form.addEventListener('submit',function(e){
    e.preventDefault(); var msg=$('#f-msg');
    if(!form.checkValidity()){msg.textContent='Escribe tu nombre y el mensaje, por favor.';var bad=form.querySelector(':invalid');bad&&bad.focus();return}
    var f=form.elements, motivo=f.motivo.value, agenda=(motivo==='Charla'||motivo==='Colaboración');
    var subject='Contacto desde la web · '+motivo+' · '+f.nombre.value;
    var body=f.mensaje.value+'\n\n— '+f.nombre.value+(f.empresa.value?' ('+f.empresa.value+')':'');
    window.location.href=mail.href+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    $('#pop-img').src='img/'+(agenda?'nuria':'sofia')+'-3.webp';
    $('#pop-say').innerHTML=agenda?'<b>NurIA</b>Te he abierto el correo con todo listo. Cuando lo envíes, lo apunto en la agenda de Víctor.':'<b>SofIA</b>Te he abierto el correo con todo listo. Cuando lo envíes, lo pongo en la bandeja de Víctor.';
    pop.classList.add('on');setTimeout(function(){pop.classList.remove('on')},7000);
    msg.innerHTML='¿No se ha abierto tu correo? Escribe a <a href="'+mail.href+'">'+mail.textContent+'</a>.';
  });
}

/* galería: ver en grande */
var lb=$('#lb');
if(lb&&lb.showModal){
  var list=[], cur=0, li=$('#lb-img'), lc=$('#lb-cap');
  function show(i){var g=list[cur=(i+list.length)%list.length];li.src=g.getAttribute('data-src');li.alt=g.getAttribute('data-cap');lc.textContent=g.getAttribute('data-cap')}
  $$('.zoom').forEach(function(z){z.addEventListener('click',function(){list=$$('.zoom',z.closest('.gal'));show(list.indexOf(z));lb.showModal()})});
  $('.lb-x',lb).onclick=function(){lb.close()};$('.lb-p',lb).onclick=function(){show(cur-1)};$('.lb-n',lb).onclick=function(){show(cur+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
}

/* guiño secreto: escribe "vicman" */
var buf='', parade=$('#parade');
if(parade){document.addEventListener('keydown',function(e){
  var t=e.target; if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
  buf=(buf+(e.key||'')).slice(-6).toLowerCase();
  if(buf==='vicman'){parade.classList.add('on');setTimeout(function(){parade.classList.remove('on')},3800)}
})}
})();
