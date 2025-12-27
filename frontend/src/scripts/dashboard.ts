import { usersService, type UserDTO } from "../services/client/users.service";
import { assert } from "../utils/assert";

export class DashboardManager {
  private cards: NodeListOf<Element>;
  private saveStatus: HTMLElement | null;
  private user: UserDTO | null = null;
  private subscribedCodes: Set<string> = new Set();

  constructor() {
    this.cards = document.querySelectorAll(".subscription-card");
    this.saveStatus = document.getElementById("save-status");
    
    this.init();
  }

  private async init() {
      this.loadUser();
      if (!this.user) return;

      await this.syncUserSubjects();
      this.initializeCards();
  }

  private loadUser() {
      const storedUserStr = localStorage.getItem("irisUser");
      if (storedUserStr) {
          this.user = JSON.parse(storedUserStr);
      }
  }

  private async syncUserSubjects() {
      if (!this.user) return;
      
      if (!this.user.subjects || this.user.subjects.length === 0) {
          try {
              const dbUser = await usersService.getUser(this.user.email);
              if (dbUser) {
                  this.user = { ...this.user, ...dbUser };
                  this.saveUser();
              } else {
                  this.user.subjects = [];
              }
          } catch (e) {
              console.error(e);
              this.user.subjects = [];
          }
      }
      this.subscribedCodes = new Set((this.user.subjects || []).map((s) => s.code));
  }

  private saveUser() {
      if (this.user) {
          localStorage.setItem("irisUser", JSON.stringify(this.user));
      }
  }

  private initializeCards() {
      this.cards.forEach((card) => {
          const id = card.getAttribute("data-subject-id");
          assert(!!id, "Card missing subject ID");

          if (this.subscribedCodes.has(id!)) {
              this.setCardState(card, true);
          }

          card.addEventListener("click", () => this.handleCardClick(card, id!));
      });
  }

  private async handleCardClick(card: Element, id: string) {
      this.showSaving();
      
      const wasSubscribed = this.subscribedCodes.has(id);
      const newSubscribedState = !wasSubscribed;

      this.setCardState(card, newSubscribedState);
      this.updateLocalSubscription(id, newSubscribedState);

      try {
          await this.updateServerSubscription();
          this.showSaved();
      } catch (err) {
          console.error(err);
          this.setCardState(card, wasSubscribed);
          this.updateLocalSubscription(id, wasSubscribed);
          alert("Error al guardar la suscripción.");
      }
  }

  private updateLocalSubscription(id: string, isSubscribed: boolean) {
      if (isSubscribed) {
          this.subscribedCodes.add(id);
      } else {
          this.subscribedCodes.delete(id);
      }
  }

  private async updateServerSubscription() {
      if (!this.user) return;

      const newSubjectList = Array.from(this.subscribedCodes);
      const updatedUser = await usersService.updateSubscription({
          email: this.user.email,
          name: this.user.name,
          phone: this.user.phone || "",
          subjects: newSubjectList,
      });

      this.user = { ...this.user, ...updatedUser };
      this.saveUser();
  }

  private setCardState(card: Element, isSubscribed: boolean) {
      card.setAttribute("data-subscribed", isSubscribed ? "true" : "false");
  }

  private showSaving() {
      if (this.saveStatus) {
          this.saveStatus.innerText = "Guardando...";
          this.saveStatus.style.opacity = "1";
      }
  }

  private showSaved() {
      if (this.saveStatus) {
          this.saveStatus.innerText = "Guardado";
          setTimeout(() => {
              if (this.saveStatus) this.saveStatus.style.opacity = "0";
          }, 2000);
      }
  }
}
