import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginDemoAccount, registerDemoAccount } from "../../utils/demoAuth.js";
import "./Auth.css";

export default function Auth({ mode }) {
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
    <section className="page-section auth-page">
      <div className="container auth-container">
        <div className="panel auth-card">
          <span className="eyebrow">LEARNSPACE · ESPACE ÉTUDIANT</span>
          <h1>{isRegistration ? "Créer ton compte" : "Connexion"}</h1>
          <p className="auth-intro">
            {isRegistration
              ? "Inscris-toi pour accéder à ton espace étudiant."
              : "Connecte-toi pour retrouver ton espace étudiant."}
          </p>

          <form className="auth-form" onSubmit={submit}>
            {isRegistration && (
              <div className="auth-name-fields">
                <label>
                  Prénom
                  <input name="firstName" value={values.firstName} onChange={update} autoComplete="given-name" required />
                </label>
                <label>
                  Nom
                  <input name="lastName" value={values.lastName} onChange={update} autoComplete="family-name" required />
                </label>
              </div>
            )}

            <label>
              Adresse email
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={update}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Mot de passe
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={update}
                autoComplete={isRegistration ? "new-password" : "current-password"}
                minLength={8}
                required
              />
              {isRegistration && <small>Utilise au moins 8 caractères.</small>}
            </label>

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
      </div>
    </section>
  );
}
