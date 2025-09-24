import { getListUrls } from "@/http/api"
import type { UrlItem } from "@/interfaces/urlItem"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

export const useFetchUrls = (
  options?: UseMutationOptions<UrlItem[], AxiosError, void>
) => {
  return useMutation({
    mutationFn: () =>
      getListUrls(),

    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Erro ao buscar links!", { position: "bottom-right" })
      } else {
        toast.error("Erro desconhecido", { position: "bottom-right" })
      }
    },
  })
}