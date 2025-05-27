import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import handleApiRequest from "../utils/handleApiRequest";
import { Expense, CreateExpenseDto, UpdateExpenseDto } from "../types/api";

// API call functions
const fetchAllExpenses = () => {
  return handleApiRequest<Expense[]>(() => api.get("/expenses"));
};

const fetchExpenseById = (id: string) => {
  return handleApiRequest<Expense>(() => api.get(`/expenses/${id}`));
};

const createExpense = (expenseData: CreateExpenseDto) => {
  return handleApiRequest<Expense>(() => api.post("/expenses", expenseData));
};

const updateExpense = (id: string, expenseData: UpdateExpenseDto) => {
  return handleApiRequest<Expense>(() => api.put(`/expenses/${id}`, expenseData));
};

const deleteExpense = (id: string) => {
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