import { removeUrlById } from "@/http/api"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

export type RemoveUrlArgs = {
  id: string
}

export const useRemoveUrl = (
  options?: UseMutationOptions<boolean, AxiosError, RemoveUrlArgs>
) => {
  return useMutation({
    mutationFn: ({id} : RemoveUrlArgs) =>
      removeUrlById(id),

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