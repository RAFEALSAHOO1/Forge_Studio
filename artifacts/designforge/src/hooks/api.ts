import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Auth Hooks
export function useRequestOtpEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`${API_URL}/auth/request-otp-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");
      return response.json();
    },
  });
}

export function useRequestOtpPhone() {
  return useMutation({
    mutationFn: async ({
      phoneNumber,
      countryCode,
    }: {
      phoneNumber: string;
      countryCode: string;
    }) => {
      const response = await fetch(`${API_URL}/auth/request-otp-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, countryCode }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");
      return response.json();
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (data: {
      otpCode: string;
      email?: string;
      phoneNumber?: string;
      countryCode?: string;
    }) => {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to verify OTP");
      return response.json();
    },
  });
}

export function useCountryCodes() {
  return useQuery({
    queryKey: ["countryCodes"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/auth/countries`);
      if (!response.ok) throw new Error("Failed to fetch country codes");
      return response.json();
    },
  });
}

// Colors & Fonts Hooks
export function useColors(page = 0, limit = 100, filters?: { category?: string; subcategory?: string; undertone?: string }) {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (filters?.category) params.set("category", filters.category);
  if (filters?.subcategory) params.set("subcategory", filters.subcategory);
  if (filters?.undertone) params.set("undertone", filters.undertone);

  return useQuery({
    queryKey: ["colors", page, limit, filters],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/colors-fonts/colors?${params}`);
      if (!response.ok) throw new Error("Failed to fetch colors");
      return response.json();
    },
  });
}

export function useColorCategories() {
  return useQuery({
    queryKey: ["colorCategories"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/colors-fonts/colors/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });
}

export function useColorSubcategories(category: string) {
  return useQuery({
    queryKey: ["colorSubcategories", category],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/colors-fonts/colors/subcategories?category=${encodeURIComponent(category)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      return response.json();
    },
    enabled: !!category,
  });
}

export function useColorUndertones() {
  return useQuery({
    queryKey: ["colorUndertones"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/colors-fonts/colors/undertones`);
      if (!response.ok) throw new Error("Failed to fetch undertones");
      return response.json();
    },
  });
}

export function useColorByHex(hex: string) {
  return useQuery({
    queryKey: ["color", hex],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/colors-fonts/colors/hex/${hex.replace("#", "")}`);
      if (!response.ok) throw new Error("Failed to fetch color");
      return response.json();
    },
    enabled: !!hex,
  });
}

export function useSearchColors(query: string, limit = 50) {
  return useQuery({
    queryKey: ["colorSearch", query, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/colors-fonts/colors/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      );
      if (!response.ok) throw new Error("Failed to search colors");
      return response.json();
    },
    enabled: !!query,
  });
}

export function useLuxuryPalette() {
  return useQuery({
    queryKey: ["luxuryPalette"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/colors-fonts/palettes/luxury-default`);
      if (!response.ok) throw new Error("Failed to fetch luxury palette");
      return response.json();
    },
  });
}

export function usePaletteByCategory(category: string) {
  return useQuery({
    queryKey: ["paletteCategory", category],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/colors-fonts/palettes/category/${encodeURIComponent(category)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch palette");
      return response.json();
    },
    enabled: !!category,
  });
}

// Fonts Hooks
export function useFonts(page = 0, limit = 50, category?: string) {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (category) params.set("category", category);

  return useQuery({
    queryKey: ["fonts", page, limit, category],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/colors-fonts/fonts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch fonts");
      return response.json();
    },
  });
}

export function useFontCategories() {
  return useQuery({
    queryKey: ["fontCategories"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/colors-fonts/fonts/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });
}

export function useSearchFonts(query: string, limit = 50) {
  return useQuery({
    queryKey: ["fontSearch", query, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/colors-fonts/fonts/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      );
      if (!response.ok) throw new Error("Failed to search fonts");
      return response.json();
    },
    enabled: !!query,
  });
}

// Orders Hooks
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useOrders(page = 0, limit = 10) {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/orders?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch order");
      return response.json();
    },
  });
}

export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: ["orderTracking", orderId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/orders/${orderId}/tracking`);
      if (!response.ok) throw new Error("Failed to fetch tracking");
      return response.json();
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error("Failed to cancel order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// Designs Hooks
export function useCreateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`${API_URL}/designs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create design");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useDesigns(page = 0, limit = 10) {
  return useQuery({
    queryKey: ["designs", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/designs?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch designs");
      return response.json();
    },
  });
}

export function useDesignDetails(designId: string) {
  return useQuery({
    queryKey: ["design", designId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/designs/${designId}`);
      if (!response.ok) throw new Error("Failed to fetch design");
      return response.json();
    },
  });
}

export function useUpdateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ designId, data }: { designId: string; data: any }) => {
      const response = await fetch(`${API_URL}/designs/${designId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update design");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function usePublishDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (designId: string) => {
      const response = await fetch(`${API_URL}/designs/${designId}/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to publish design");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

// User Hooks
export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Payments Hooks
export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async ({ amount, orderId }: { amount: number; orderId: string }) => {
      const response = await fetch(`${API_URL}/payments/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ amount, orderId }),
      });
      if (!response.ok) throw new Error("Failed to create payment intent");
      return response.json();
    },
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async ({
      paymentIntentId,
      orderId,
    }: {
      paymentIntentId: string;
      orderId: string;
    }) => {
      const response = await fetch(`${API_URL}/payments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ paymentIntentId, orderId }),
      });
      if (!response.ok) throw new Error("Failed to confirm payment");
      return response.json();
    },
  });
}
