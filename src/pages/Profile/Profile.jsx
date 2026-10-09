import { useState } from "react";
import { getProfile, saveProfile } from "../../utils/storage.js";

export default function Profile() {
  const [profile, setProfile] = useState(getProfile());
  const [message, setMessage] = useState("");

  function update(event) {
    setProfile({ ...profile, [event.target.name]: event.target.value });
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();
    saveProfile(profile);
    setMessage("Ton profil a été sauvegardé dans ce navigateur.");
  }

  return <section className="page-section"><div className="container profile-container"><div className="page-heading"><span className="eyebrow">TON ESPACE PERSONNEL</span><h1>Mon profil étudiant</h1><p>Modifie tes informations et sauvegarde-les localement.</p></div><div className="profile-layout"><aside className="panel profile-card"><div className="avatar">{(profile.firstName?.[0] || "É").toUpperCase()}{(profile.lastName?.[0] || "L").toUpperCase()}</div><h2>{profile.firstName} {profile.lastName}</h2><p>{profile.email || "Ajoute ton adresse email"}</p><span className="pill">Étudiant LearnSpace</span></aside><form className="panel profile-form" onSubmit={submit}><div className="panel-heading"><div><span className="eyebrow">INFORMATIONS</span><h2>Informations personnelles</h2></div></div><div className="form-grid"><label>Prénom<input name="firstName" value={profile.firstName} onChange={update} required /></label><label>Nom<input name="lastName" value={profile.lastName} onChange={update} required /></label><label>Email<input type="email" name="email" value={profile.email} onChange={update} placeholder="toi@exemple.com" /></label><label>Téléphone<input name="phone" value={profile.phone} onChange={update} placeholder="+221 ..." /></label><label className="full-field">Biographie<textarea name="bio" value={profile.bio} onChange={update} rows="4" placeholder="Parle un peu de toi..." /></label></div>{message && <p className="success-message">✓ {message}</p>}<button className="button button-fill-left button-primary-hover" type="submit"><span>Sauvegarder le profil</span></button><p className="muted-text form-note">Démonstration frontend : les informations sont conservées dans le stockage local de ton navigateur.</p></form></div></div></section>;
}
