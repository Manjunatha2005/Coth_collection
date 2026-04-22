import { useState, useEffect, useRef, useCallback } from "react";

// Showcase products from your design images
const PRODUCTS = [
  { id: 1, name: "Design 1", image: "/images/1.jpeg", description: "Premium cloth design showcase" },
  { id: 2, name: "Design 2", image: "/images/2.jpg", description: "Contemporary fashion collection" },
  { id: 3, name: "Design 3", image: "/images/3.jpeg", description: "Elegant design piece" },
  { id: 4, name: "Design 4", image: "/images/4.jpg", description: "Modern aesthetic" },
  { id: 5, name: "Design 5", image: "/images/5.jpg", description: "Artistic pattern" },
  { id: 6, name: "Design 6", image: "/images/6.jpg", description: "Creative textile" },
  { id: 7, name: "Design 7", image: "/images/7.jpeg", description: "Fashion forward" },
  { id: 8, name: "Design 8", image: "/images/8.jpg", description: "Design excellence" },
  { id: 9, name: "Design 9", image: "/images/9.jpg", description: "Inspired creation" },
  { id: 10, name: "Design 10", image: "/images/10.jpg", description: "Unique collection" },
  { id: 11, name: "Design 11", image: "/images/11.jpg", description: "Signature style" },
  { id: 12, name: "Design 12", image: "/images/12.jpg", description: "Premium selection" },
  { id: 13, name: "Design 13", image: "/images/13.jpg", description: "Artistic vision" },
  { id: 14, name: "Design 14", image: "/images/14.jpg", description: "Design innovation" },
  { id: 15, name: "Design 15", image: "/images/15.jpg", description: "Creative expression" },
  { id: 16, name: "Design 16", image: "/images/16.jpg", description: "Masterpiece collection" },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    @import url('"'"'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap'"'"');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #faf8f5; --bg2: #f0ece4; --bg3: #e8e0d5;
      --text: #0d0d0d; --text2: #3a3632; --text3: #7a6f64;
      --gold: #b8935a; --gold-light: #d4a96a; --gold-glow: rgba(184,147,90,0.3);
      --cyan: #00c8aa; --cyan-glow: rgba(0,200,170,0.25);
      --card: rgba(255,255,255,0.7); --card-border: rgba(184,147,90,0.2);
      --glass: rgba(255,255,255,0.55); --glass-border: rgba(255,255,255,0.8);
      --shadow: 0 4px 30px rgba(0,0,0,0.08); --shadow-lg: 0 20px 60px rgba(0,0,0,0.12);
      --transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .dark {
      --bg: #0a0a0a; --bg2: #111111; --bg3: #1a1a16;
      --text: #f5f0e8; --text2: #c8bfb0; --text3: #8a7f72;
      --card: rgba(255,255,255,0.04); --card-border: rgba(184,147,90,0.25);
      --glass: rgba(255,255,255,0.06); --glass-border: rgba(255,255,255,0.12);
      --shadow: 0 4px 30px rgba(0,0,0,0.5); --shadow-lg: 0 20px 60px rgba(0,0,0,0.6);
    }
    html, body, #root { height: 100%; background: var(--bg); }
    body { font-family: '"'"'DM Sans'"'"', sans-serif; color: var(--text); overflow-x: hidden; }
    .font-display { font-family: '"'"'Cormorant Garamond'"'"', serif; }
    .glass { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); }
    .gold-border { border: 1px solid var(--card-border); }
    .card-hover { transition: var(--transition); }
    .card-hover:hover { transform: translateY(-6px) scale(1.01); box-shadow: var(--shadow-lg); }
    .glow-btn { box-shadow: 0 0 20px var(--gold-glow); }
    .glow-btn:hover { box-shadow: 0 0 35px var(--gold-glow), 0 0 60px var(--gold-glow); }
    @keyframes fadeUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .anim-fade-up { animation: fadeUp 0.6s ease forwards; }
    .anim-fade { animation: fadeIn 0.5s ease forwards; }
    .skeleton { background: linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
    input, select, textarea { background: var(--card); border: 1px solid var(--card-border); color: var(--text); font-family: '"'"'DM Sans'"'"', sans-serif; border-radius: 8px; padding: 12px 16px; width: 100%; font-size: 14px; outline: none; transition: var(--transition); }
    input:focus, select:focus, textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-glow); }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }
    .nav-link { position: relative; }
    .nav-link::after { content: '"'"''"'"'; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: var(--gold); transition: width 0.3s ease; }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }
    .product-img { overflow: hidden; }
    .product-img img { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
    .product-img:hover img { transform: scale(1.08); }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); animation: fadeIn 0.3s ease; }
    .modal { background: var(--bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 32px; max-width: 700px; width: 90%; max-height: 85vh; overflow-y: auto; animation: fadeUp 0.35s ease; }
    .hero-section { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0a0a0a 0%, #1a1610 40%, #0d0a08 100%); }
    .category-card { position: relative; overflow: hidden; border-radius: 20px; cursor: pointer; }
    .category-card::before { content: '"'"''"'"'; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); z-index: 1; }
    .category-card img { width: 100%; height: 400px; object-fit: cover; transition: transform 0.6s ease; }
    .category-card:hover img { transform: scale(1.06); }
    .category-label { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 32px; }
    @media (max-width: 768px) {
      .hero-text-lg { font-size: 52px !important; }
      .grid-3 { grid-template-columns: 1fr !important; }
      .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .nav-links { display: none; }
    }
  `;
  document.head.appendChild(style);
};

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  };
  return icons[name] || null;
};

const Btn = ({ children, variant="primary", onClick, style={}, className="" }) => {
  const base = { border:"none", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:"500", letterSpacing:"0.04em", transition:"all 0.3s ease", display:"inline-flex", alignItems:"center", gap:"8px", borderRadius:"8px", fontSize:"14px" };
  const variants = {
    primary: { background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", color:"white", padding:"14px 28px", ...base },
    secondary: { background:"transparent", color:"var(--gold)", border:"1px solid var(--gold)", padding:"13px 27px", ...base },
    ghost: { background:"transparent", color:"var(--text2)", border:"1px solid var(--card-border)", padding:"13px 27px", ...base },
    dark: { background:"#0a0a0a", color:"#f5f0e8", padding:"14px 28px", ...base },
  };
  return (
    <button onClick={onClick} className={`${variant==="primary"?"glow-btn":""} ${className}`} style={{ ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Navbar = ({ page, setPage, darkMode, setDarkMode, isAdminLoggedIn, setIsAdminLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = isAdminLoggedIn
    ? [["home", "Home"], ["adminDashboard", "Admin Dashboard"]]
    : [["home", "Home"], ["gallery", "Gallery"], ["order", "Order"], ["adminLogin", "Admin"]];
  const navItemStyle = {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.06em",
    cursor: "pointer",
    color: page === "home" && !scrolled ? "#f5f0e8" : "var(--text)",
    textTransform: "uppercase",
    paddingBottom: 2,
  };
  const mobileNavItemStyle = {
    padding: "16px 0",
    borderBottom: "1px solid var(--card-border)",
    fontSize: 20,
    fontFamily: "'Cormorant Garamond', serif",
    cursor: "pointer",
    color: "var(--text)",
  };

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setPage("home");
  };

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:999, transition:"all 0.4s ease", padding: scrolled ? "0 40px" : "12px 40px", background: scrolled ? "var(--bg)" : "transparent", borderBottom: scrolled ? "1px solid var(--card-border)" : "none", backdropFilter: scrolled ? "blur(20px)" : "none" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", maxWidth:1400, margin:"0 auto", height:60 }}>
          <div onClick={()=>setPage("home")} style={{ cursor:"pointer" }}>
            <div className="font-display" style={{ fontSize:24, fontWeight:400, letterSpacing:"0.12em", color: page==="home" && !scrolled ? "#f5f0e8" : "var(--text)" }}>COLLECTION</div>
            <div style={{ fontSize:9, letterSpacing:"0.3em", color: page==="home" && !scrolled ? "rgba(245,240,232,0.6)" : "var(--gold)", fontWeight:600, marginTop:-4 }}>DESIGN</div>
          </div>
          <div className="nav-links" style={{ display:"flex", gap:36, alignItems:"center" }}>
            {navItems.map(([p,l]) => (
              <span key={p} onClick={()=>setPage(p)} className={`nav-link ${page===p?"active":""}`} style={navItemStyle}>{l}</span>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {isAdminLoggedIn && (
              <Btn onClick={handleLogout} variant="ghost" style={{ fontSize:11, padding:"8px 16px" }}>
                Logout
              </Btn>
            )}
            <button onClick={()=>setDarkMode(!darkMode)} style={{ background:"none", border:"none", cursor:"pointer", color: page==="home" && !scrolled ? "#f5f0e8" : "var(--text)", padding:"4px", display:"flex" }}>
              <Icon name={darkMode?"sun":"moon"} size={18} />
            </button>
            <button onClick={()=>setMenuOpen(!menuOpen)} className="nav-links" style={{ display:"none", background:"none", border:"none", cursor:"pointer", color:"var(--text)" }}>
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="overlay" onClick={()=>setMenuOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:0, right:0, bottom:0, width:280, background:"var(--bg)", padding:"80px 32px 32px", animation:"fadeIn 0.3s ease" }}>
            {navItems.map(([p,l]) => (
              <div key={p} onClick={()=>{ setPage(p); setMenuOpen(false); }} style={mobileNavItemStyle}>{l}</div>
            ))}
            {isAdminLoggedIn && (
              <div onClick={handleLogout} style={{ padding:"16px 0", borderBottom:"1px solid var(--card-border)", fontSize:20, fontFamily:"'Cormorant Garamond', serif", cursor:"pointer", color:"var(--gold)" }}>Logout</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const ProductCard = ({ product, onView, delay=0 }) => {
  return (
    <div className="card-hover anim-fade-up" style={{ animationDelay:`${delay}ms`, background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:16, overflow:"hidden", position:"relative", backdropFilter:"blur(10px)", cursor:"pointer" }} onClick={onView}>
      <div className="product-img" style={{ position:"relative", height:320, background:"var(--bg2)" }}>
        <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} loading="lazy" />
      </div>
      <div style={{ padding:"20px" }}>
        <div style={{ fontSize:15, fontWeight:500, color:"var(--text)", marginBottom:8, lineHeight:1.4 }}>{product.name}</div>
        <div style={{ fontSize:13, color:"var(--text3)" }}>{product.description}</div>
      </div>
    </div>
  );
};

const DesignModal = ({ product, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(0,0,0,0.1)", border:"none", color:"var(--text)", borderRadius:"50%", width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={16} />
        </button>
        <img src={product.image} alt={product.name} style={{ width:"100%", borderRadius:12, marginBottom:24 }} />
        <h2 className="font-display" style={{ fontSize:32, fontWeight:400, color:"var(--text)", marginBottom:12 }}>{product.name}</h2>
        <p style={{ fontSize:15, color:"var(--text2)", lineHeight:1.8, marginBottom:16 }}>{product.description}</p>
        <p style={{ fontSize:13, color:"var(--text3)" }}>Design #{product.id}</p>
      </div>
    </div>
  );
};

const HomePage = ({ setPage }) => {
  const [blouses, setBlouses] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blouses`)
      .then(res => res.json())
      .then(data => setBlouses(Array.isArray(data) ? data.slice(-4) : []))
      .catch(err => console.error("Error fetching blouses:", err));
  }, []);

  return (
    <div>
      {/* HERO - Home Image */}
      <div className="hero-section" style={{ minHeight:"100vh", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)" }}>
        <img src="/images/HOME.png" alt="Home Showcase" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.1) 50%, rgba(10,10,10,0.3) 100%)" }} />
        <div style={{ position:"relative", zIndex:2, textAlign:"center" }}>
          <Btn onClick={()=>setPage("gallery")} style={{ fontSize:16, padding:"18px 40px", background:"var(--gold)", color:"var(--text)", border:"none", fontWeight:600 }}>
            View Gallery <Icon name="arrow" size={16} />
          </Btn>
        </div>
      </div>

      {/* Featured Designs */}
      <div style={{ maxWidth:1400, margin:"100px auto", padding:"0 40px" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ fontSize:11, letterSpacing:"0.3em", color:"var(--gold)", fontWeight:600, marginBottom:12, textTransform:"uppercase" }}>Featured</div>
          <h2 className="font-display" style={{ fontSize:52, fontWeight:300, color:"var(--text)", lineHeight:1.2 }}>Latest Designs</h2>
        </div>
        <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
          {PRODUCTS.slice(0,4).map((p,i) => (
            <ProductCard key={p.id} product={p} delay={i*80} onView={()=>setPage("gallery")} />
          ))}
        </div>
      </div>

      {/* Latest Blouse Designs */}
      {blouses.length > 0 && (
        <div style={{ maxWidth:1400, margin:"100px auto", padding:"0 40px" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ fontSize:11, letterSpacing:"0.3em", color:"var(--cyan)", fontWeight:600, marginBottom:12, textTransform:"uppercase" }}>New Collection</div>
            <h2 className="font-display" style={{ fontSize:52, fontWeight:300, color:"var(--text)", lineHeight:1.2 }}>Latest Blouse Designs</h2>
          </div>
          <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {blouses.map((blouse, i) => (
              <div key={blouse.id} className="card-hover anim-fade-up" style={{ animationDelay:`${i*80}ms`, background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:16, overflow:"hidden", position:"relative", backdropFilter:"blur(10px)", cursor:"pointer" }} onClick={() => setPage("blouse")}>
                <div className="product-img" style={{ position:"relative", overflow:"hidden", height:200 }}>
                  <img src={blouse.image} alt={blouse.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
                <div style={{ padding:16 }}>
                  <h4 style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:8 }}>{blouse.name}</h4>
                  <p style={{ fontSize:13, color:"var(--text3)", marginBottom:12, lineHeight:1.5 }}>Premium Blouse Collection</p>
                  <div style={{ fontSize:18, fontWeight:600, color:"var(--gold)" }}>₹{Number(blouse.price).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div style={{ background:"var(--bg2)", padding:"100px 40px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:40 }}>
          {[
            { title:"Premium Quality", desc:"Meticulously crafted cloth designs with superior materials" },
            { title:"Unique Aesthetics", desc:"Original designs that stand out in contemporary fashion" },
            { title:"Artistic Vision", desc:"Each piece reflects creativity and design excellence" },
          ].map(item => (
            <div key={item.title}>
              <h3 style={{ fontSize:18, fontWeight:600, color:"var(--text)", marginBottom:12 }}>{item.title}</h3>
              <p style={{ fontSize:14, color:"var(--text3)", lineHeight:1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GalleryPage = ({ setPage }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"var(--bg)" }}>
      <div style={{ background:"var(--bg2)", padding:"60px 40px", borderBottom:"1px solid var(--card-border)" }}>
        <div style={{ maxWidth:1400, margin:"0 auto" }}>
          <div style={{ fontSize:11, letterSpacing:"0.3em", color:"var(--gold)", fontWeight:600, marginBottom:12, textTransform:"uppercase" }}>Collection</div>
          <h1 className="font-display" style={{ fontSize:56, fontWeight:300, color:"var(--text)" }}>Design Gallery</h1>
          <p style={{ fontSize:14, color:"var(--text3)", marginTop:12 }}>Browse our complete collection of premium cloth designs</p>
        </div>
      </div>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"40px" }}>
        <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
          {PRODUCTS.map((p,i) => (
            <div key={p.id} onClick={()=>setSelectedProduct(p)} style={{ cursor:"pointer" }}>
              <ProductCard product={p} delay={i*40} onView={()=>setSelectedProduct(p)} />
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && <DesignModal product={selectedProduct} onClose={()=>setSelectedProduct(null)} />}
    </div>
  );
};

const OrderPage = ({ setPage }) => {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [price, setPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Fetch price when design is selected
  useEffect(() => {
    if (selectedDesign) {
      setLoadingPrice(true);
      fetch(`${API_BASE_URL}/api/settings/prices/${selectedDesign.id}`)
        .then(res => res.json())
        .then(data => {
          setPrice(data.price);
          setLoadingPrice(false);
        })
        .catch(err => {
          console.error('Error fetching price:', err);
          setPrice(5000); // fallback
          setLoadingPrice(false);
        });
    }
  }, [selectedDesign]);

  const subtotal = price ? price : 0;
  const discount = subtotal * 0.05;
  const totalAmount = subtotal - discount;

  const handleSubmit = () => {
    if (!selectedDesign || !customerName || !phone) {
      alert("Please fill all fields");
      return;
    }
    
    // Send order to backend
    const orderData = {
      selectedDesign,
      customerName,
      phone,
      quantity: 1,
      price: price
    };

    fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
      .then(res => res.json())
      .then(data => {
        setSubmitted(true);
        setTimeout(() => {
          setSelectedDesign(null);
          setCustomerName("");
          setPhone("");
          setSubmitted(false);
          setPage("home");
        }, 2000);
      })
      .catch(err => {
        console.error('Error submitting order:', err);
        alert("Error submitting order. Please try again.");
      });
  };

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"var(--bg)" }}>
      <div style={{ background:"var(--bg2)", padding:"60px 40px", borderBottom:"1px solid var(--card-border)" }}>
        <div style={{ maxWidth:1400, margin:"0 auto" }}>
          <div style={{ fontSize:11, letterSpacing:"0.3em", color:"var(--gold)", fontWeight:600, marginBottom:12, textTransform:"uppercase" }}>Custom Order</div>
          <h1 className="font-display" style={{ fontSize:56, fontWeight:300, color:"var(--text)" }}>Place Your Order</h1>
          <p style={{ fontSize:14, color:"var(--text3)", marginTop:12 }}>Select a design and provide your details</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px" }}>
        {submitted ? (
          <div style={{ textAlign:"center", padding:"60px 40px", background:"var(--bg2)", borderRadius:20 }}>
            <div style={{ fontSize:64, marginBottom:20 }}>✓</div>
            <h2 className="font-display" style={{ fontSize:40, fontWeight:300, color:"var(--text)", marginBottom:12 }}>Order Received!</h2>
            <p style={{ fontSize:15, color:"var(--text3)", marginBottom:24 }}>Thank you, {customerName}! We will contact you shortly at {phone}</p>
            <p style={{ fontSize:13, color:"var(--text3)" }}>Order ID: #{Math.floor(Math.random()*100000)}</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:40 }}>
            {/* Design Selection */}
            <div>
              <h3 style={{ fontSize:20, fontWeight:600, color:"var(--text)", marginBottom:24 }}>Step 1: Select Design</h3>
              <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:40 }}>
                {PRODUCTS.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedDesign(p)}
                    style={{
                      cursor:"pointer",
                      borderRadius:12,
                      overflow:"hidden",
                      border: selectedDesign?.id === p.id ? "3px solid var(--gold)" : "1px solid var(--card-border)",
                      transition:"all 0.3s ease",
                      transform: selectedDesign?.id === p.id ? "scale(1.02)" : "scale(1)",
                      background: selectedDesign?.id === p.id ? "rgba(184,147,90,0.1)" : "transparent"
                    }}
                  >
                    <img src={p.image} alt={p.name} style={{ width:"100%", height:160, objectFit:"cover" }} />
                    <div style={{ padding:12, textAlign:"center" }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{p.name}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedDesign && (
                <div style={{ background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:16, padding:24, marginBottom:32 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--gold)", marginBottom:12, textTransform:"uppercase" }}>Selected</div>
                  <img src={selectedDesign.image} alt={selectedDesign.name} style={{ width:"100%", height:240, objectFit:"cover", borderRadius:10, marginBottom:16 }} />
                  <h4 style={{ fontSize:18, fontWeight:600, color:"var(--text)", marginBottom:12 }}>{selectedDesign.name}</h4>
                  <p style={{ fontSize:13, color:"var(--text3)", marginBottom:16 }}>{selectedDesign.description}</p>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div>
              <h3 style={{ fontSize:20, fontWeight:600, color:"var(--text)", marginBottom:24 }}>Step 2: Your Details</h3>
              
              <div style={{ display:"grid", gap:16, marginBottom:32 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", display:"block", marginBottom:8 }}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ width:"100%", padding:"12px 16px", border:"1px solid var(--card-border)", borderRadius:8, background:"var(--card)", color:"var(--text)" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", display:"block", marginBottom:8 }}>Phone *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ width:"100%", padding:"12px 16px", border:"1px solid var(--card-border)", borderRadius:8, background:"var(--card)", color:"var(--text)" }}
                  />
                </div>


              </div>

              {/* Price Summary */}
              <div className="glass gold-border" style={{ borderRadius:16, padding:20, marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, paddingBottom:16, borderBottom:"1px solid var(--card-border)" }}>
                  <span style={{ fontSize:14, color:"var(--text3)" }}>Price per design:</span>
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{loadingPrice ? "Loading..." : `₹${price?.toLocaleString()}`}</span>
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, paddingBottom:12, borderBottom:"1px solid var(--card-border)" }}>
                  <span style={{ fontSize:14, color:"var(--text3)" }}>Subtotal:</span>
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{loadingPrice ? "..." : `₹${subtotal.toLocaleString()}`}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                  <span style={{ fontSize:14, color:"var(--cyan)" }}>5% Discount:</span>
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--cyan)" }}>−₹{discount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:16, borderTop:"2px solid var(--gold)" }}>
                  <span style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Total Amount:</span>
                  <span className="font-display" style={{ fontSize:24, fontWeight:400, color:"var(--gold)" }}>{loadingPrice ? "..." : `₹${totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}`}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display:"flex", gap:12 }}>
                <Btn onClick={() => setPage("gallery")} variant="ghost" style={{ flex:1, justifyContent:"center" }}>Back</Btn>
                <Btn onClick={handleSubmit} style={{ flex:1, justifyContent:"center", opacity: !selectedDesign || !customerName ? 0.6 : 1, cursor: !selectedDesign || !customerName ? "not-allowed" : "pointer" }}>
                  Confirm Order
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPage = ({ setPage }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      {/* Header */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 40px 40px" }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:"0.3em", color:"var(--cyan)", fontWeight:700, marginBottom:12, textTransform:"uppercase" }}>📋 DASHBOARD</div>
          <h2 className="font-display" style={{ fontSize:40, fontWeight:300, color:"var(--text)", marginBottom:8 }}>Customer Orders</h2>
          <p style={{ fontSize:14, color:"var(--text3)" }}>Total: <span style={{ fontWeight:700, color:"var(--cyan)" }}>{orders.length} orders</span></p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 40px 60px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 40px" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
            <p style={{ fontSize:16, color:"var(--text3)" }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ 
            textAlign:"center", 
            padding:"80px 40px", 
            background:"linear-gradient(135deg, var(--gold)15 0%, var(--gold)08 100%)",
            borderRadius:20, 
            border:"1.5px solid var(--card-border)",
            animation:"fadeUp 0.5s ease"
          }}>
            <div style={{ fontSize:56, marginBottom:16 }}>📭</div>
            <p style={{ fontSize:18, fontWeight:600, color:"var(--text)", marginBottom:12 }}>No Orders Yet</p>
            <p style={{ fontSize:14, color:"var(--text3)", marginBottom:24 }}>Start by creating your first order</p>
            <Btn onClick={() => setPage("order")}>Create Order</Btn>
          </div>
        ) : (
          <div style={{ display:"grid", gap:20 }}>
            {orders.map((order, idx) => (
              <div key={order.id} style={{ 
                background:"var(--card)", 
                border:"1.5px solid var(--card-border)", 
                borderRadius:16, 
                padding:32,
                transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                animation:`fadeUp 0.5s ease ${idx*50}ms both`,
                position:"relative",
                overflow:"hidden",
                cursor:"pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(184,147,90,0.15)";
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--card-border)";
              }}>
                <div style={{ position:"absolute", top:-30, right:-30, width:150, height:150, background:"var(--gold)", opacity:0.05, borderRadius:"50%", pointerEvents:"none" }} />
                
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:32, marginBottom:24, position:"relative", zIndex:1 }}>
                  {/* Order ID & Date */}
                  <div style={{ borderRight:"1px solid var(--card-border)", paddingRight:24 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--cyan)", textTransform:"uppercase", marginBottom:12, letterSpacing:"0.1em" }}>🔖 Order ID</div>
                    <div style={{ fontSize:24, fontWeight:700, color:"var(--text)", marginBottom:4 }}>#{order.id}</div>
                    <div style={{ fontSize:12, color:"var(--text3)", fontWeight:500 }}>{new Date(order.timestamp).toLocaleDateString()}</div>
                  </div>

                  {/* Customer Name */}
                  <div style={{ borderRight:"1px solid var(--card-border)", paddingRight:24 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--gold)", textTransform:"uppercase", marginBottom:12, letterSpacing:"0.1em" }}>👤 Customer</div>
                    <div style={{ fontSize:18, fontWeight:700, color:"var(--text)" }}>{order.customerName}</div>
                    <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>Client Profile</div>
                  </div>

                  {/* Phone */}
                  <div style={{ borderRight:"1px solid var(--card-border)", paddingRight:24 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--gold)", textTransform:"uppercase", marginBottom:12, letterSpacing:"0.1em" }}>📱 Phone</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"var(--text)", fontFamily:"'Courier New', monospace" }}>{order.phone}</div>
                  </div>

                  {/* Design */}
                  <div style={{ borderRight:"1px solid var(--card-border)", paddingRight:24 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--gold)", textTransform:"uppercase", marginBottom:12, letterSpacing:"0.1em" }}>🎨 Design</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"var(--text)" }}>{order.designName}</div>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--cyan)", textTransform:"uppercase", marginBottom:12, letterSpacing:"0.1em" }}>💰 Total Amount</div>
                    <div className="font-display" style={{ fontSize:26, fontWeight:400, color:"var(--cyan)" }}>₹{order.totalAmount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop:"1.5px solid var(--card-border)", paddingTop:16, fontSize:11, color:"var(--text3)", fontWeight:500 }}>
                  ⏰ Ordered on {new Date(order.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminSettingsPage = ({ setPage }) => {
  const [designPrices, setDesignPrices] = useState({});
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch all design prices
    fetch(`${API_BASE_URL}/api/settings/prices`)
      .then(res => res.json())
      .then(data => {
        setDesignPrices(data.prices || {});
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching prices:', err);
        setLoading(false);
      });
  }, []);

  const handleUpdatePrice = (designId) => {
    const price = designPrices[designId] || 5000;
    
    if (!adminPassword) {
      setMessage("Please enter admin password");
      return;
    }

    fetch(`${API_BASE_URL}/api/settings/prices/${designId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: parseInt(price), adminPassword })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage(`✓ Design ${designId} price updated!`);
          setTimeout(() => setMessage(""), 2000);
        } else {
          setMessage(data.error || "Failed to update price");
        }
      })
      .catch(err => {
        setMessage("Error updating price");
      });
  };

  const handlePriceChange = (designId, newPrice) => {
    setDesignPrices(prev => ({
      ...prev,
      [designId]: newPrice
    }));
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      {/* Header */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 40px 40px" }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:"0.3em", color:"var(--gold)", fontWeight:700, marginBottom:12, textTransform:"uppercase" }}>⚙ SETTINGS</div>
          <h2 className="font-display" style={{ fontSize:40, fontWeight:300, color:"var(--text)", marginBottom:8 }}>Design Pricing</h2>
          <p style={{ fontSize:14, color:"var(--text3)" }}>Manage individual design prices</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 40px 60px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 40px" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
            <p style={{ fontSize:16, color:"var(--text3)" }}>Loading settings...</p>
          </div>
        ) : (
          <>
            {/* Admin Password Section */}
            <div style={{ background:"linear-gradient(135deg, var(--gold)15 0%, var(--gold)08 100%)", border:"1.5px solid var(--card-border)", borderRadius:16, padding:32, marginBottom:40, animation:"fadeUp 0.5s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ fontSize:28 }}>🔐</div>
                <label style={{ fontSize:12, fontWeight:700, color:"var(--text)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Admin Password Required</label>
              </div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                style={{ width:"100%", maxWidth:400, padding:"14px 18px", border:"1.5px solid var(--card-border)", borderRadius:10, background:"var(--bg)", color:"var(--text)", fontSize:14, fontWeight:500, transition:"all 0.3s ease" }}
              />
              <p style={{ fontSize:11, color:"var(--text3)", marginTop:12, fontWeight:500 }}>🔒 Your password is required to update prices</p>
            </div>

            {/* Message */}
            {message && (
              <div style={{ background: message.includes("✓") ? "rgba(0,200,170,0.15)" : "rgba(255,100,100,0.15)", border: `1.5px solid ${message.includes("✓") ? "var(--cyan)" : "#ff6464"}`, color: message.includes("✓") ? "var(--cyan)" : "#ff6464", padding:16, borderRadius:12, marginBottom:24, fontSize:13, fontWeight:700, animation:"fadeUp 0.3s ease", display:"flex", alignItems:"center", gap:12 }}>
                <span>{message.includes("✓") ? "✓" : "✕"}</span>
                {message}
              </div>
            )}

            {/* Design Prices Grid */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)", textTransform:"uppercase", marginBottom:24, letterSpacing:"0.1em" }}>📊 Set Prices for {PRODUCTS.length} Designs</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:24 }}>
                {PRODUCTS.map((design, idx) => (
                  <div 
                    key={design.id} 
                    style={{ 
                      background:"var(--card)", 
                      border:"1.5px solid var(--card-border)", 
                      borderRadius:16, 
                      padding:24, 
                      overflow:"hidden",
                      animation:`fadeUp 0.5s ease ${idx*30}ms both`,
                      transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position:"relative"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = "0 20px 50px rgba(184,147,90,0.2)";
                      e.currentTarget.style.borderColor = "var(--gold)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }}
                  >
                    <img src={design.image} alt={design.name} style={{ width:"100%", height:180, objectFit:"cover", borderRadius:12, marginBottom:16 }} />
                    
                    <h3 style={{ fontSize:16, fontWeight:700, color:"var(--text)", marginBottom:12 }}>{design.name}</h3>
                    
                    <div style={{ marginBottom:20 }}>
                      <label style={{ fontSize:11, fontWeight:700, color:"var(--gold)", textTransform:"uppercase", display:"block", marginBottom:12, letterSpacing:"0.1em" }}>💵 Price (₹)</label>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:18, color:"var(--gold)" }}>₹</span>
                        <input
                          type="number"
                          value={designPrices[design.id] || 5000}
                          onChange={e => handlePriceChange(design.id, e.target.value)}
                          style={{ flex:1, padding:"12px 14px", border:"1.5px solid var(--card-border)", borderRadius:10, background:"var(--bg)", color:"var(--text)", fontSize:16, fontWeight:700, transition:"all 0.3s ease" }}
                        />
                      </div>
                    </div>

                    <Btn 
                      onClick={() => handleUpdatePrice(design.id)}
                      style={{ width:"100%", justifyContent:"center", fontSize:13, fontWeight:700 }}
                    >
                      Update Price
                    </Btn>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const BlouseDesignerPage = ({ setPage }) => {
  const [blouses, setBlouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [formData, setFormData] = useState({ name: "", price: "", image: "" });
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBlouses();
  }, []);

  const fetchBlouses = () => {
    fetch(`${API_BASE_URL}/api/blouses`)
      .then(res => res.json())
      .then(data => setBlouses(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching blouses:", err));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!adminPassword || adminPassword !== "admin123") {
      setMessage("Invalid admin password");
      return;
    }
    if (!formData.name || !formData.price || !formData.image) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/api/blouses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Response data:", data);
        if (data.success) {
          setMessage("Blouse design uploaded successfully!");
          setFormData({ name: "", price: "", image: "" });
          setAdminPassword("");
          fetchBlouses();
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage(data.error || "Error uploading blouse");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Upload error:", err);
        setMessage("Upload failed: " + err.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px 40px" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--gold)", fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>👗 BLOUSE DESIGNS</div>
          <h2 className="font-display" style={{ fontSize: 40, fontWeight: 300, color: "var(--text)", marginBottom: 8 }}>Design Studio</h2>
          <p style={{ fontSize: 14, color: "var(--text3)" }}>Upload and manage blouse designs</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* Upload Form */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ fontSize: 28 }}>📤</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: 0 }}>Upload New Design</h3>
            </div>
            <div style={{ display: "grid", gap: 20, background: "linear-gradient(135deg, var(--gold)12 0%, var(--gold)05 100%)", border: "1.5px solid var(--card-border)", borderRadius: 16, padding: 32, animation: "fadeUp 0.5s ease" }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 10, letterSpacing: "0.1em" }}>🔐 Admin Password *</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  style={{ width: "100%", padding: "13px 16px", border: "1.5px solid var(--card-border)", borderRadius: 10, background: "var(--bg)", color: "var(--text)", fontSize: 14, fontWeight: 500, transition: "all 0.3s ease" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 10, letterSpacing: "0.1em" }}>👗 Blouse Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Premium Silk Blouse"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "13px 16px", border: "1.5px solid var(--card-border)", borderRadius: 10, background: "var(--bg)", color: "var(--text)", fontSize: 14, fontWeight: 500, transition: "all 0.3s ease" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 10, letterSpacing: "0.1em" }}>💵 Price (₹) *</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, color: "var(--gold)", fontWeight: 700 }}>₹</span>
                  <input
                    type="number"
                    placeholder="e.g., 2999"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    style={{ flex: 1, padding: "13px 16px", border: "1.5px solid var(--card-border)", borderRadius: 10, background: "var(--bg)", color: "var(--text)", fontSize: 14, fontWeight: 700 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 10, letterSpacing: "0.1em" }}>🖼 Upload Image *</label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                    width: "100%", 
                    padding: "16px 16px", 
                    border: "2.5px dashed var(--gold)", 
                    borderRadius: 10, 
                    background: "rgba(184,147,90,0.05)", 
                    color: "var(--gold)", 
                    cursor: "pointer", 
                    fontWeight: 700,
                    fontSize: 14,
                    transition: "all 0.3s ease",
                    letterSpacing: "0.05em"
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = "rgba(184,147,90,0.1)";
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = "rgba(184,147,90,0.05)";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  {formData.image ? "✓ IMAGE SELECTED" : "CHOOSE IMAGE"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </div>
              {message && (
                <div style={{ padding: 14, borderRadius: 10, background: message.includes("success") ? "rgba(0,200,170,0.15)" : "rgba(255,0,0,0.15)", color: message.includes("success") ? "var(--cyan)" : "#ff6b6b", fontSize: 13, fontWeight: 700, animation: "fadeUp 0.3s ease", border: `1.5px solid ${message.includes("success") ? "var(--cyan)" : "#ff6b6b"}` }}>
                  {message.includes("success") ? "✓" : "✕"} {message}
                </div>
              )}
              <Btn onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.6 : 1, fontSize: 13, fontWeight: 700 }}>
                {loading ? "⏳ UPLOADING..." : "📤 UPLOAD DESIGN"}
              </Btn>
            </div>
          </div>

          {/* Latest Designs */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ fontSize: 28 }}>✨</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: 0 }}>Latest Designs</h3>
              <div style={{ background: "var(--gold)", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>{blouses.length}</div>
            </div>
            <div style={{ display: "grid", gap: 16, maxHeight: "700px", overflowY: "auto", paddingRight: "8px" }}>
              {blouses.length > 0 ? (
                blouses.map((blouse, idx) => (
                  <div 
                    key={blouse.id} 
                    style={{ 
                      background: "var(--card)", 
                      border: "1.5px solid var(--card-border)", 
                      borderRadius: 14, 
                      padding: 16, 
                      overflow: "hidden",
                      animation: `fadeUp 0.5s ease ${idx*50}ms both`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(184,147,90,0.2)";
                      e.currentTarget.style.borderColor = "var(--gold)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }}
                  >
                    <img src={blouse.image} alt={blouse.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{blouse.name}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500 }}>Premium Blouse</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cyan)" }}>₹{Number(blouse.price).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 40, textAlign: "center", color: "var(--text3)", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1.5px dashed var(--card-border)" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>No designs yet</p>
                  <p style={{ fontSize: 12 }}>Upload your first design to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLoginPage = ({ setPage, setIsAdminLoggedIn }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!password) {
      setError("Please enter password");
      return;
    }

    setLoading(true);
    // Simulate login check - in production, verify with backend
    setTimeout(() => {
      if (password === "admin123") {
        setIsAdminLoggedIn(true);
        setPage("adminDashboard");
        setPassword("");
        setError("");
      } else {
        setError("Invalid password");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ maxWidth:500, width:"90%", animation:"fadeUp 0.5s ease" }}>
        {/* Admin Logo */}
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ width:100, height:100, margin:"0 auto 32px", background:"linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:48, fontWeight:600, color:"white" }}>⚙</div>
          </div>
          <h1 className="font-display" style={{ fontSize:48, fontWeight:300, color:"var(--text)", marginBottom:12, letterSpacing:"0.05em" }}>ADMIN</h1>
          <p style={{ fontSize:14, color:"var(--text3)" }}>Portal Access Required</p>
        </div>

        {/* Login Form */}
        <div style={{ background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:20, padding:40, boxShadow:"0 20px 60px rgba(0,0,0,0.1)" }}>
          <label style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", display:"block", marginBottom:12 }}>Admin Password</label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyPress={e => e.key === "Enter" && handleLogin()}
            style={{ width:"100%", padding:"14px 16px", border:"1px solid var(--card-border)", borderRadius:8, background:"var(--bg)", color:"var(--text)", fontSize:14, marginBottom:12 }}
          />
          
          {error && (
            <div style={{ background:"rgba(255,100,100,0.1)", border:"1px solid #ff6464", color:"#ff6464", padding:12, borderRadius:8, marginBottom:20, fontSize:13, fontWeight:600 }}>
              {error}
            </div>
          )}

          <Btn 
            onClick={handleLogin} 
            disabled={loading}
            style={{ width:"100%", justifyContent:"center", marginBottom:16, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Verifying..." : "Login"}
          </Btn>

          <Btn 
            onClick={() => setPage("home")} 
            variant="ghost"
            style={{ width:"100%", justifyContent:"center" }}
          >
            Back to Home
          </Btn>
        </div>

        {/* Info Message */}
        <div style={{ textAlign:"center", marginTop:32, fontSize:12, color:"var(--text3)" }}>
          <p>🔒 Only authorized admins can access this area</p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboardNav = ({ adminSection, setAdminSection }) => {
  const sections = [
    { id: "orders", label: "Orders", icon: "📋", color: "#00c8aa" },
    { id: "blouse", label: "Blouse Designs", icon: "👗", color: "#d4a96a" },
    { id: "settings", label: "Settings", icon: "⚙", color: "#b8935a" }
  ];

  return (
    <div style={{ background:"var(--bg2)", borderBottom:"2px solid var(--card-border)", padding:"16px 40px", marginBottom:"40px" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", gap:16 }}>
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setAdminSection(section.id)}
            style={{
              border:"none",
              background: adminSection === section.id ? `linear-gradient(135deg, ${section.color}22 0%, ${section.color}11 100%)` : "transparent",
              color: adminSection === section.id ? section.color : "var(--text3)",
              cursor:"pointer",
              fontSize:13,
              fontWeight:700,
              textTransform:"uppercase",
              padding:"12px 24px",
              borderRadius:"12px",
              transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display:"flex",
              alignItems:"center",
              gap:10,
              letterSpacing:"0.08em",
              boxShadow: adminSection === section.id ? `0 8px 24px ${section.color}20` : "none",
              transform: adminSection === section.id ? "translateY(-2px)" : "translateY(0)",
              border: adminSection === section.id ? `1.5px solid ${section.color}40` : "1px solid transparent"
            }}
          >
            <span style={{ fontSize:18 }}>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = ({ setPage, setIsAdminLoggedIn }) => {
  const [adminSection, setAdminSection] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [blouses, setBlouses] = useState([]);

  useEffect(() => {
    // Fetch orders
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching orders:', err));

    // Fetch blouses
    fetch(`${API_BASE_URL}/api/blouses`)
      .then(res => res.json())
      .then(data => setBlouses(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching blouses:", err));
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const StatCard = ({ icon, label, value, color, trend }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color}12 0%, ${color}05 100%)`,
      border: `1.5px solid ${color}35`,
      borderRadius: "20px",
      padding: "22px 24px",
      flex: 1,
      minWidth: "160px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      animation: "fadeUp 0.5s ease forwards"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = `0 16px 32px ${color}20`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}>
      <div style={{ position: "absolute", top: "-30px", right: "-30px", fontSize: "70px", opacity: "0.08" }}>{icon}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <div style={{ fontSize: "20px" }}>{icon}</div>
        <span style={{ fontSize: "10px", fontWeight: "700", color: color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      </div>
      <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text)", marginBottom: "6px" }}>{value}</div>
      {trend && <div style={{ fontSize: "10px", color: color, fontWeight: "600" }}>{trend}</div>}
    </div>
  );

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"var(--bg)" }}>
      {/* Hero Header */}
      <div style={{ background:"linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", padding:"40px 40px 30px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"300px", height:"300px", background:"rgba(255,255,255,0.1)", borderRadius:"50%", transform:"translate(100px, -100px)" }} />
        <div style={{ maxWidth:1400, margin:"0 auto", position:"relative", zIndex:2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.9)", margin:0, fontWeight:500 }}>Manage your design business with precision</p>
          </div>
          <img src="/icon.png" alt="LuxeStore" style={{ height:70, width:"auto", objectFit:"contain", filter:"brightness(0.95) drop-shadow(0 4px 12px rgba(0,0,0,0.15))", mixBlendMode:"screen", opacity:0.95 }} />
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"32px 40px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:16, position:"relative", zIndex:10 }}>
          <StatCard icon="📋" label="Total Orders" value={orders.length} color="#00c8aa" trend={orders.length > 0 ? "Active sales" : "No sales yet"} />
          <StatCard icon="👗" label="Blouse Designs" value={blouses.length} color="#d4a96a" trend={blouses.length > 0 ? "In collection" : "Add designs"} />
          <StatCard icon="💰" label="Revenue" value={`₹${(totalRevenue/1000).toFixed(0)}K`} color="#b8935a" trend={totalRevenue > 0 ? "From orders" : "No revenue yet"} />
          <StatCard icon="⭐" label="Performance" value="100%" color="#ff9900" trend="All systems" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <AdminDashboardNav adminSection={adminSection} setAdminSection={setAdminSection} />

      {/* Content */}
      <div>
        {adminSection === "orders" && <AdminPage setPage={setPage} />}
        {adminSection === "blouse" && <BlouseDesignerPage setPage={setPage} />}
        {adminSection === "settings" && <AdminSettingsPage setPage={setPage} />}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer style={{ borderTop:"1px solid var(--card-border)", background:"var(--bg2)", padding:"60px 40px" }}>
    <div style={{ maxWidth:1400, margin:"0 auto", textAlign:"center" }}>
      <div className="font-display" style={{ fontSize:28, fontWeight:400, letterSpacing:"0.12em", color:"var(--text)", marginBottom:12 }}>COLLECTION</div>
      <div style={{ fontSize:9, letterSpacing:"0.3em", color:"var(--gold)", fontWeight:600, marginBottom:20 }}>DESIGN</div>
      <p style={{ fontSize:14, color:"var(--text3)", lineHeight:1.8, marginBottom:24 }}>Showcasing premium cloth designs with artistic excellence</p>
      <div style={{ fontSize:12, color:"var(--text3)" }}>© 2025 Design Collection. All designs reserved.</div>
    </div>
  </footer>
);

export default function App() {
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      injectStyles();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = darkMode ? "dark" : "";
  }, [darkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text)", transition:"background 0.4s ease, color 0.4s ease" }}>
      <Navbar page={page} setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} isAdminLoggedIn={isAdminLoggedIn} setIsAdminLoggedIn={setIsAdminLoggedIn} />
      <main>
        {page==="home" && <HomePage setPage={setPage} />}
        {page==="gallery" && <GalleryPage setPage={setPage} />}
        {page==="order" && <OrderPage setPage={setPage} />}
        {page==="adminLogin" && <AdminLoginPage setPage={setPage} setIsAdminLoggedIn={setIsAdminLoggedIn} />}
        {page==="adminDashboard" && isAdminLoggedIn && <AdminDashboard setPage={setPage} setIsAdminLoggedIn={setIsAdminLoggedIn} />}
        {/* Old pages for backward compatibility */}
        {page==="admin" && isAdminLoggedIn && <AdminPage setPage={setPage} />}
        {page==="blouse" && isAdminLoggedIn && <BlouseDesignerPage setPage={setPage} />}
        {page==="settings" && isAdminLoggedIn && <AdminSettingsPage setPage={setPage} />}
      </main>
      <Footer />
    </div>
  );
}
