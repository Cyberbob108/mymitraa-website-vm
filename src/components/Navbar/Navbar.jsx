import "./Navbar.css";
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import mitraaLogo from "../../assets/logo/fulllogo.svg";
import globe      from "../../assets/images/globe.svg";
import contact    from "../../assets/images/contact.svg";
import search     from "../../assets/images/search.svg";

import Signinmodel from "../Signinmodel/Signinmodel";
import MegaMenu    from "../Megamenu/MegaMenu";
import { useLang } from "../../Context/LanguageContext";

const SLIDE_NAVBAR_COLORS = [
  "rgba(81, 51, 204, 0.18)",
  "rgba(220, 220, 240, 0.82)",
  "rgba(242, 213, 181, 0.82)",
];

const LANGUAGES = [
  { code: "en", label: "English",    native: "English"    },
  { code: "ar", label: "Arabic",     native: "العربية"    },
  { code: "zh", label: "Chinese",    native: "中文"        },
  { code: "nl", label: "Dutch",      native: "Nederlands" },
  { code: "fr", label: "French",     native: "Français"   },
  { code: "de", label: "German",     native: "Deutsch"    },
  { code: "hi", label: "Hindi",      native: "हिन्दी"      },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "it", label: "Italian",    native: "Italiano"   },
  { code: "ja", label: "Japanese",   native: "日本語"      },
  { code: "ko", label: "Korean",     native: "한국어"      },
  { code: "ml", label: "Malayalam",  native: "മലയാളം"     },
  { code: "pl", label: "Polish",     native: "Polski"     },
  { code: "pt", label: "Portuguese", native: "Português"  },
  { code: "ru", label: "Russian",    native: "Русский"    },
  { code: "es", label: "Spanish",    native: "Español"    },
  { code: "sv", label: "Swedish",    native: "Svenska"    },
  { code: "ta", label: "Tamil",      native: "தமிழ்"      },
  { code: "tr", label: "Turkish",    native: "Türkçe"     },
  { code: "uk", label: "Ukrainian",  native: "Українська" },
];

function Navbar({ hidden, slideIndex }) {
  const { changeLang } = useLang();
  const [showModal,          setShowModal]          = useState(false);
  const [menuOpen,           setMenuOpen]           = useState(false);
  const [showMegaMenu,       setShowMegaMenu]       = useState(false);
  const [authUser,           setAuthUser]           = useState(null);
  const [showLogoutConfirm,  setShowLogoutConfirm]  = useState(false);
  const [showLangDropdown,   setShowLangDropdown]   = useState(false);
  const [selectedLang,       setSelectedLang]       = useState("en");

  const langRef    = useRef(null);
  const location   = useLocation();
  const navigate   = useNavigate();

  const isLandingPage  = location.pathname === "/";
  const isAGICountdown = location.pathname === "/agi-countdown";

  const navbarBg = isLandingPage && slideIndex !== undefined
    ? SLIDE_NAVBAR_COLORS[slideIndex] ?? SLIDE_NAVBAR_COLORS[0]
    : isAGICountdown
      ? "#ffffff"
      : undefined;

  /* ── close lang dropdown when clicking outside ── */
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const syncAuth = () => {
    const token = localStorage.getItem("token");
    const name  = localStorage.getItem("userName");
    setAuthUser(token ? { token, name: name || "User" } : null);
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener("userLoggedIn", syncAuth);
    return () => window.removeEventListener("userLoggedIn", syncAuth);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    syncAuth();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    setAuthUser(null);
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleSelectLang = (code) => {
    setSelectedLang(code);
    setShowLangDropdown(false);
    changeLang(code);
  };

  useEffect(() => { setMenuOpen(false);     }, [location]);
  useEffect(() => { setShowMegaMenu(false); }, [location]);

  const activeLang = LANGUAGES.find((l) => l.code === selectedLang);

  return (
    <>
      <header
        className={`navbar ${hidden ? "navbar-hidden" : ""}`}
        style={navbarBg ? { background: navbarBg } : undefined}
      >
        <div className="navbar-container">

          <div className="navbar-left" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <img src={mitraaLogo} alt="MiTRAA Logo" className="logo-full" />
          </div>

          {/* Nav Links */}
          {!isLandingPage && (
            <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

              <div
                className="nav-item"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <NavLink to="/home">What We Do</NavLink>
                {showMegaMenu && (
                  <MegaMenu closeMenu={() => setShowMegaMenu(false)} />
                )}
              </div>

              <NavLink to="/aboutus">Who Are we</NavLink>
              <NavLink to="/careers">Careers</NavLink>
              <NavLink to="/news">News &amp; Events</NavLink>
              <NavLink to="/resourceaugmentation">Resource Augmentation</NavLink>
              <NavLink to="/casestudy">Case Study</NavLink>
              <NavLink to="/portfolio">Portfolio</NavLink>
              <NavLink to="/contact">Contact Us</NavLink>
              <NavLink to="/insights">Insights</NavLink>

              {/* Mobile-only auth */}
              <div className="mobile-auth">
                {authUser ? (
                  <div className="mobile-user-section">
                    <span className="user-greeting">👋 {authUser.name}</span>
                    <button
                      className="logout-btn"
                      onClick={() => { setShowLogoutConfirm(true); setMenuOpen(false); }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div
                    className="mobile-sign-btn"
                    onClick={() => { setShowModal(true); setMenuOpen(false); }}
                  >
                    <img src={contact} alt="signin" />
                    <span>Sign in</span>
                  </div>
                )}
              </div>

            </nav>
          )}

          {/* Desktop right section */}
          <div className="nav-right">
            <div className="icon-circle">
              <img src={search} alt="search" />
            </div>

            {/* 🌐 Globe / Language picker */}
            <div className="lang-wrapper" ref={langRef}>
              <div
                className={`icon-circle ${showLangDropdown ? "icon-circle--active" : ""}`}
                onClick={() => setShowLangDropdown((v) => !v)}
                title="Select language"
              >
                <img src={globe} alt="language" />
              </div>

              {showLangDropdown && (
                <div className="lang-dropdown">
                  <div className="lang-dropdown__header">
                    <span>🌐</span>
                    <span>Select Language</span>
                  </div>
                  <ul className="lang-dropdown__list">
                    {LANGUAGES.map((lang) => (
                      <li
                        key={lang.code}
                        className={`lang-dropdown__item ${selectedLang === lang.code ? "lang-dropdown__item--active" : ""}`}
                        onClick={() => handleSelectLang(lang.code)}
                      >
                        <span className="lang-label">{lang.label}</span>
                        <span className="lang-native">{lang.native}</span>
                        {selectedLang === lang.code && (
                          <span className="lang-check">✓</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="lang-dropdown__footer">
                    {activeLang?.label} selected
                  </div>
                </div>
              )}
            </div>

            {authUser ? (
              <div className="user-section">
                <span className="user-greeting">👋 {authUser.name}</span>
                <button
                  className="logout-btn"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="sign-btn" onClick={() => setShowModal(true)}>
                <img src={contact} alt="signin" />
                <span>Sign in</span>
              </div>
            )}
          </div>

          {/* Hamburger */}
          {!isLandingPage && (
            <div
              className={`menu-toggle ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

        </div>
      </header>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff", borderRadius: "12px",
              padding: "2rem 1.75rem", width: "320px",
              textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
              Sign out?
            </p>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "1.5rem" }}>
              You'll be returned to the home page.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1, padding: "9px", borderRadius: "8px",
                  border: "1px solid #ddd", background: "transparent",
                  fontSize: "14px", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1, padding: "9px", borderRadius: "8px",
                  border: "none", background: "#fee2e2",
                  color: "#b91c1c", fontWeight: 600,
                  fontSize: "14px", cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && <Signinmodel onClose={handleModalClose} />}
    </>
  );
}

export default Navbar;
