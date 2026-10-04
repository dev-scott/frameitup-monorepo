"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import {
  User,
  Shield,
  Key,
  Bell,
  Save,
  Check,
  Eye,
  EyeOff,
  ShieldAlert,
  LogOut,
  Crown,
  UserCog,
  UserPlus,
  Plus,
  Trash2,
  Lock,
  RefreshCw,
  Power,
  X,
  AlertTriangle,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";

type Tab = "profile" | "security" | "team";
type Role = "super_admin" | "admin" | "manager" | "stock" | "viewer";

const ROLE_CONFIG: Record<
  Role,
  { label: string; color: string; icon: string; desc: string }
> = {
  super_admin: {
    label: "Propriétaire",
    color: "var(--brand-300)",
    icon: "👑",
    desc: "Accès total — toutes les permissions et gestion d'équipe",
  },
  admin: {
    label: "Administrateur",
    color: "var(--info)",
    icon: "🛡️",
    desc: "Gestion complète des commandes, stocks, clients et finances",
  },
  manager: {
    label: "Gestionnaire",
    color: "var(--purple)",
    icon: "📋",
    desc: "Gestion opérationnelle des commandes, stock et clients",
  },
  stock: {
    label: "Magasinier",
    color: "var(--success)",
    icon: "📦",
    desc: "Gestion du catalogue et des mouvements de stock uniquement",
  },
  viewer: {
    label: "Lecture seule",
    color: "var(--text-secondary)",
    icon: "👁️",
    desc: "Consultation générale sans aucun droit de modification",
  },
};

const PERMISSIONS_MAP: Record<string, { label: string; icon: string }> = {
  "dashboard.read":  { label: "Tableau de bord",   icon: "📊" },
  "orders.write":    { label: "Gestion commandes", icon: "📦" },
  "stock.write":     { label: "Gestion stock",     icon: "🗃️" },
  "products.write":  { label: "Gestion produits",  icon: "🏷️" },
  "customers.write": { label: "Gestion clients",   icon: "👥" },
  "finances.write":  { label: "Accès finances",    icon: "💰" },
  "users.manage":    { label: "Gestion équipe",    icon: "🔑" },
  "audit.read":      { label: "Journal d'audit",   icon: "📜" },
};

export default function SettingsPage() {
  const { user, token, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile form
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState("");

  // Team management mutations
  const updateProfileMutation = useMutation(api.mutations.auth.updateProfile);
  const changePasswordMutation = useMutation(api.mutations.auth.changePassword);
  const revokeOthersMutation = useMutation(api.mutations.auth.revokeOtherSessions);

  const createUserMutation = useMutation(api.mutations.users.create);
  const updateUserMutation = useMutation(api.mutations.users.update);
  const resetPasswordMutation = useMutation(api.mutations.users.resetPassword);
  const removeUserMutation = useMutation(api.mutations.users.remove);

  const teamQuery = useQuery(
    api.queries.users.listUsers,
    token && hasPermission("users.manage") ? { sessionToken: token } : "skip"
  );

  // Modal : Ajouter un membre
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberFirst, setNewMemberFirst] = useState("");
  const [newMemberLast, setNewMemberLast] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPass, setNewMemberPass] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<Role>("viewer");
  const [newMemberShowPass, setNewMemberShowPass] = useState(false);
  const [newMemberLoading, setNewMemberLoading] = useState(false);
  const [newMemberError, setNewMemberError] = useState("");

  // Modal : Réinitialiser le mot de passe d'un membre
  const [resetTargetUser, setResetTargetUser] = useState<any | null>(null);
  const [resetTargetPass, setResetTargetPass] = useState("");
  const [resetShowPass, setResetShowPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  // Feedback global
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function showToast(text: string, type: "success" | "error" = "success") {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  }

  const roleConfig = user
    ? ROLE_CONFIG[user.role as Role] ?? ROLE_CONFIG.viewer
    : ROLE_CONFIG.viewer;

  async function handleProfileSave() {
    if (!token || !firstName.trim()) return;
    setProfileSaving(true);
    try {
      await updateProfileMutation({
        sessionToken: token,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setProfileSuccess(true);
      showToast("Profil mis à jour avec succès !");
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      showToast(err?.data?.message ?? "Erreur lors de la mise à jour.", "error");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordChange() {
    if (!token) return;
    setPassError("");
    if (!currentPass || !newPass) {
      setPassError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPass.length < 10 || !/[0-9]/.test(newPass)) {
      setPassError(
        "Le nouveau mot de passe doit contenir au moins 10 caractères avec des chiffres."
      );
      return;
    }
    setPassSaving(true);
    try {
      await changePasswordMutation({
        sessionToken: token,
        currentPassword: currentPass,
        newPassword: newPass,
      });
      setPassSuccess(true);
      setCurrentPass("");
      setNewPass("");
      showToast("Votre mot de passe a été modifié.");
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err: any) {
      setPassError(err?.data?.message ?? "Mot de passe actuel incorrect.");
    } finally {
      setPassSaving(false);
    }
  }

  async function handleRevokeOthers() {
    if (!token) return;
    try {
      await revokeOthersMutation({ sessionToken: token });
      showToast("Toutes les autres sessions ont été révoquées.");
    } catch (err: any) {
      showToast(err?.data?.message ?? "Erreur lors de la révocation.", "error");
    }
  }

  // Handler : Créer un nouveau membre
  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setNewMemberError("");

    if (!newMemberFirst.trim() || !newMemberEmail.trim() || !newMemberPass) {
      setNewMemberError("Veuillez renseigner tous les champs obligatoires.");
      return;
    }
    if (newMemberPass.length < 10 || !/[0-9]/.test(newMemberPass)) {
      setNewMemberError(
        "Le mot de passe doit contenir au moins 10 caractères avec des lettres et des chiffres."
      );
      return;
    }

    setNewMemberLoading(true);
    try {
      await createUserMutation({
        sessionToken: token,
        email: newMemberEmail.trim().toLowerCase(),
        firstName: newMemberFirst.trim(),
        lastName: newMemberLast.trim() || "",
        password: newMemberPass,
        role: newMemberRole,
      });

      showToast(`Compte pour ${newMemberFirst.trim()} créé avec succès !`);
      setShowAddModal(false);
      setNewMemberFirst("");
      setNewMemberLast("");
      setNewMemberEmail("");
      setNewMemberPass("");
      setNewMemberRole("viewer");
    } catch (err: any) {
      setNewMemberError(
        err?.data?.message ?? err?.message ?? "Erreur lors de la création du compte."
      );
    } finally {
      setNewMemberLoading(false);
    }
  }

  // Handler : Réinitialiser mot de passe d'un utilisateur
  async function handleResetPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !resetTargetUser) return;
    setResetError("");

    if (resetTargetPass.length < 10 || !/[0-9]/.test(resetTargetPass)) {
      setResetError(
        "Le mot de passe doit contenir au moins 10 caractères avec des lettres et des chiffres."
      );
      return;
    }

    setResetLoading(true);
    try {
      await resetPasswordMutation({
        sessionToken: token,
        userId: resetTargetUser.id ?? resetTargetUser._id,
        newPassword: resetTargetPass,
      });

      showToast(`Mot de passe réinitialisé pour ${resetTargetUser.firstName}.`);
      setResetTargetUser(null);
      setResetTargetPass("");
    } catch (err: any) {
      setResetError(err?.data?.message ?? "Erreur lors de la réinitialisation.");
    } finally {
      setResetLoading(false);
    }
  }

  // Handler : Basculer statut actif/inactif
  async function handleToggleStatus(member: any) {
    if (!token) return;
    const targetId = member.id ?? member._id;
    try {
      await updateUserMutation({
        sessionToken: token,
        userId: targetId,
        isActive: !member.isActive,
      });
      showToast(
        `Compte ${member.email} ${!member.isActive ? "réactivé" : "désactivé"}.`
      );
    } catch (err: any) {
      showToast(err?.data?.message ?? "Action impossible.", "error");
    }
  }

  // Handler : Changer le rôle
  async function handleChangeRole(member: any, role: Role) {
    if (!token) return;
    const targetId = member.id ?? member._id;
    try {
      await updateUserMutation({
        sessionToken: token,
        userId: targetId,
        role,
      });
      showToast(`Rôle mis à jour : ${ROLE_CONFIG[role].label}.`);
    } catch (err: any) {
      showToast(err?.data?.message ?? "Action impossible.", "error");
    }
  }

  // Handler : Supprimer un compte
  async function handleDeleteUser(member: any) {
    if (!token) return;
    const targetId = member.id ?? member._id;
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement le compte de ${member.firstName} ${member.lastName} (${member.email}) ?`
    );
    if (!confirmDelete) return;

    try {
      await removeUserMutation({
        sessionToken: token,
        userId: targetId,
      });
      showToast(`Compte ${member.email} supprimé.`);
    } catch (err: any) {
      showToast(err?.data?.message ?? "Suppression impossible.", "error");
    }
  }

  const TABS: {
    id: Tab;
    label: string;
    icon: React.ElementType;
    permission?: "users.manage";
  }[] = [
    { id: "profile",  label: "Mon profil", icon: User },
    { id: "security", label: "Sécurité",   icon: Shield },
    { id: "team",     label: "Équipe",     icon: UserCog, permission: "users.manage" },
  ];

  const visibleTabs = TABS.filter(
    (t) => !t.permission || hasPermission(t.permission)
  );

  return (
    <>
      <Topbar title="Paramètres & Sécurité" />

      {/* Toast notification floating */}
      {toastMessage && (
        <div
          className="animate-slide-down"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 9999,
            padding: "0.875rem 1.25rem",
            borderRadius: 12,
            background:
              toastMessage.type === "success"
                ? "linear-gradient(135deg, hsl(158 76% 25%) 0%, hsl(158 76% 16%) 100%)"
                : "linear-gradient(135deg, hsl(350 89% 30%) 0%, hsl(350 89% 18%) 100%)",
            border: `1px solid ${
              toastMessage.type === "success"
                ? "hsl(158 76% 44% / 0.4)"
                : "hsl(350 89% 60% / 0.4)"
            }`,
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          {toastMessage.type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div style={{ padding: "2rem", maxWidth: 1080, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Paramètres du compte
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginTop: "0.375rem",
            }}
          >
            Gérez vos informations personnelles, votre sécurité et les accès de l&apos;atelier.
          </p>
        </div>

        {/* Layout: Sidebar tabs + Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Navigation tabs */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              background: "var(--surface-900)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "0.75rem",
            }}
          >
            {visibleTabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: 9,
                    border: "none",
                    background: isActive
                      ? "linear-gradient(135deg, var(--surface-700) 0%, var(--surface-600) 100%)"
                      : "transparent",
                    color: isActive ? "white" : "var(--text-secondary)",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? "var(--brand-300)" : "var(--text-muted)",
                    }}
                  />
                  <span>{t.label}</span>
                  {t.id === "team" && teamQuery && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.72rem",
                        padding: "1px 7px",
                        borderRadius: 99,
                        background: "var(--surface-800)",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      {teamQuery.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Tab content area */}
          <div>
            {/* ── Mon profil ── */}
            {activeTab === "profile" && (
              <div
                className="animate-fade-in"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* User badge card */}
                <div
                  style={{
                    background:
                      "linear-gradient(160deg, var(--surface-900) 0%, var(--surface-800) 100%)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "1.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      background:
                        "linear-gradient(135deg, var(--brand-400) 0%, var(--brand-700) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "white",
                      boxShadow: "0 8px 24px hsl(43 80% 42% / 0.25)",
                      flexShrink: 0,
                    }}
                  >
                    {(user?.firstName?.[0] ?? "?") + (user?.lastName?.[0] ?? "")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "white",
                          margin: 0,
                        }}
                      >
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: `hsl(from ${roleConfig.color} h s l / 0.12)`,
                          border: `1px solid ${roleConfig.color}40`,
                          color: roleConfig.color,
                        }}
                      >
                        {roleConfig.icon} {roleConfig.label}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                        marginTop: 4,
                        margin: "4px 0 0",
                      }}
                    >
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Edit personal info */}
                <div
                  style={{
                    background:
                      "linear-gradient(160deg, var(--surface-900) 0%, var(--surface-800) 100%)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "2rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "white",
                      margin: "0 0 1.25rem",
                    }}
                  >
                    Informations personnelles
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Nom
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nom"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      disabled={profileSaving}
                      className="btn btn-primary"
                    >
                      <Save size={15} />
                      {profileSaving ? "Enregistrement…" : "Enregistrer les modifications"}
                    </button>
                    {profileSuccess && (
                      <span
                        className="animate-fade-in"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: "0.8125rem",
                          color: "var(--success)",
                          fontWeight: 600,
                        }}
                      >
                        <Check size={16} /> Enregistré !
                      </span>
                    )}
                  </div>
                </div>

                {/* Permissions recap */}
                <div
                  style={{
                    background:
                      "linear-gradient(160deg, var(--surface-900) 0%, var(--surface-800) 100%)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "2rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "white",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    Vos permissions actives
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Permissions associées à votre rôle <strong>{roleConfig.label}</strong>.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {Object.entries(PERMISSIONS_MAP).map(([key, perm]) => {
                      const granted = hasPermission(key as any);
                      return (
                        <div
                          key={key}
                          style={{
                            padding: "0.75rem 1rem",
                            borderRadius: 10,
                            background: granted
                              ? "hsl(158 76% 44% / 0.08)"
                              : "var(--surface-950)",
                            border: `1px solid ${
                              granted
                                ? "hsl(158 76% 44% / 0.25)"
                                : "var(--border)"
                            }`,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            opacity: granted ? 1 : 0.45,
                          }}
                        >
                          <span style={{ fontSize: "1.1rem" }}>{perm.icon}</span>
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              color: granted ? "white" : "var(--text-faint)",
                            }}
                          >
                            {perm.label}
                          </span>
                          {granted ? (
                            <Check
                              size={14}
                              style={{ color: "var(--success)", marginLeft: "auto" }}
                            />
                          ) : (
                            <X
                              size={14}
                              style={{ color: "var(--text-faint)", marginLeft: "auto" }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Sécurité ── */}
            {activeTab === "security" && (
              <div
                className="animate-fade-in"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Change password */}
                <div
                  style={{
                    background:
                      "linear-gradient(160deg, var(--surface-900) 0%, var(--surface-800) 100%)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <Key size={18} style={{ color: "var(--brand-300)" }} />
                    <h2
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "white",
                        margin: 0,
                      }}
                    >
                      Modifier mon mot de passe
                    </h2>
                  </div>

                  {passError && (
                    <div
                      className="animate-slide-down"
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: 10,
                        background: "hsl(350 89% 60% / 0.08)",
                        border: "1px solid hsl(350 89% 60% / 0.2)",
                        color: "var(--danger)",
                        fontSize: "0.875rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      ⚠️ {passError}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      maxWidth: 480,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Mot de passe actuel
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          placeholder="••••••••••••"
                          style={{ paddingRight: "2.5rem" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            color: "var(--text-faint)",
                            cursor: "pointer",
                          }}
                        >
                          {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Nouveau mot de passe
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showNew ? "text" : "password"}
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Au moins 10 caractères avec chiffres"
                          style={{ paddingRight: "2.5rem" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            color: "var(--text-faint)",
                            cursor: "pointer",
                          }}
                        >
                          {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        disabled={passSaving}
                        className="btn btn-primary"
                      >
                        {passSaving ? "Mise à jour…" : "Mettre à jour le mot de passe"}
                      </button>
                      {passSuccess && (
                        <span
                          className="animate-fade-in"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: "0.8125rem",
                            color: "var(--success)",
                            fontWeight: 600,
                          }}
                        >
                          <Check size={16} /> Modifié avec succès !
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Revoke sessions */}
                <div
                  style={{
                    background:
                      "linear-gradient(160deg, var(--surface-900) 0%, var(--surface-800) 100%)",
                    border: "1px solid hsl(350 89% 60% / 0.15)",
                    borderRadius: "var(--radius)",
                    padding: "2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <ShieldAlert size={18} style={{ color: "var(--danger)" }} />
                    <h2
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: "1.0625rem",
                        fontWeight: 700,
                        color: "white",
                        margin: 0,
                      }}
                    >
                      Gestion des sessions
                    </h2>
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-muted)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Révoquez toutes les sessions actives sur d&apos;autres appareils. Votre session actuelle sera conservée.
                  </p>
                  <button
                    type="button"
                    onClick={handleRevokeOthers}
                    className="btn btn-danger"
                  >
                    <LogOut size={15} />
                    Révoquer toutes les autres sessions
                  </button>
                </div>
              </div>
            )}

            {/* ── Équipe ── */}
            {activeTab === "team" && (
              <div
                className="animate-fade-in"
                style={{
                  background:
                    "linear-gradient(160deg, var(--surface-900) 0%, var(--surface-800) 100%)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "2rem",
                }}
              >
                {/* Header with "+ Ajouter un membre" button */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "white",
                        margin: 0,
                      }}
                    >
                      Gestion de l&apos;équipe & des rôles
                    </h2>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                        marginTop: 4,
                        margin: "4px 0 0",
                      }}
                    >
                      {teamQuery?.length ?? "—"} membre(s) enregistré(s) · Gérez les accès et permissions
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNewMemberError("");
                      setShowAddModal(true);
                    }}
                    className="btn btn-primary"
                    style={{ gap: 8, padding: "0.65rem 1.25rem" }}
                  >
                    <UserPlus size={16} />
                    Ajouter un membre
                  </button>
                </div>

                {/* Team members list */}
                {teamQuery === undefined ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="skeleton"
                        style={{ height: 72, borderRadius: 12 }}
                      />
                    ))}
                  </div>
                ) : teamQuery.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    Aucun membre dans l&apos;équipe
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {teamQuery.map((member: any) => {
                      const rc =
                        ROLE_CONFIG[member.role as Role] ?? ROLE_CONFIG.viewer;
                      const isSelf =
                        member.id === user?.id || member._id === user?.id;

                      return (
                        <div
                          key={member._id ?? member.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "1rem 1.25rem",
                            borderRadius: 12,
                            background: "var(--surface-950)",
                            border: `1px solid ${
                              isSelf ? "hsl(43 80% 42% / 0.25)" : "var(--border)"
                            }`,
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Avatar */}
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              background:
                                "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.875rem",
                              fontWeight: 700,
                              color: "white",
                              flexShrink: 0,
                            }}
                          >
                            {(member.firstName?.[0] ?? "?") + (member.lastName?.[0] ?? "")}
                          </div>

                          {/* Member info */}
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <div
                              style={{
                                fontSize: "0.9375rem",
                                fontWeight: 600,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              {member.firstName} {member.lastName}
                              {isSelf && (
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    padding: "1px 6px",
                                    borderRadius: 99,
                                    background: "hsl(43 80% 42% / 0.12)",
                                    border: "1px solid hsl(43 80% 42% / 0.25)",
                                    color: "var(--brand-300)",
                                    fontWeight: 700,
                                  }}
                                >
                                  Vous
                                </span>
                              )}
                              {!member.isActive && (
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    padding: "1px 6px",
                                    borderRadius: 99,
                                    background: "hsl(350 89% 60% / 0.1)",
                                    border: "1px solid hsl(350 89% 60% / 0.2)",
                                    color: "var(--danger)",
                                    fontWeight: 700,
                                  }}
                                >
                                  Désactivé
                                </span>
                              )}
                              {member.isLocked && (
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    padding: "1px 6px",
                                    borderRadius: 99,
                                    background: "hsl(35 90% 50% / 0.1)",
                                    border: "1px solid hsl(35 90% 50% / 0.2)",
                                    color: "var(--brand-300)",
                                    fontWeight: 700,
                                  }}
                                >
                                  Verrouillé
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "0.8125rem",
                                color: "var(--text-muted)",
                                marginTop: 2,
                              }}
                            >
                              {member.email}
                            </div>
                          </div>

                          {/* Role selector dropdown */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {isSelf ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                  padding: "0.3rem 0.8rem",
                                  borderRadius: 99,
                                  background: `hsl(from ${rc.color} h s l / 0.1)`,
                                  border: `1px solid ${rc.color}33`,
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  color: rc.color,
                                }}
                              >
                                {rc.icon} {rc.label}
                              </div>
                            ) : (
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  handleChangeRole(member, e.target.value as Role)
                                }
                                style={{
                                  padding: "0.35rem 0.65rem",
                                  borderRadius: 8,
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  background: "var(--surface-800)",
                                  border: "1px solid var(--border)",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                              >
                                {Object.entries(ROLE_CONFIG).map(([k, r]) => (
                                  <option key={k} value={k}>
                                    {r.icon} {r.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>

                          {/* Member actions (if not self) */}
                          {!isSelf && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                              {/* Reset password button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setResetTargetUser(member);
                                  setResetTargetPass("");
                                  setResetError("");
                                }}
                                title="Réinitialiser le mot de passe"
                                style={{
                                  padding: "0.45rem",
                                  borderRadius: 7,
                                  background: "var(--surface-800)",
                                  border: "1px solid var(--border)",
                                  color: "var(--text-muted)",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Lock size={14} />
                              </button>

                              {/* Toggle active status */}
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(member)}
                                title={
                                  member.isActive
                                    ? "Désactiver ce compte"
                                    : "Réactiver ce compte"
                                }
                                style={{
                                  padding: "0.45rem",
                                  borderRadius: 7,
                                  background: "var(--surface-800)",
                                  border: "1px solid var(--border)",
                                  color: member.isActive
                                    ? "var(--danger)"
                                    : "var(--success)",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Power size={14} />
                              </button>

                              {/* Delete member */}
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(member)}
                                title="Supprimer définitivement ce compte"
                                style={{
                                  padding: "0.45rem",
                                  borderRadius: 7,
                                  background: "var(--surface-800)",
                                  border: "1px solid var(--border)",
                                  color: "var(--text-faint)",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL : Ajouter un membre ── */}
      {showAddModal && (
        <div
          className="animate-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: "100%",
              maxWidth: 560,
              background:
                "linear-gradient(165deg, var(--surface-900) 0%, var(--surface-800) 100%)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: "2rem",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.7)",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "hsl(43 80% 42% / 0.15)",
                    border: "1px solid hsl(43 80% 42% / 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--brand-300)",
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    Nouveau membre d&apos;équipe
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    Créez un compte et définissez son niveau d&apos;accès
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-faint)",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Error banner */}
            {newMemberError && (
              <div
                className="animate-slide-down"
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  background: "hsl(350 89% 60% / 0.08)",
                  border: "1px solid hsl(350 89% 60% / 0.2)",
                  color: "var(--danger)",
                  fontSize: "0.875rem",
                  marginBottom: "1.25rem",
                }}
              >
                ⚠️ {newMemberError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateMember} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* First & Last name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberFirst}
                    onChange={(e) => setNewMemberFirst(e.target.value)}
                    placeholder="Gabriel"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newMemberLast}
                    onChange={(e) => setNewMemberLast(e.target.value)}
                    placeholder="Wandja"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="collaborateur@frameitup.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Mot de passe temporaire * (min. 10 car. avec chiffres)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={newMemberShowPass ? "text" : "password"}
                    required
                    value={newMemberPass}
                    onChange={(e) => setNewMemberPass(e.target.value)}
                    placeholder="Ex : GabrielPass123"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setNewMemberShowPass(!newMemberShowPass)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-faint)",
                      cursor: "pointer",
                    }}
                  >
                    {newMemberShowPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Role selection radio cards */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Rôle & niveau d&apos;accès
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(Object.keys(ROLE_CONFIG) as Role[]).map((rKey) => {
                    const rc = ROLE_CONFIG[rKey];
                    const selected = newMemberRole === rKey;
                    return (
                      <div
                        key={rKey}
                        onClick={() => setNewMemberRole(rKey)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.65rem 0.875rem",
                          borderRadius: 10,
                          background: selected
                            ? "hsl(43 80% 42% / 0.1)"
                            : "var(--surface-950)",
                          border: `1px solid ${
                            selected
                              ? "hsl(43 80% 42% / 0.4)"
                              : "var(--border)"
                          }`,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{rc.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.84rem",
                              fontWeight: 700,
                              color: selected ? "var(--brand-300)" : "white",
                            }}
                          >
                            {rc.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {rc.desc}
                          </div>
                        </div>
                        {selected && (
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: "var(--brand-400)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "black",
                            }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={newMemberLoading}
                  className="btn btn-primary"
                >
                  {newMemberLoading ? "Création en cours…" : "Créer le compte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL : Réinitialiser mot de passe ── */}
      {resetTargetUser && (
        <div
          className="animate-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setResetTargetUser(null);
          }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: "100%",
              maxWidth: 460,
              background:
                "linear-gradient(165deg, var(--surface-900) 0%, var(--surface-800) 100%)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: "2rem",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "white",
                  margin: 0,
                }}
              >
                Réinitialiser le mot de passe
              </h3>
              <button
                type="button"
                onClick={() => setResetTargetUser(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-faint)",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 1.25rem" }}>
              Définir un nouveau mot de passe pour <strong>{resetTargetUser.firstName} {resetTargetUser.lastName}</strong> ({resetTargetUser.email}).
            </p>

            {resetError && (
              <div
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: 8,
                  background: "hsl(350 89% 60% / 0.1)",
                  border: "1px solid hsl(350 89% 60% / 0.2)",
                  color: "var(--danger)",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem",
                }}
              >
                ⚠️ {resetError}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Nouveau mot de passe (min. 10 car.)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={resetShowPass ? "text" : "password"}
                    required
                    value={resetTargetPass}
                    onChange={(e) => setResetTargetPass(e.target.value)}
                    placeholder="••••••••••••"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setResetShowPass(!resetShowPass)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-faint)",
                      cursor: "pointer",
                    }}
                  >
                    {resetShowPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="btn btn-primary"
                >
                  {resetLoading ? "Enregistrement…" : "Confirmer le mot de passe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
