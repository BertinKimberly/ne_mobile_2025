import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import handleApiRequest from "../utils/handleApiRequest";
import { Expense, CreateExpenseDto, UpdateExpenseDto } from "../types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const getCurrentUser = async () => {
  const userStr = await AsyncStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// API call functions
const fetchAllExpenses = async () => {
  const user = await getCurrentUser();
  if (!user) {
    Toast.show({
      type: "error",
      text1: "Authentication Error",
      text2: "Please log in to view expenses",
    });
    router.replace("/login");
    return { data: [], success: false };
  }
  
  return handleApiRequest<Expense[]>(() => 
    api.get(`/expenses?userId=${user.id}`)
  );
};

const fetchExpenseById = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) {
    Toast.show({
      type: "error",
      text1: "Authentication Error",
      text2: "Please log in to view this expense",
    });
    router.replace("/login");
    return { data: null, success: false };
  }

  const response = await handleApiRequest<Expense>(() => 
    api.get(`/expenses/${id}`)
  );

  // Verify expense belongs to user
  if (response.data && response.data.userId !== user.id) {
    Toast.show({
      type: "error",
      text1: "Unauthorized",
      text2: "You don't have permission to view this expense",
    });
    router.back();
    return { data: null, success: false };
  }

  return response;
};

const createExpense = async (expenseData: CreateExpenseDto) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");

  return handleApiRequest<Expense>(() => 
    api.post("/expenses", { 
      ...expenseData, 
      userId: user.id,
      date: new Date().toISOString() 
    })
  );
};

const updateExpense = async (id: string, expenseData: UpdateExpenseDto) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");

  // First verify ownership
  const current = await fetchExpenseById(id);
  if (!current.success || !current.data || current.data.userId !== user.id) {
    Toast.show({
      type: "error",
      text1: "Unauthorized",
      text2: "You don't have permission to edit this expense",
    });
    throw new Error("Unauthorized to update this expense");
  }

  return handleApiRequest<Expense>(() => 
    api.put(`/expenses/${id}`, {
      ...expenseData,
      userId: user.id // Ensure userId remains unchanged
    })
  );
};

const deleteExpense = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");

  // First verify ownership
  const current = await fetchExpenseById(id);
  if (!current.success || !current.data || current.data.userId !== user.id) {
    Toast.show({
      type: "error",
      text1: "Unauthorized",
      text2: "You don't have permission to delete this expense",
    });
    throw new Error("Unauthorized to delete this expense");
  }

  return handleApiRequest(() => api.delete(`/expenses/${id}`));
};

// React Query hooks
export const useGetAllExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchAllExpenses,
  });
};

export const useGetExpense = (id?: string) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => fetchExpenseById(id!),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateExpenseDto) =>
      updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense", variables.id] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense", variables] });
    },
  });
};

// Utility functions
export const formatAmount = (amount: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};