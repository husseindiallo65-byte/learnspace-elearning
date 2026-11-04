import { useState } from "react";
import {
  BadgeCheck,
  Camera,
  FileText,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getProfile, saveProfile } from "../../utils/storage.js";

export default function Profile() {
  const [profile, setProfile] = useState(getProfile());
  const [message, setMessage] = useState("");

  function update(event) {
    setProfile({ ...profile, [event.target.name]: event.target.value });
    setMessage("");
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, photo: reader.result });
      setMessage("");
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = "";
  }

  function submit(event) {
    event.preventDefault();
    saveProfile(profile);
    setMessage("Ton profil a été sauvegardé dans ce navigateur.");
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const initials = `${profile.firstName?.[0] || "É"}${profile.lastName?.[0] || "L"}`.toUpperCase();

  return (
    <section className="page-section profile-page">
      <div className="container profile-container">
        <header className="page-heading profile-page-heading">
          <div className="profile-heading-icon"><UserRound size={23} /></div>
          <div>
            <span className="eyebrow">TON ESPACE PERSONNEL</span>
            <h1>Mon profil</h1>
            <p>Gère tes informations personnelles et personnalise ton espace étudiant.</p>
          </div>
          <span className="profile-heading-badge"><ShieldCheck size={16} /> Espace sécurisé</span>
        </header>

        <div className="profile-layout">
          <aside className="panel profile-card">
            <div className="profile-card-top">
              <span className="profile-card-kicker">PROFIL ÉTUDIANT</span>
              <BadgeCheck size={19} aria-label="Compte étudiant" />
            </div>
            <div className="avatar profile-avatar">
              {profile.photo ? <img src={profile.photo} alt="Photo de profil" /> : initials}
              <label className="photo-upload" htmlFor="profile-photo">
                <Camera size={16} aria-hidden="true" />
                <span className="visually-hidden">Ajouter ou modifier la photo de profil</span>
              </label>
            </div>
            <input
              className="profile-photo-input"
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              aria-label="Ajouter ou modifier la photo de profil"
            />
            <h2>{fullName || "Étudiant LearnSpace"}</h2>
            <span className="pill profile-student-pill"><span /> Étudiant LearnSpace</span>
            {profile.email && (
              <p className="profile-card-email"><Mail size={14} />{profile.email}</p>
            )}
            <div className="profile-card-divider" />
            <div className="profile-local-note">
              <ShieldCheck size={17} />
              <p>Tes informations restent enregistrées dans le stockage local de ce navigateur.</p>
            </div>
          </aside>

          <form className="panel profile-form" onSubmit={submit}>
            <div className="profile-form-heading">
              <div className="profile-form-heading-icon"><UserRound size={19} /></div>
              <div>
                <span className="eyebrow">MES COORDONNÉES</span>
                <h2>Informations personnelles</h2>
                <p>Garde ton profil à jour pour personnaliser ton expérience d’apprentissage.</p>
              </div>
            </div>

            <div className="form-grid">
              <label>
                <span><UserRound size={14} /> Prénom</span>
                <input name="firstName" value={profile.firstName} onChange={update} required placeholder="Saisis ton prénom" autoComplete="given-name" />
              </label>
              <label>
                <span><UserRound size={14} /> Nom</span>
                <input name="lastName" value={profile.lastName} onChange={update} required placeholder="Saisis ton nom" autoComplete="family-name" />
              </label>
              <label>
                <span><Mail size={14} /> Adresse e-mail</span>
                <input type="email" name="email" value={profile.email} onChange={update} placeholder="toi@exemple.com" autoComplete="email" />
              </label>
              <label>
                <span><Phone size={14} /> Téléphone</span>
                <input name="phone" value={profile.phone} onChange={update} placeholder="+221 ..." autoComplete="tel" />
              </label>
              <label className="full-field">
                <span><FileText size={14} /> À propos de moi</span>
                <textarea name="bio" value={profile.bio} onChange={update} rows="4" placeholder="Parle un peu de toi et de tes objectifs..." />
                <small>Présente-toi en quelques mots ou partage tes objectifs d’apprentissage.</small>
              </label>
            </div>

            <div className="profile-form-footer">
              <p className="form-note"><ShieldCheck size={15} /> Tes modifications ne sont enregistrées qu’après validation.</p>
              <button className="profile-save-button" type="submit"><Save size={16} /> Sauvegarder le profil</button>
            </div>
            {message && <p className="success-message profile-success-message" role="status">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
