import { createShortUrl } from "@/http/api"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

type CreateShortUrlArgs = {
  originalUrl: string
  shortenedUrl: string
}

export const useCreateShortUrl = () => {
  return useMutation({
    mutationFn: ({ originalUrl, shortenedUrl }: CreateShortUrlArgs) =>
      createShortUrl(originalUrl, shortenedUrl),
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response?.data.message, { position: "bottom-right" })
      } else {
        toast.error("Erro ao salvar URL encurtada", { position: "bottom-right" })
      }
    },
  })
}
