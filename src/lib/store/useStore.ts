import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Car } from "@/types/database";
import { soundEngine } from "@/lib/sound";

export interface CartItem {
  car: Car;
  quantity: number;
  isDepositOnly: boolean; // 10% reservation deposit vs full vehicle purchase
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[]; // car IDs
  isCartDrawerOpen: boolean;
  soundEnabled: boolean;
  flyingCarAnimation: {
    active: boolean;
    imageUrl?: string;
    startRect?: { top: number; left: number; width: number; height: number };
  } | null;

  // Actions
  addToCart: (car: Car, isDepositOnly?: boolean, triggerElement?: HTMLElement) => void;
  removeFromCart: (carId: string) => void;
  toggleDepositMode: (carId: string) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleWishlist: (carId: string) => void;
  isInWishlist: (carId: string) => boolean;
  toggleSound: () => void;
  resetFlyingAnimation: () => void;

  // Computed helpers
  getCartCount: () => number;
  getSubtotal: () => number;
  getDepositTotal: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartDrawerOpen: false,
      soundEnabled: true,
      flyingCarAnimation: null,

      addToCart: (car, isDepositOnly = false, triggerElement) => {
        soundEngine.playSuccessChime();

        // Calculate flight coordinates if element provided
        if (triggerElement && typeof window !== "undefined") {
          const rect = triggerElement.getBoundingClientRect();
          set({
            flyingCarAnimation: {
              active: true,
              imageUrl: car.hero_image,
              startRect: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              },
            },
          });
        }

        set((state) => {
          const existingIndex = state.cart.findIndex((i) => i.car.id === car.id);
          if (existingIndex > -1) {
            // Already in cart - open drawer
            return { isCartDrawerOpen: true };
          }
          return {
            cart: [...state.cart, { car, quantity: 1, isDepositOnly }],
            isCartDrawerOpen: true,
          };
        });
      },

      removeFromCart: (carId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.car.id !== carId),
        }));
      },

      toggleDepositMode: (carId) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.car.id === carId
              ? { ...item, isDepositOnly: !item.isDepositOnly }
              : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),
      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      toggleWishlist: (carId) => {
        soundEngine.playHoverTick();
        set((state) => {
          const inList = state.wishlist.includes(carId);
          return {
            wishlist: inList
              ? state.wishlist.filter((id) => id !== carId)
              : [...state.wishlist, carId],
          };
        });
      },

      isInWishlist: (carId) => {
        return get().wishlist.includes(carId);
      },

      toggleSound: () => {
        set((state) => {
          const next = !state.soundEnabled;
          soundEngine.isMuted = !next;
          return { soundEnabled: next };
        });
      },

      resetFlyingAnimation: () => {
        set({ flyingCarAnimation: null });
      },

      getCartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().cart.reduce((sum, item) => {
          const unitPrice = item.car.discount_price ?? item.car.price;
          const actualItemPrice = item.isDepositOnly ? unitPrice * 0.1 : unitPrice;
          return sum + actualItemPrice * item.quantity;
        }, 0);
      },

      getDepositTotal: () => {
        return get().cart.reduce((sum, item) => {
          const unitPrice = item.car.discount_price ?? item.car.price;
          return sum + unitPrice * 0.1 * item.quantity;
        }, 0);
      },
    }),
    {
      name: "aston_luxury_store_state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
