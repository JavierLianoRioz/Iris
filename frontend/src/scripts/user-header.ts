import { googleLogout } from "@react-oauth/google";
import { usersService } from "../services/client/users.service";
import { assert } from "../utils/assert";

export class UserHeaderManager {
  private userHeader: HTMLElement | null;
  private userName: HTMLElement | null;
  private userEmail: HTMLElement | null;
  private userAvatar: HTMLImageElement | null;
  private btnLogout: HTMLElement | null;
  private btnEditProfile: HTMLElement | null;
  private btnDeleteAccount: HTMLElement | null;
  private user: any = null;

  constructor() {
    this.userHeader = document.getElementById("user-header");
    this.userName = document.getElementById("user-name");
    this.userEmail = document.getElementById("user-email");
    this.userAvatar = document.getElementById("user-avatar") as HTMLImageElement;
    this.btnLogout = document.getElementById("btn-logout");
    this.btnEditProfile = document.getElementById("btn-edit-profile");
    this.btnDeleteAccount = document.getElementById("btn-delete-account");

    this.init();
  }

  private init() {
    this.loadUser();
    this.setupEventListeners();
  }

  private loadUser() {
    const storedUserStr = localStorage.getItem("irisUser");
    if (storedUserStr) {
      this.user = JSON.parse(storedUserStr);
      if (this.userName) this.userName.innerText = this.user.name;
      if (this.userEmail) this.userEmail.innerText = this.user.email;
      if (this.userAvatar) this.userAvatar.src = this.user.picture;
      if (this.userHeader) this.userHeader.style.visibility = "visible";
    } else {
      window.location.href = "/";
    }
  }

  private setupEventListeners() {
    if (this.btnLogout) {
      this.btnLogout.addEventListener("click", () => {
        try {
            googleLogout();
        } catch (e) {
            console.warn("Google logout failed (likely not initialized), clearing local storage anyway.");
        }
        localStorage.removeItem("irisUser");
        window.location.href = "/";
      });
    }

    if (this.btnEditProfile) {
      this.btnEditProfile.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("open-profile-modal"));
      });
    }

    if (this.btnDeleteAccount) {
      this.btnDeleteAccount.addEventListener("click", async () => {
        if (
          confirm(
            "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción borrará todos tus datos y suscripciones de forma permanente."
          )
        ) {
          try {
            assert(!!this.user?.email, "User email missing for deletion");

            await usersService.deleteUser(this.user.email);
            try {
                googleLogout();
            } catch (e) { console.warn("Google logout failed during deletion"); }
            
            localStorage.removeItem("irisUser");
            alert("Tu cuenta ha sido eliminada correctamente.");
            window.location.href = "/";
          } catch (error) {
            console.error("Error deleting account:", error);
            alert(
              "Hubo un error al intentar eliminar tu cuenta. Por favor, inténtalo de nuevo."
            );
          }
        }
      });
    }
  }
}
