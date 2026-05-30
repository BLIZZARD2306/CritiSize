import { useState, useEffect, useRef } from 'react';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  bg: '#0a0a0f', surface: '#111118', surfaceHigh: '#18181f',
  border: '#22222e', accent: '#c8f04a', accentDim: '#a8cc3a',
  accentGlow: 'rgba(200,240,74,0.15)', red: '#ff4d6d',
  blue: '#4d9fff', purple: '#9d7fff', text: '#e8e8f0',
  muted: '#888899', faint: '#333344',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0a0a0f;--surface:#111118;--surfaceHigh:#18181f;--border:#22222e;
    --accent:#c8f04a;--accentDim:#a8cc3a;--accentGlow:rgba(200,240,74,0.15);
    --red:#ff4d6d;--blue:#4d9fff;--purple:#9d7fff;
    --text:#e8e8f0;--muted:#888899;--faint:#333344;
  }
  body { background:var(--bg);color:var(--text);font-family:'Syne',sans-serif;min-height:100vh;overflow-x:hidden; }
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--faint);border-radius:2px}
  .mono{font-family:'DM Mono',monospace}
  body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;opacity:0.4}
  .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(200,240,74,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,240,74,0.03) 1px,transparent 1px);background-size:60px 60px}

  /* NAV */
  .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;height:64px;background:rgba(10,10,15,0.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
  .nav-logo{font-size:1.4rem;font-weight:800;letter-spacing:-0.03em;color:var(--text);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:.5rem}
  .nav-logo span{color:var(--accent)}
  .nav-links{display:flex;gap:.25rem;align-items:center}
  .nav-btn{background:none;border:none;color:var(--muted);font-family:'Syne',sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;padding:.5rem 1rem;border-radius:6px;transition:color .2s,background .2s;letter-spacing:.02em}
  .nav-btn:hover{color:var(--text);background:var(--surfaceHigh)}
  .nav-btn.active{color:var(--accent)}
  .nav-cta{background:var(--accent);color:#0a0a0f;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:700;border:none;cursor:pointer;padding:.5rem 1.25rem;border-radius:6px;transition:opacity .2s;letter-spacing:.02em}
  .nav-cta:hover{opacity:.88}

  /* PAGE */
  .page{position:relative;z-index:1;min-height:100vh;padding-top:64px}

  /* HERO */
  .hero{max-width:900px;margin:0 auto;padding:6rem 2rem 4rem;text-align:center}
  .hero-badge{display:inline-flex;align-items:center;gap:.5rem;background:var(--accentGlow);border:1px solid rgba(200,240,74,.3);color:var(--accent);font-size:.75rem;font-weight:600;padding:.35rem .9rem;border-radius:99px;margin-bottom:2rem;letter-spacing:.08em;text-transform:uppercase}
  .hero-badge::before{content:'◆';font-size:.6rem}
  .hero h1{font-size:clamp(3rem,7vw,5.5rem);font-weight:800;line-height:1.0;letter-spacing:-.04em;margin-bottom:1.5rem}
  .hero h1 em{color:var(--accent);font-style:normal}
  .hero p{font-size:1.1rem;color:var(--muted);line-height:1.7;max-width:560px;margin:0 auto 2.5rem}
  .hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}

  /* BUTTONS */
  .btn-primary{background:var(--accent);color:#0a0a0f;font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;border:none;cursor:pointer;padding:.85rem 2rem;border-radius:8px;transition:opacity .2s,transform .15s;letter-spacing:.01em}
  .btn-primary:hover{opacity:.88;transform:translateY(-1px)}
  .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
  .btn-secondary{background:transparent;color:var(--text);font-family:'Syne',sans-serif;font-weight:600;font-size:.95rem;border:1px solid var(--border);cursor:pointer;padding:.85rem 2rem;border-radius:8px;transition:border-color .2s,background .2s,transform .15s}
  .btn-secondary:hover{border-color:var(--muted);background:var(--surfaceHigh);transform:translateY(-1px)}
  .btn-ghost{background:transparent;color:var(--muted);font-family:'Syne',sans-serif;font-weight:500;font-size:.9rem;border:none;cursor:pointer;padding:.6rem 1rem;border-radius:6px;transition:color .2s,background .2s}
  .btn-ghost:hover{color:var(--text);background:var(--surfaceHigh)}

  /* INPUT MODE TOGGLE */
  .input-mode-toggle{display:flex;gap:.5rem;margin-bottom:1rem}
  .mode-btn{display:flex;align-items:center;gap:.4rem;background:var(--bg);border:1px solid var(--border);color:var(--muted);font-family:'Syne',sans-serif;font-size:.8rem;font-weight:600;padding:.45rem 1rem;border-radius:8px;cursor:pointer;transition:all .2s;letter-spacing:.02em}
  .mode-btn.active{background:var(--accentGlow);border-color:var(--accent);color:var(--accent)}
  .mode-btn:hover:not(.active){border-color:var(--faint);color:var(--text)}

  /* DROP ZONE */
  .drop-zone{border:2px dashed var(--border);border-radius:12px;padding:2.5rem;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;position:relative}
  .drop-zone:hover,.drop-zone.drag-over{border-color:var(--accent);background:var(--accentGlow)}
  .drop-zone-icon{font-size:2rem;margin-bottom:.75rem}
  .drop-zone-text{font-size:.88rem;color:var(--muted);margin-bottom:.5rem}
  .drop-zone-sub{font-size:.75rem;color:var(--faint)}
  .drop-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
  .img-preview{max-width:100%;max-height:200px;border-radius:8px;margin-top:1rem;border:1px solid var(--border)}

  /* EVAL PANEL */
  .eval-panel{max-width:780px;margin:0 auto 5rem;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2.5rem;position:relative;overflow:hidden}
  .eval-panel::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,var(--accentGlow) 0%,transparent 70%);pointer-events:none}
  .eval-label{font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}
  .eval-input-row{display:flex;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}
  .eval-input{flex:1;min-width:220px;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:'DM Mono',monospace;font-size:.9rem;padding:.85rem 1.1rem;border-radius:8px;outline:none;transition:border-color .2s}
  .eval-input:focus{border-color:var(--accent)}
  .eval-input::placeholder{color:var(--faint)}
  .eval-restrict-note{font-size:.78rem;color:var(--muted);margin-top:.75rem;display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}
  .eval-restrict-note a{color:var(--accent);cursor:pointer;text-decoration:underline}

  /* RESULT */
  .result-box{margin-top:1.5rem;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:1.5rem;font-family:'DM Mono',monospace;font-size:.85rem;line-height:1.7;color:var(--text);white-space:pre-wrap;max-height:340px;overflow-y:auto}
  .result-box.loading{color:var(--muted);animation:pulse 1.2s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

  /* CATEGORY RESULT CARDS */
  .cat-results-grid{display:grid;gap:1rem;margin-top:1.5rem}
  .cat-result-card{background:var(--bg);border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:border-color .2s}
  .cat-result-card:hover{border-color:var(--faint)}
  .cat-result-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid var(--border);cursor:pointer}
  .cat-result-title{display:flex;align-items:center;gap:.75rem}
  .cat-result-icon{font-size:1.1rem}
  .cat-result-name{font-size:.9rem;font-weight:700;letter-spacing:.01em}
  .cat-result-right{display:flex;align-items:center;gap:1rem}
  .cat-score-big{font-size:2rem;font-weight:800;letter-spacing:-.04em;line-height:1}
  .cat-score-denom{font-size:.85rem;font-weight:500;color:var(--muted)}
  .cat-chevron{color:var(--muted);font-size:.75rem;transition:transform .2s}
  .cat-chevron.open{transform:rotate(180deg)}
  .cat-result-body{padding:1.25rem;font-family:'DM Mono',monospace;font-size:.83rem;line-height:1.75;color:var(--muted);white-space:pre-wrap;border-top:1px solid var(--faint)}
  .cat-score-bar{height:3px;background:var(--faint);margin-top:.5rem;border-radius:2px;overflow:hidden}
  .cat-score-fill{height:100%;border-radius:2px;transition:width 1s ease}

  /* SCORE OVERVIEW (dashboard big scores) */
  .score-overview{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-top:1.5rem}
  .score-big-card{background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:1.25rem 1rem;text-align:center;position:relative;overflow:hidden;transition:border-color .2s,transform .2s;cursor:pointer}
  .score-big-card:hover{transform:translateY(-2px)}
  .score-big-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,var(--glow,transparent) 0%,transparent 70%);pointer-events:none}
  .score-big-num{font-size:3rem;font-weight:800;letter-spacing:-.06em;line-height:1;margin-bottom:.2rem}
  .score-big-denom{font-size:.85rem;color:var(--muted);margin-bottom:.5rem}
  .score-big-label{font-size:.7rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .score-big-bar{height:4px;background:var(--faint);border-radius:2px;overflow:hidden;margin-top:.75rem}
  .score-big-fill{height:100%;border-radius:2px;transition:width 1.2s ease}

  /* OVERALL SCORE HERO */
  .overall-score-hero{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;text-align:center;margin-bottom:1.5rem;position:relative;overflow:hidden}
  .overall-score-hero::before{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,var(--accentGlow) 0%,transparent 70%);pointer-events:none}
  .overall-label{font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:.75rem}
  .overall-num{font-size:6rem;font-weight:800;letter-spacing:-.06em;line-height:1;color:var(--accent)}
  .overall-denom{font-size:1.5rem;color:var(--muted);font-weight:500}
  .overall-verdict{font-size:1rem;color:var(--muted);margin-top:.75rem;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.6}

  /* FEATURES */
  .features-section{max-width:1060px;margin:0 auto;padding:4rem 2rem}
  .section-header{text-align:center;margin-bottom:3rem}
  .section-header h2{font-size:2.2rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.75rem}
  .section-header p{color:var(--muted);font-size:1rem}
  .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}
  .feature-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem;transition:border-color .2s,transform .2s}
  .feature-card:hover{border-color:var(--accent);transform:translateY(-2px)}
  .feature-icon{font-size:1.5rem;margin-bottom:1rem}
  .feature-card h3{font-size:.95rem;font-weight:700;margin-bottom:.4rem}
  .feature-card p{font-size:.82rem;color:var(--muted);line-height:1.6}

  /* PRICING */
  .pricing-section{max-width:1060px;margin:0 auto;padding:4rem 2rem}
  .pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem}
  .plan-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;position:relative;overflow:hidden;transition:border-color .2s,transform .2s}
  .plan-card.featured{border-color:var(--accent)}
  .plan-card.featured::before{content:'';position:absolute;top:-80px;right:-80px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,var(--accentGlow) 0%,transparent 70%)}
  .plan-badge-top{display:inline-block;background:var(--accent);color:#0a0a0f;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.25rem .6rem;border-radius:4px;margin-bottom:1rem}
  .plan-name{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}
  .plan-price{font-size:2.8rem;font-weight:800;letter-spacing:-.04em;margin-bottom:.25rem}
  .plan-price span{font-size:1rem;font-weight:500;color:var(--muted)}
  .plan-desc{font-size:.82rem;color:var(--muted);margin-bottom:1.5rem}
  .plan-features{list-style:none;margin-bottom:2rem}
  .plan-features li{font-size:.85rem;padding:.4rem 0;color:var(--muted);display:flex;align-items:flex-start;gap:.6rem;border-bottom:1px solid var(--faint)}
  .plan-features li::before{content:'✓';color:var(--accent);font-weight:700;flex-shrink:0;margin-top:.05rem}

  /* AUTH */
  .auth-page{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}
  .auth-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2.5rem;width:100%;max-width:440px;position:relative;overflow:hidden}
  .auth-card::before{content:'';position:absolute;top:-100px;left:-100px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,var(--accentGlow) 0%,transparent 70%);pointer-events:none}
  .auth-title{font-size:1.8rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.5rem}
  .auth-sub{font-size:.85rem;color:var(--muted);margin-bottom:2rem}
  .form-group{margin-bottom:1.1rem}
  .form-label{display:block;font-size:.78rem;font-weight:600;color:var(--muted);margin-bottom:.4rem;letter-spacing:.05em;text-transform:uppercase}
  .form-input{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:'Syne',sans-serif;font-size:.92rem;padding:.8rem 1rem;border-radius:8px;outline:none;transition:border-color .2s}
  .form-input:focus{border-color:var(--accent)}
  .form-input::placeholder{color:var(--faint)}
  .auth-switch{font-size:.83rem;color:var(--muted);text-align:center;margin-top:1.25rem}
  .auth-switch a{color:var(--accent);cursor:pointer;text-decoration:underline}
  .form-error{font-size:.78rem;color:var(--red);margin-top:.4rem}

  /* 2FA OTP */
  .otp-row{display:flex;gap:.6rem;justify-content:center;margin:1.25rem 0}
  .otp-box{width:48px;height:56px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Mono',monospace;font-size:1.4rem;font-weight:700;text-align:center;outline:none;transition:border-color .2s}
  .otp-box:focus{border-color:var(--accent)}
  .otp-step-label{text-align:center;font-size:.78rem;color:var(--muted);margin-bottom:.75rem}
  .otp-resend{text-align:center;font-size:.78rem;color:var(--muted);margin-top:.75rem;cursor:pointer}
  .otp-resend span{color:var(--accent);text-decoration:underline;cursor:pointer}
  .auth-step-indicator{display:flex;align-items:center;gap:.5rem;margin-bottom:1.5rem;justify-content:center}
  .auth-step-dot{width:8px;height:8px;border-radius:50%;background:var(--faint);transition:background .3s}
  .auth-step-dot.active{background:var(--accent)}
  .auth-step-dot.done{background:var(--accentDim)}

  /* DASHBOARD */
  .dashboard{display:flex;min-height:100vh}
  .sidebar{width:240px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);padding:1.5rem 1rem;position:fixed;top:64px;left:0;bottom:0;display:flex;flex-direction:column;gap:.25rem;overflow-y:auto;z-index:50}
  .sidebar-section{font-size:.65rem;font-weight:600;color:var(--faint);letter-spacing:.12em;text-transform:uppercase;padding:.5rem .75rem;margin-top:.5rem}
  .sidebar-item{display:flex;align-items:center;gap:.75rem;padding:.65rem .75rem;border-radius:8px;cursor:pointer;font-size:.88rem;font-weight:500;color:var(--muted);transition:background .15s,color .15s;border:none;background:none;width:100%;text-align:left;font-family:'Syne',sans-serif}
  .sidebar-item:hover{background:var(--surfaceHigh);color:var(--text)}
  .sidebar-item.active{background:var(--accentGlow);color:var(--accent)}
  .sidebar-item .icon{font-size:1rem}
  .dash-content{margin-left:240px;flex:1;padding:2rem 2.5rem}
  .dash-header{margin-bottom:2rem}
  .dash-header h2{font-size:1.6rem;font-weight:800;letter-spacing:-.03em}
  .dash-header p{color:var(--muted);font-size:.88rem;margin-top:.25rem}

  /* EVAL OPTIONS */
  .eval-options{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}
  .eval-option-btn{background:var(--bg);border:1px solid var(--border);color:var(--muted);font-family:'Syne',sans-serif;font-size:.78rem;font-weight:600;padding:.4rem .9rem;border-radius:99px;cursor:pointer;transition:all .15s;letter-spacing:.02em}
  .eval-option-btn.selected{background:var(--accentGlow);border-color:var(--accent);color:var(--accent)}

  /* STATS */
  .stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.25rem}
  .stat-num{font-size:2rem;font-weight:800;letter-spacing:-.04em;color:var(--accent)}
  .stat-label{font-size:.78rem;color:var(--muted);margin-top:.2rem}
  .evaluator-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;margin-bottom:1.5rem}

  /* COMMUNITY */
  .community-grid{display:grid;gap:1rem}
  .post-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem;transition:border-color .2s}
  .post-card:hover{border-color:var(--faint)}
  .post-header{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}
  .post-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:700;flex-shrink:0}
  .post-user{font-weight:600;font-size:.9rem}
  .post-time{font-size:.75rem;color:var(--muted)}
  .post-url{font-family:'DM Mono',monospace;font-size:.78rem;color:var(--accent);margin-bottom:.75rem}
  .post-excerpt{font-size:.84rem;color:var(--muted);line-height:1.6;margin-bottom:1rem}
  .post-scores{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}
  .score-pill{display:flex;align-items:center;gap:.35rem;background:var(--bg);border:1px solid var(--border);padding:.25rem .6rem;border-radius:99px;font-size:.72rem;color:var(--muted)}
  .score-pill b{color:var(--text)}
  .post-actions{display:flex;gap:.5rem}
  .post-action-btn{background:none;border:1px solid var(--border);color:var(--muted);font-family:'Syne',sans-serif;font-size:.78rem;font-weight:600;padding:.35rem .8rem;border-radius:6px;cursor:pointer;transition:all .15s}
  .post-action-btn:hover{border-color:var(--accent);color:var(--accent)}
  .post-action-btn.liked{border-color:var(--accent);color:var(--accent);background:var(--accentGlow)}

  /* PROFILE */
  .profile-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;margin-bottom:1.25rem}
  .profile-avatar{width:72px;height:72px;border-radius:50%;background:var(--accentGlow);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:1.25rem}
  .profile-name{font-size:1.4rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.25rem}
  .profile-email{font-size:.85rem;color:var(--muted);margin-bottom:1.25rem}
  .profile-row{display:flex;justify-content:space-between;align-items:center;padding:.9rem 0;border-bottom:1px solid var(--faint)}
  .profile-row:last-child{border-bottom:none}
  .profile-row-label{font-size:.78rem;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:.06em}
  .profile-row-value{font-size:.9rem;font-weight:600}
  .plan-badge-inline{display:inline-block;padding:.25rem .7rem;border-radius:99px;font-size:.75rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase}

  /* CHANGE PASSWORD */
  .pw-change-form{margin-top:1.25rem;display:flex;flex-direction:column;gap:.9rem}

  /* TOAST */
  .toast{position:fixed;bottom:2rem;right:2rem;z-index:9998;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1rem 1.5rem;font-size:.88rem;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:slideIn .3s ease}
  .toast.success{border-left:3px solid var(--accent)}
  .toast.error{border-left:3px solid var(--red)}
  @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

  /* MODAL */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px)}
  .modal-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2.5rem;width:100%;max-width:500px;position:relative}
  .modal-close{position:absolute;top:1rem;right:1rem;background:none;border:none;color:var(--muted);font-size:1.2rem;cursor:pointer}
  .modal-title{font-size:1.4rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.5rem}
  .modal-sub{font-size:.85rem;color:var(--muted);margin-bottom:1.5rem}

  .divider{height:1px;background:var(--faint);margin:1.5rem 0}

  @media(max-width:768px){
    .sidebar{display:none}
    .dash-content{margin-left:0;padding:1.25rem}
    .nav{padding:0 1rem}
    .hero{padding:4rem 1rem 2rem}
    .hero h1{font-size:2.5rem}
    .otp-box{width:40px;height:48px;font-size:1.2rem}
    .overall-num{font-size:4rem}
  }
`;

// ─── Constants ─────────────────────────────────────────────────────────────────
const PLANS = [
  { id:'free', name:'Observer', price:'0', period:'/mo', desc:'Get a taste — see the verdict, not the detail.', features:['1 evaluation/day','Overall score only','Basic verdict','Community read access'], cta:'Start Free', featured:false },
  { id:'pro', name:'Critic', price:'18', period:'/mo', desc:'Full breakdowns. Every metric. Unlimited.', features:['Unlimited evaluations','All 8 rating categories','Detailed AI feedback','Improvement suggestions','Community posting','Export reports'], cta:'Go Critic', featured:true },
  { id:'agency', name:'Studio', price:'49', period:'/mo', desc:'Team access, client reports, white-label ready.', features:['Everything in Critic','5 team seats','White-label reports','Priority AI queue','API access (soon)','Dedicated support'], cta:'Go Studio', featured:false },
];

const FEATURES = [
  { icon:'🎨', title:'Design Language', desc:'Evaluates visual hierarchy, aesthetic coherence, and overall design system consistency.' },
  { icon:'📐', title:'Spacing & Layout', desc:'Checks padding, margins, alignment, whitespace usage, and grid discipline.' },
  { icon:'🌈', title:'Color Palette', desc:'Analyzes contrast ratios, color harmony, emotional resonance, and brand alignment.' },
  { icon:'✍️', title:'Typography', desc:'Reviews font pairing, sizing scales, readability, and typographic rhythm.' },
  { icon:'🧠', title:'UI/UX Patterns', desc:'Assesses interaction design, navigation clarity, and user flow quality.' },
  { icon:'📝', title:'Copywriting', desc:'Evaluates tone, clarity, CTA effectiveness, and messaging hierarchy.' },
  { icon:'🪟', title:'Morphism Style', desc:'Identifies glassmorphism, neumorphism, or claymorphism usage and execution quality.' },
  { icon:'✨', title:'Animation & Motion', desc:'Reviews transition quality, loading states, scroll effects, and microinteraction design.' },
];

const CAT_ICONS = { Design:'🎨', Spacing:'📐', Colors:'🌈', Typography:'✍️', 'UI/UX':'🧠', Copywriting:'📝', Morphism:'🪟', Animation:'✨' };

const COMMUNITY_POSTS = [
  { id:1, user:'Priya M.', avatar:'🦋', color:'#9d7fff', time:'2h ago', url:'stripe.com', excerpt:'Stripe\'s dashboard shows restraint done right — generous whitespace, exceptional typographic hierarchy. The data density vs breathing room balance is a masterclass.', scores:{ Design:9, Spacing:10, Colors:8, Typography:9 }, likes:42, liked:false, comments:7 },
  { id:2, user:'Alex T.', avatar:'🦊', color:'#4d9fff', time:'5h ago', url:'linear.app', excerpt:'Linear has one of the most underrated dark UIs out there. Micro-animations feel native, not bolted on. Only critique: mobile nav feels like an afterthought.', scores:{ 'UI/UX':9, Animation:9, Spacing:8, Typography:8 }, likes:28, liked:false, comments:4 },
  { id:3, user:'Marco D.', avatar:'🦉', color:'#ff4d6d', time:'1d ago', url:'notion.so', excerpt:'Notion\'s new homepage struggles with color hierarchy — the beige-on-white combinations border on inaccessible. CTA clarity suffers; three competing focal points above the fold.', scores:{ Colors:5, Copywriting:6, Design:6, 'UI/UX':7 }, likes:19, liked:false, comments:12 },
];

const EVAL_CATEGORIES = ['Design','Spacing','Colors','Typography','UI/UX','Copywriting','Morphism','Animation'];

// ─── Utils ──────────────────────────────────────────────────────────────────────
function scoreColor(n) {
  if (n >= 8) return COLORS.accent;
  if (n >= 5) return COLORS.blue;
  return COLORS.red;
}
function scoreGlow(n) {
  if (n >= 8) return 'rgba(200,240,74,0.12)';
  if (n >= 5) return 'rgba(77,159,255,0.12)';
  return 'rgba(255,77,109,0.12)';
}
function getInitials(name = '') { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
function genOTP() { return String(Math.floor(100000 + Math.random() * 900000)); }

// ─── AI Calls ───────────────────────────────────────────────────────────────────
async function callClaude(messages, system = '') {
  const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!API_KEY) {
    throw new Error('Missing API key. Add VITE_ANTHROPIC_API_KEY to .env');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: system || 'You are CritiSize, a ruthlessly honest website design critic. Be constructive and concise.',
      messages,
    }),
  });

  const data = await res.json();
  return data.content?.map(b => b.text || '').join('') || 'No response.';
}

async function freeEval(input, isImage = false) {
  const content = isImage
    ? [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: input.split(',')[1] } }, { type: 'text', text: 'Give a brief honest verdict on this website screenshot in 3-5 sentences — is it generally good or bad and why? Do NOT give numerical scores. End with: \'Sign up for CritiSize Pro for the full 8-category breakdown.\'' }]
    : [{ type: 'text', text: `Give a brief honest overall verdict on "${input}" in 3-5 sentences — is it generally good or bad and why? Do NOT give numerical scores. End with: 'Sign up for CritiSize Pro for the full 8-category breakdown.'` }];

  return callClaude([{ role: 'user', content }], 'You are CritiSize. Be punchy and honest. No markdown headers.');
}

async function fullEval(input, categories, isImage = false) {
  const catList = categories.join(', ');
  const imageBlock = isImage ? [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: input.split(',')[1] } }] : [];
  const textPrompt = `Evaluate ${isImage ? 'this website screenshot' : `the website "${input}"`} across: ${catList}.

For each category use EXACTLY this format:
[CATEGORY] — Score: X/10
[2-3 sentences: what works, what to improve, what's missing]

After all categories:
[OVERALL] — Score: X/10
[One paragraph summary with top 3 actionable recommendations.]`;

  const content = [...imageBlock, { type: 'text', text: textPrompt }];
  return callClaude([{ role: 'user', content }], 'You are CritiSize, expert UI/UX critic. Reference design principles (Gestalt, WCAG, etc.) where relevant. No markdown other than specified format.');
}

function parseScores(text) {
  const scores = {};
  const regex = /\[(.+?)\]\s*[—–-]\s*Score:\s*(\d+)\/10/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m[1].toUpperCase() !== 'OVERALL') scores[m[1]] = parseInt(m[2]);
  }
  return scores;
}

function parseOverall(text) {
  const m = /\[OVERALL\]\s*[—–-]\s*Score:\s*(\d+)\/10\n([\s\S]*?)(?=\[|$)/.exec(text);
  return m ? { score: parseInt(m[1]), verdict: m[2].trim() } : null;
}

function parseCategoryBodies(text) {
  const bodies = {};
  const regex = /\[(.+?)\]\s*[—–-]\s*Score:\s*\d+\/10\n([\s\S]*?)(?=\[|$)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m[1].toUpperCase() !== 'OVERALL') bodies[m[1]] = m[2].trim();
  }
  return bodies;
}

function InputWidget({ onUrl, onImage, url, setUrl, imagePreview, setImagePreview }) {
  const [mode, setMode] = useState('url');
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => { setImagePreview(e.target.result); onImage && onImage(e.target.result); };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="input-mode-toggle">
        <button className={`mode-btn ${mode === 'url' ? 'active' : ''}`} onClick={() => { setMode('url'); setImagePreview(null); }}>
          🔗 URL Link
        </button>
        <button className={`mode-btn ${mode === 'image' ? 'active' : ''}`} onClick={() => setMode('image')}>
          🖼 Upload Image
        </button>
      </div>

      {mode === 'url' && (
        <div className="eval-input-row">
          <input
            className="eval-input"
            placeholder="paste a URL  e.g. stripe.com"
            value={url}
            onChange={e => { setUrl(e.target.value); onUrl && onUrl(e.target.value); }}
          />
        </div>
      )}

      {mode === 'image' && (
        <div
          className={`drop-zone ${drag ? 'drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          {imagePreview ? (
            <img src={imagePreview} alt="preview" className="img-preview" />
          ) : (
            <>
              <div className="drop-zone-icon">🖼</div>
              <div className="drop-zone-text">Drop a screenshot here or click to browse</div>
              <div className="drop-zone-sub">PNG, JPG, WebP — evaluates the visual design directly</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return <div className={`toast ${type}`}>{message}</div>;
}

function OTPInput({ onComplete }) {
  const [vals, setVals] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);

  function handleKey(i, e) {
    if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1]?.focus();
  }
  function handleChange(i, v) {
    const digit = v.replace(/\D/g, '').slice(-1);
    const next = [...vals];
    next[i] = digit;
    setVals(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d)) onComplete(next.join(''));
  }
  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setVals(text.split(''));
      onComplete(text);
    }
  }

  return (
    <div className="otp-row" onPaste={handlePaste}>
      {vals.map((v, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          className="otp-box"
          maxLength={1}
          value={v}
          inputMode="numeric"
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
        />
      ))}
    </div>
  );
}

function Nav({ page, setPage, user }) {
  const isLoggedIn = !!user;
  return (
    <nav className="nav">
      <button className="nav-logo" onClick={() => setPage('home')}>Criti<span>Size</span></button>
      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <button className="nav-btn" onClick={() => setPage('pricing')}>Pricing</button>
            <button className="nav-btn" onClick={() => setPage('login')}>Log in</button>
            <button className="nav-cta" onClick={() => setPage('signup')}>Get Started</button>
          </>
        ) : (
          <>
            <button className={`nav-btn ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>Evaluate</button>
            <button className={`nav-btn ${page === 'community' ? 'active' : ''}`} onClick={() => setPage('community')}>Community</button>
            <button className={`nav-btn ${page === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')}>{getInitials(user.name)}</button>
          </>
        )}
      </div>
    </nav>
  );
}

function FreeEvalPanel({ setPage }) {
  const [url, setUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    const hasInput = imagePreview || url.trim();
    if (!hasInput) return;
    setLoading(true); setResult(null);
    try {
      const r = imagePreview ? await freeEval(imagePreview, true) : await freeEval(url.trim(), false);
      setResult(r);
    } catch (error) {
      setResult(`⚠️ ${error.message || 'Could not reach the AI. Try again in a moment.'}`);
    } finally { setLoading(false); }
  }

  const hasInput = !!(imagePreview || url.trim());

  return (
    <div className="eval-panel">
      <div className="eval-label">Try it free — no account needed</div>
      <InputWidget url={url} setUrl={setUrl} imagePreview={imagePreview} setImagePreview={setImagePreview} />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={run} disabled={loading || !hasInput}>
          {loading ? 'Analyzing…' : 'Evaluate →'}
        </button>
      </div>
      <div className="eval-restrict-note" style={{ marginTop: '.75rem' }}>
        ⚡ Free mode gives a high-level verdict only. <a onClick={() => setPage('signup')}>Sign up for full 8-category scoring.</a>
      </div>
      {loading && <div className="result-box loading">CritiSize is analyzing your submission…</div>}
      {result && !loading && (
        <>
          <div className="result-box">{result}</div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setPage('signup')}>Unlock Full Report →</button>
            <button className="btn-secondary" onClick={() => setPage('pricing')}>View Plans</button>
          </div>
        </>
      )}
    </div>
  );
}

function HomePage({ setPage }) {
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">AI-Powered Design Criticism</div>
        <h1>Your website deserves<br /><em>honest feedback</em></h1>
        <p>CritiSize evaluates your site across 8 design dimensions — Design, Spacing, Colors, Typography, UI/UX, Copywriting, Morphism, and Animation — with ruthlessly constructive AI critique.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage('signup')}>Start for Free</button>
          <button className="btn-secondary" onClick={() => setPage('pricing')}>See Plans</button>
        </div>
      </div>
      <FreeEvalPanel setPage={setPage} />
      <div className="features-section">
        <div className="section-header">
          <h2>Eight lenses. One verdict.</h2>
          <p>Every evaluation runs through a structured critique framework built on real design principles.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingPage({ setPage, user, setUser }) {
  function choosePlan(plan) {
    if (!user) { setPage('signup'); return; }
    setUser(u => ({ ...u, plan: plan.id }));
    setPage('dashboard');
  }

  return (
    <div className="page">
      <div className="pricing-section">
        <div className="section-header"><h2>Pick your plan</h2><p>Start free. Upgrade when you need the full picture.</p></div>
        <div className="pricing-grid">
          {PLANS.map(plan => (
            <div className={`plan-card ${plan.featured ? 'featured' : ''}`} key={plan.id}>
              {plan.featured && <div className="plan-badge-top">Most Popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price === '0' ? 'Free' : `$${plan.price}`} {plan.price !== '0' && <span>{plan.period}</span>}</div>
              <div className="plan-desc">{plan.desc}</div>
              <ul className="plan-features">{plan.features.map(f => <li key={f}>{f}</li>)}</ul>
              <button className={plan.featured ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%' }} onClick={() => choosePlan(plan)}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthPage({ mode, setPage, setUser }) {
  const isLogin = mode === 'login';
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [err, setErr] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpShown, setOtpShown] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [cooldown, setCooldown] = useState(0);

  function validate() {
    if (!form.email || !form.password) { setErr('Please fill all required fields.'); return false; }
    if (!isLogin && !form.name) { setErr('Name is required.'); return false; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return false; }
    if (!isLogin && form.password !== form.confirmPassword) { setErr("Passwords don't match."); return false; }
    return true;
  }

  function sendOTP() {
    const otp = genOTP();
    setGeneratedOTP(otp);
    setOtpShown(otp);
    setCooldown(30);
    const interval = setInterval(() => setCooldown(c => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; }), 1000);
  }

  function submitStep1() {
    setErr('');
    if (!validate()) return;
    sendOTP();
    setStep(2);
  }

  function submitStep2(entered) {
    if (entered !== generatedOTP) { setOtpErr('Incorrect code. Check and try again.'); return; }
    setOtpErr('');
    setUser({
      name: isLogin ? form.email.split('@')[0] : form.name,
      email: form.email,
      password: form.password,
      plan: 'free', evals: 0,
      joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
    setPage('dashboard');
  }

  const stepDots = [1, 2];

  return (
    <div className="auth-page page">
      <div className="auth-card">
        <div className="auth-step-indicator">
          {stepDots.map(s => (
            <div key={s} className={`auth-step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="auth-title">{isLogin ? 'Welcome back' : 'Create account'}</div>
            <div className="auth-sub">{isLogin ? 'Step 1 — Enter your credentials.' : 'Step 1 — Set up your account.'}</div>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Your name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && submitStep1()} />
              </div>
            )}
            {err && <div className="form-error">{err}</div>}
            <div style={{ marginTop: '1.25rem' }}>
              <button className="btn-primary" style={{ width: '100%' }} onClick={submitStep1}>
                Continue →
              </button>
            </div>
            <div className="auth-switch">
              {isLogin ? <>No account? <a onClick={() => setPage('signup')}>Sign up free</a></> : <>Already have one? <a onClick={() => setPage('login')}>Log in</a></>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-title">Verify it's you</div>
            <div className="auth-sub">Step 2 — Enter the 6-digit code sent to <strong>{form.email}</strong></div>
            <div style={{ background: 'var(--accentGlow)', border: '1px solid rgba(200,240,74,.3)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '.7rem', color: 'var(--muted)', marginBottom: '.35rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>Simulated OTP (dev mode)</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '1.8rem', fontWeight: 700, letterSpacing: '.2em', color: 'var(--accent)' }}>{otpShown}</div>
            </div>
            <div className="otp-step-label">Enter code below</div>
            <OTPInput onComplete={submitStep2} />
            {otpErr && <div className="form-error" style={{ textAlign: 'center' }}>{otpErr}</div>}
            <div className="otp-resend">
              {cooldown > 0 ? <span>Resend in {cooldown}s</span> : <span onClick={sendOTP}>Didn't get it? <span>Resend code</span></span>}
            </div>
            <button className="btn-ghost" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setStep(1)}>← Back</button>
          </>
        )}
      </div>
    </div>
  );
}

function CatCard({ name, score, body }) {
  const [open, setOpen] = useState(false);
  const color = scoreColor(score);
  return (
    <div className="cat-result-card" style={{ borderColor: open ? color + '44' : undefined }}>
      <div className="cat-result-header" onClick={() => setOpen(o => !o)}>
        <div className="cat-result-title">
          <span className="cat-result-icon">{CAT_ICONS[name] || '◎'}</span>
          <span className="cat-result-name">{name}</span>
        </div>
        <div className="cat-result-right">
          <div>
            <span className="cat-score-big" style={{ color }}>{score}</span>
            <span className="cat-score-denom">/10</span>
            <div className="cat-score-bar"><div className="cat-score-fill" style={{ width: `${score * 10}%`, background: color }} /></div>
          </div>
          <span className={`cat-chevron ${open ? 'open' : ''}`}>▼</span>
        </div>
      </div>
      {open && body && (
        <div className="cat-result-body">{body}</div>
      )}
    </div>
  );
}

function DashboardPage({ user, setUser, setPage, toast }) {
  const [tab, setTab] = useState('evaluate');
  const [url, setUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCats, setSelectedCats] = useState([...EVAL_CATEGORIES]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({});
  const [bodies, setBodies] = useState({});
  const [overall, setOverall] = useState(null);
  const isPro = user.plan === 'pro' || user.plan === 'agency';

  function toggleCat(cat) {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }

  async function runEval() {
    const hasInput = imagePreview || url.trim();
    if (!hasInput || selectedCats.length === 0) return;
    if (!isPro && (user.evals || 0) >= 1) { toast('Free daily eval used. Upgrade for unlimited!', 'error'); return; }
    setLoading(true); setResult(null); setScores({}); setBodies({}); setOverall(null);
    try {
      const isImage = !!imagePreview;
      const input = isImage ? imagePreview : url.trim();
      const r = await fullEval(input, selectedCats, isImage);
      setResult(r);
      setScores(parseScores(r));
      setBodies(parseCategoryBodies(r));
      setOverall(parseOverall(r));
      setUser(u => ({ ...u, evals: (u.evals || 0) + 1 }));
    } catch (error) {
      setResult(`⚠️ ${error.message || 'Something went wrong. Try again.'}`);
    } finally { setLoading(false); }
  }

  function navTo(key) {
    if (key === 'community' || key === 'profile') { setPage(key); return; }
    setTab(key);
  }

  const sidebarItems = [
    { key: 'evaluate', icon: '◎', label: 'Evaluate' },
    { key: 'history', icon: '📋', label: 'History' },
    { key: 'community', icon: '👥', label: 'Community' },
    { key: 'profile', icon: '👤', label: 'Profile' },
  ];

  const hasInput = !!(imagePreview || url.trim());

  return (
    <div className="page dashboard">
      <div className="sidebar">
        <div className="sidebar-section">Workspace</div>
        {sidebarItems.map(item => (
          <button key={item.key} className={`sidebar-item ${tab === item.key ? 'active' : ''}`} onClick={() => navTo(item.key)}>
            <span className="icon">{item.icon}</span> {item.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {!isPro && (
          <div style={{ background: 'var(--accentGlow)', border: '1px solid rgba(200,240,74,.3)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '.35rem' }}>Upgrade to Critic</div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: '.75rem' }}>Unlimited evals, all categories, community posting.</div>
            <button className="btn-primary" style={{ width: '100%', fontSize: '.8rem', padding: '.5rem' }} onClick={() => setPage('pricing')}>Upgrade $18/mo</button>
          </div>
        )}
      </div>

      <div className="dash-content">
        {tab === 'evaluate' && (
          <>
            <div className="dash-header">
              <h2>Evaluate a Website</h2>
              <p>Paste a URL or upload a screenshot. Choose your categories. Scores are 1–10.</p>
            </div>

            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">{user.evals || 0}</div><div className="stat-label">Evaluations run</div></div>
              <div className="stat-card"><div className="stat-num" style={{ color: COLORS.blue }}>{isPro ? '∞' : `${Math.max(0, 1 - (user.evals || 0))}`}</div><div className="stat-label">{isPro ? 'Unlimited' : 'Free evals left today'}</div></div>
              <div className="stat-card"><div className="stat-num" style={{ color: COLORS.purple }}>{selectedCats.length}</div><div className="stat-label">Categories selected</div></div>
            </div>

            <div className="evaluator-card">
              <div className="eval-label">Website Input</div>
              <InputWidget url={url} setUrl={setUrl} imagePreview={imagePreview} setImagePreview={setImagePreview} />

              <div className="eval-label" style={{ marginTop: '1.5rem' }}>Categories to evaluate</div>
              <div className="eval-options">
                {EVAL_CATEGORIES.map(cat => (
                  <button key={cat} className={`eval-option-btn ${selectedCats.includes(cat) ? 'selected' : ''}`} onClick={() => toggleCat(cat)}>
                    {CAT_ICONS[cat]} {cat}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={runEval} disabled={loading || !hasInput || selectedCats.length === 0}>
                  {loading ? 'Analyzing…' : 'Run Evaluation →'}
                </button>
                {result && <button className="btn-secondary" onClick={() => { setResult(null); setScores({}); setBodies({}); setOverall(null); }}>Clear</button>}
              </div>
            </div>

            {loading && (
              <div className="evaluator-card">
                <div className="result-box loading" style={{ border: 'none', padding: 0 }}>
                  <div>◎ CritiSize is tearing through your submission…</div>
                  <div>Evaluating: {selectedCats.join(', ')}…</div>
                </div>
              </div>
            )}

            {overall && !loading && (
              <div className="overall-score-hero">
                <div className="overall-label">Overall Score</div>
                <div>
                  <span className="overall-num" style={{ color: scoreColor(overall.score) }}>{overall.score}</span>
                  <span className="overall-denom">/10</span>
                </div>
                {overall.verdict && <div className="overall-verdict">{overall.verdict}</div>}
              </div>
            )}

            {Object.keys(scores).length > 0 && !loading && (
              <div className="evaluator-card">
                <div className="eval-label" style={{ marginBottom: '1rem' }}>Category Scores</div>
                <div className="score-overview">
                  {Object.entries(scores).map(([cat, score]) => (
                    <div key={cat} className="score-big-card" style={{ '--glow': scoreGlow(score) }}
                      onClick={() => document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth' })}>
                      <div className="score-big-num" style={{ color: scoreColor(score) }}>{score}</div>
                      <div className="score-big-denom">/10</div>
                      <div className="score-big-label">{cat}</div>
                      <div className="score-big-bar"><div className="score-big-fill" style={{ width: `${score * 10}%`, background: scoreColor(score) }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(scores).length > 0 && !loading && (
              <div className="evaluator-card">
                <div className="eval-label" style={{ marginBottom: '1rem' }}>Detailed Breakdown — click any card to expand</div>
                <div className="cat-results-grid">
                  {Object.entries(scores).map(([cat, score]) => (
                    <div id={`cat-${cat}`} key={cat}>
                      <CatCard name={cat} score={score} body={bodies[cat]} />
                    </div>
                  ))}
                </div>
                {isPro && (
                  <button className="btn-secondary" style={{ marginTop: '1.25rem' }} onClick={() => {
                    const blob = new Blob([`CritiSize Evaluation Report\nURL: ${url || '(image)'}\nDate: ${new Date().toLocaleDateString()}\n\n${result}`], { type: 'text/plain' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `criticize-report.txt`; a.click();
                  }}>↓ Export Report</button>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'history' && (
          <div>
            <div className="dash-header"><h2>Evaluation History</h2><p>Your past evaluations.</p></div>
            <div className="evaluator-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Your evaluation history will appear here after you run your first eval.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityPage({ user, setPage }) {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitImg, setSubmitImg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const isPro = user && (user.plan === 'pro' || user.plan === 'agency');

  function toggleLike(id) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  }

  async function submitPost() {
    const hasInput = submitImg || submitUrl.trim();
    if (!hasInput) return;
    setSubmitting(true);
    try {
      const isImg = !!submitImg;
      const r = await fullEval(isImg ? submitImg : submitUrl.trim(), ['Design', 'Spacing', 'Colors', 'Typography'], isImg);
      const s = parseScores(r);
      const newPost = {
        id: Date.now(), user: user.name, avatar: '✦', color: COLORS.accent,
        time: 'just now', url: submitImg ? '(image upload)' : submitUrl.trim(),
        excerpt: r.slice(0, 280) + '…', scores: s, likes: 0, liked: false, comments: 0,
      };
      setPosts(prev => [newPost, ...prev]);
      setShowSubmit(false); setSubmitUrl(''); setSubmitImg(null);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="page">
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-.03em' }}>Community Critiques</h2>
            <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginTop: '.25rem' }}>Honest evaluations by CritiSize members.</p>
          </div>
          {user ? (isPro ? (<button className="btn-primary" onClick={() => setShowSubmit(true)}>+ Submit Site</button>) : (<button className="btn-secondary" onClick={() => setPage('pricing')}>Upgrade to Post</button>)) : (<button className="btn-primary" onClick={() => setPage('signup')}>Join to Post</button>)}
        </div>

        {showSubmit && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowSubmit(false)}>
            <div className="modal-box">
              <button className="modal-close" onClick={() => setShowSubmit(false)}>✕</button>
              <div className="modal-title">Submit a Site</div>
              <div className="modal-sub">Paste a URL or upload a screenshot — CritiSize evaluates and posts it.</div>
              <InputWidget url={submitUrl} setUrl={setSubmitUrl} imagePreview={submitImg} setImagePreview={setSubmitImg} />
              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={submitPost} disabled={submitting || (!submitUrl.trim() && !submitImg)}>
                {submitting ? 'Evaluating…' : 'Evaluate & Post →'}
              </button>
            </div>
          </div>
        )}

        <div className="community-grid">
          {posts.map(post => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <div className="post-avatar" style={{ background: post.color + '22', color: post.color }}>{post.avatar}</div>
                <div><div className="post-user">{post.user}</div><div className="post-time">{post.time}</div></div>
              </div>
              <div className="post-url">↗ {post.url}</div>
              <div className="post-excerpt">{post.excerpt}</div>
              <div className="post-scores">
                {Object.entries(post.scores).map(([k, v]) => (
                  <div className="score-pill" key={k}><span>{k}</span><b style={{ color: scoreColor(v) }}>{v}/10</b></div>
                ))}
              </div>
              <div className="post-actions">
                <button className={`post-action-btn ${post.liked ? 'liked' : ''}`} onClick={() => user ? toggleLike(post.id) : setPage('signup')}>◆ {post.likes}</button>
                <button className="post-action-btn">💬 {post.comments}</button>
                <button className="post-action-btn">↗ Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ user, setUser, setPage }) {
  const planInfo = {
    free: { label: 'Observer', color: COLORS.muted, bg: 'var(--faint)' },
    pro: { label: 'Critic', color: COLORS.accent, bg: 'var(--accentGlow)' },
    agency: { label: 'Studio', color: COLORS.purple, bg: 'rgba(157,127,255,0.15)' },
  };
  const pi = planInfo[user.plan] || planInfo.free;
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState('');
  const [pwOk, setPwOk] = useState(false);

  function changePassword() {
    setPwErr(''); setPwOk(false);
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) { setPwErr('All fields required.'); return; }
    if (pwForm.current !== user.password) { setPwErr('Current password is incorrect.'); return; }
    if (pwForm.next.length < 6) { setPwErr('New password must be 6+ characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwErr('New passwords don\'t match.'); return; }
    setUser(u => ({ ...u, password: pwForm.next }));
    setPwOk(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => { setShowPwForm(false); setPwOk(false); }, 2000);
  }

  return (
    <div className="page">
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="dash-header" style={{ marginBottom: '1.5rem' }}><h2>Profile</h2></div>

        <div className="profile-card">
          <div className="profile-avatar">👤</div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="divider" />
          <div className="profile-row"><span className="profile-row-label">Username</span><span className="profile-row-value">{user.name}</span></div>
          <div className="profile-row"><span className="profile-row-label">Email</span><span className="profile-row-value mono" style={{ fontSize: '.82rem' }}>{user.email}</span></div>
          <div className="profile-row"><span className="profile-row-label">Current Plan</span><span className="plan-badge-inline" style={{ background: pi.bg, color: pi.color }}>{pi.label}</span></div>
          <div className="profile-row"><span className="profile-row-label">Member Since</span><span className="profile-row-value">{user.joined}</span></div>
          <div className="profile-row"><span className="profile-row-label">Evaluations</span><span className="profile-row-value">{user.evals || 0} run</span></div>
        </div>

        <div className="profile-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.2rem' }}>Password</div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>Update your account password</div>
            </div>
            <button className="btn-secondary" style={{ padding: '.5rem 1rem', fontSize: '.82rem' }} onClick={() => { setShowPwForm(o => !o); setPwErr(''); setPwOk(false); }}>
              {showPwForm ? 'Cancel' : 'Change'}
            </button>
          </div>

          {showPwForm && (
            <div className="pw-change-form">
              <div className="divider" />
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={pwForm.current}
                  onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={pwForm.next}
                  onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && changePassword()} />
              </div>
              {pwErr && <div className="form-error">{pwErr}</div>}
              {pwOk && <div style={{ fontSize: '.82rem', color: 'var(--accent)', fontWeight: 600 }}>✓ Password updated successfully!</div>}
              <button className="btn-primary" onClick={changePassword} style={{ width: '100%' }}>Update Password</button>
            </div>
          )}
        </div>

        {user.plan === 'free' && (
          <div className="profile-card" style={{ background: 'var(--accentGlow)', borderColor: 'rgba(200,240,74,.3)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '.5rem' }}>Upgrade to Critic</div>
            <div style={{ fontSize: '.84rem', color: 'var(--muted)', marginBottom: '1rem' }}>Unlock all 8 categories, unlimited evaluations, community posting, and export reports.</div>
            <button className="btn-primary" onClick={() => setPage('pricing')}>View Plans →</button>
          </div>
        )}

        <div className="profile-card">
          <button className="btn-ghost" style={{ color: 'var(--red)', width: '100%', textAlign: 'left' }}
            onClick={() => { setUser(null); setPage('home'); }}>
            ← Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [toastData, setToastData] = useState(null);

  function showToast(message, type = 'success') { setToastData({ message, type, id: Date.now() }); }

  useEffect(() => { if (!user && ['dashboard', 'profile'].includes(page)) setPage('login'); }, [page, user]);

  function renderPage() {
    switch (page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'pricing': return <PricingPage setPage={setPage} user={user} setUser={setUser} />;
      case 'login': return <AuthPage mode="login" setPage={setPage} setUser={setUser} />;
      case 'signup': return <AuthPage mode="signup" setPage={setPage} setUser={setUser} />;
      case 'dashboard': return user ? <DashboardPage user={user} setUser={setUser} setPage={setPage} toast={showToast} /> : null;
      case 'community': return <CommunityPage user={user} setPage={setPage} />;
      case 'profile': return user ? <ProfilePage user={user} setUser={setUser} setPage={setPage} /> : null;
      default: return <HomePage setPage={setPage} />;
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="grid-bg" />
      <Nav page={page} setPage={setPage} user={user} />
      {renderPage()}
      {toastData && <Toast key={toastData.id} message={toastData.message} type={toastData.type} onDone={() => setToastData(null)} />}
    </>
  );
}
