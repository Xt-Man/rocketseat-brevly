import Logo from "@/assets/Logo.svg"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { TextInput } from "../components/ui/TextInput"
import { useUrlStore } from "@/store/urlStore"
import { useEffect } from "react"
import LinkIcon from "@/assets/link-icon.svg"
import Urls from "@/components/Urls"
import Button from "@/components/ui/Button"
import { IconDownload } from "@tabler/icons-react"
import { createShortUrl, getCsvLink } from "@/http/api"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

const formSchema = z.object({
  originalUrl: z.url({ message: "Informe uma url válida" }),
  shortenedUrl: z.string().regex(/^[a-z0-9-]+$/, 'Informe uma url minúscula e sem, espaço/caracter especial'),
})

export default function Home() {

  const hasUrls = useUrlStore((state) => state.hasUrls())
  const fetchUrls = useUrlStore((state) => state.fetchUrls)

  useEffect(() => {
    fetchUrls()
  }, [fetchUrls])

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema)
  })

  const createShortUrlMutation = useMutation({
    mutationFn: ({ originalUrl, shortenedUrl }: { originalUrl: string, shortenedUrl: string }) => createShortUrl(originalUrl, shortenedUrl),
    onSuccess: () => {
      reset()
      fetchUrls()
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response?.data.message, { position: "bottom-right" })
      } else {
        toast.error('Erro ao salvar URL encurtada', { position: "bottom-right" })
      }
    }
  })

  const onSubmit = async (data: {originalUrl: string, shortenedUrl: string}) => {
    createShortUrlMutation.mutate({ originalUrl: data.originalUrl, shortenedUrl: data.shortenedUrl })
  }
  
  return (
    <div className="h-dvh flex justify-center">
      <div className="flex flex-col gap-5 w-full max-w-5xl px-4 lg:px-0 items-stretch">
        <div className="mt-12 lg:mt-24 w-full flex justify-center lg:justify-start">
          <img src={Logo} alt="Brev" className="w-24 h-6" />
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-12">
          <form className="flex flex-col p-8 gap-4 bg-gray-100 rounded-2xl w-11/12 lg:w-2/5" onSubmit={handleSubmit(onSubmit)}>
            <>
              <p className="typography-lg text-gray-600">Novo link</p>
              <div>
                <TextInput id="originalUrl" error={errors.originalUrl?.message} label="Link Original" placeholder="www.exemplo.com.br" {...register('originalUrl')} />
              </div>
              <div>
                <TextInput id="shortenedUrl" error={errors.shortenedUrl?.message} label="Link Encurtado" prefix="brev.ly/" {...register('shortenedUrl')} />
              </div>
            </>
            <Button type="submit" disabled={createShortUrlMutation.isPending}>
              {createShortUrlMutation.isPending ? 'Salvando...' : 'Salvar Link'}
            </Button>
          </form>

          <div className="flex flex-col bg-gray-100 rounded-2xl p-8 gap-4 w-11/12 lg:w-3/5">
            <div className="flex justify-between items-center gap-4">
              <p className="typography-lg text-gray-600">Meus links</p>
              <Button className="h-8" icon={<IconDownload size={16} className="text-gray-600" />} secondary onClick={async () => {
                console.log('Download CSV')
                const exportUrl = await getCsvLink();
                window.location.assign(exportUrl);
              }}>Baixar CSV</Button>
            </div>

            {!hasUrls && (
              <div className="flex flex-col items-center justify-center gap-2 border-t border-gray-200 pt-4">
                <img src={LinkIcon} alt="Brev" className="w-8 h-8" />
                <p className="typography-xs text-gray-500">Ainda não existem links cadastrados</p>
              </div>
            )}

            {hasUrls && (
              <Urls />
            )}

          </div>


        </div>


      </div>
    </div>
  )
}