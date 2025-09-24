import { getCsvLink } from "@/http/api"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

export const useGetCsvLink = (
  options?: UseMutationOptions<string, AxiosError, void>
) => {
  return useMutation({
    mutationFn: () =>
      getCsvLink(),

    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Erro ao baixar CSV!", { position: "bottom-right" })
      } else {
        toast.error("Erro desconhecido", { position: "bottom-right" })
      }
    },
  })
}