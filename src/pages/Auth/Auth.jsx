import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginDemoAccount, registerDemoAccount } from "../../utils/demoAuth.js";
import "./Auth.css";

export default function Auth({ mode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isRegistration = mode === "register";

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isRegistration) {
        await registerDemoAccount(values);
      } else {
        await loginDemoAccount(values);
      }
      navigate(
        location.state?.from
          ? {
              pathname: location.state.from.pathname,
              search: location.state.from.search,
              hash: location.state.from.hash,
            }
          : "/dashboard",
        { replace: true },
      );
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Impossible de terminer l’opération.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={`page-section auth-page ${isRegistration ? "registration-page" : ""}`}>
      <div className="container auth-container">
        <div className="panel auth-card">
          <div className="auth-form-panel">
            <div className="auth-heading">
              <span className="eyebrow">LEARNSPACE · ESPACE ÉTUDIANT</span>
              <h1>{isRegistration ? "Créer ton compte" : "Connexion"}</h1>
              <p className="auth-intro">
                {isRegistration
                  ? "Inscris-toi pour accéder à ton espace étudiant."
                  : "Connecte-toi pour retrouver ton espace étudiant."}
              </p>
            </div>

            <form className="auth-form" onSubmit={submit}>
              {isRegistration && (
                <div className="auth-name-fields">
                  <div className="auth-field">
                    <label htmlFor="auth-first-name">Prénom</label>
                    <input id="auth-first-name" name="firstName" value={values.firstName} onChange={update} autoComplete="given-name" required placeholder="Entre ton prénom" />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="auth-last-name">Nom</label>
                    <input id="auth-last-name" name="lastName" value={values.lastName} onChange={update} autoComplete="family-name" required placeholder="Entre ton nom" />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="auth-email">Adresse email</label>
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={update}
                  autoComplete="email"
                  required
                  placeholder="Entre ton adresse email"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-password">Mot de passe</label>
                <div className="auth-password-wrap">
                  <input
                    placeholder="Entre ton mot de passe"
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={update}
                    autoComplete={isRegistration ? "new-password" : "current-password"}
                    minLength={8}
                    required
                  />
                  <button
                    className="auth-eye"
                    type="button"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword((shown) => !shown)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a14.8 14.8 0 0 1-3.2 4.1M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a9.6 9.6 0 0 0 3-.5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {isRegistration && <small>Utilise au moins 8 caractères.</small>}
              </div>

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button className="button button-fill-left button-primary-hover auth-submit" type="submit" disabled={submitting}>
                <span>{submitting ? "Patiente..." : isRegistration ? "Créer mon compte" : "Se connecter"}</span>
              </button>
            </form>

            <p className="auth-switch">
              {isRegistration ? "Tu as déjà un compte ?" : "Tu n’as pas encore de compte ?"}{" "}
              <Link
                to={isRegistration ? "/connexion" : "/inscription"}
                state={location.state?.from ? { from: location.state.from } : undefined}
              >
                {isRegistration ? "Se connecter" : "S’inscrire"}
              </Link>
            </p>

            <p className="auth-notice">
              Démonstration locale : le compte est enregistré uniquement dans ce navigateur. Ce parcours ne remplace pas une authentification sécurisée par serveur.
            </p>
          </div>

          <aside className="auth-image-panel">
            <img
              src="https://i.ibb.co/fYZcmTMv/pexels-vlada-karpovich-4939640.jpg"
              alt="Image d’illustration de l’espace d’inscription LearnSpace"
            />
            <div className="auth-image-overlay">
              <span>LEARNSPACE</span>
              <h2>Apprends aujourd'hui, construis ton avenir.</h2>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
