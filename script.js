// Número de WhatsApp: placeholder conforme solicitado. Substitua "." pelo seu número (apenas dígitos) quando quiser.
const RAW_WA_NUMBER = "11994397776"; // Seu número sem DDI
function normalizeNumber(n){
  const digits = (n||"").replace(/\D/g, "");
  if(digits.startsWith("55")) return digits; // já tem DDI BR
  return "55" + digits; // adiciona DDI BR por padrão
}
const WA_NUMBER = normalizeNumber(RAW_WA_NUMBER);
function waUrl(message){
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
}

// Atualiza os cliques dos links do WhatsApp para abrir com mensagem pronta
function setupWaLinks(){
  document.querySelectorAll('.wa-link').forEach(a=>{
    const getMsg = () => a.getAttribute('data-message') || "Olá, gostaria de falar com a Auto Peças Online!";
    const url = waUrl(getMsg());
    // Define o link de fallback
    a.setAttribute('href', url);
    a.setAttribute('target','_blank');
    a.setAttribute('rel','noopener');
    // Abre imediatamente ao clicar
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      window.open(waUrl(getMsg()), '_blank', 'noopener');
    });
  });
}

// Navegação suave + fechar menu mobile ao clicar
function setupNav(){
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('menuBtn');
  menuBtn?.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));
  mobileMenu?.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click', ()=> mobileMenu.classList.add('hidden'));
  });
  // Ajuste de offset do header para rolagem
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if(href && href.startsWith('#') && href.length>1){
        const el = document.querySelector(href);
        if(el){
          e.preventDefault();
          const headerH = document.querySelector('header').offsetHeight;
          const top = el.getBoundingClientRect().top + window.pageYOffset - (headerH + 10);
          window.scrollTo({top, behavior:'smooth'});
        }
      }
    });
  });
}

// Galeria overlay
function setupGallery(){
  const overlay = document.getElementById('galleryOverlay');
  const overlayImg = document.getElementById('overlayImg');
  const closeBtn = document.getElementById('closeOverlay');
  document.querySelectorAll('#galeria button img').forEach(img=>{
    img.parentElement.addEventListener('click', ()=>{
      overlayImg.src = img.src;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    });
  });
  function close(){ overlay.classList.add('hidden'); overlay.classList.remove('flex'); overlayImg.src=''; }
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
  document.addEventListener('keydown', (e)=>{ if(!overlay.classList.contains('hidden') && e.key==='Escape') close(); });
}

// Busca e filtro do catálogo
function setupCatalogSearch(){
  const input = document.getElementById('searchInput');
  const filter = document.getElementById('brandFilter');
  const btn = document.getElementById('searchBtn');
  const cards = Array.from(document.querySelectorAll('.category-card'));

  function apply(){
    const term = (input.value||"").trim().toLowerCase();
    const brand = filter.value;
    cards.forEach(card=>{
      const cardBrand = card.getAttribute('data-brand');
      const text = card.innerText.toLowerCase();
      const byBrand = (brand==="Todas") || (brand===cardBrand);
      const byText = term==="" || text.includes(term);
      card.style.display = (byBrand && byText) ? '' : 'none';
    });
  }
  btn.addEventListener('click', apply);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') apply(); });
  filter.addEventListener('change', apply);
}

// Inicialização
document.addEventListener('DOMContentLoaded', ()=>{
  setupWaLinks();
  setupNav();
  setupGallery();
  setupCatalogSearch();
});
