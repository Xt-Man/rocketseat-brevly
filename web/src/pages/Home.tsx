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
import LoadingStrip from "@/components/ui/LoadingStrip"
import { useCreateShortUrl } from "@/hooks/useCreateShortUrl"
import { useFetchUrls } from "@/hooks/useFetchUrls"
import { useGetCsvLink } from "@/hooks/useGetCsvLink"
import { useRemoveUrl } from "@/hooks/useRemoveUrl"

const formSchema = z.object({
  originalUrl: z.url({ message: "Informe uma url válida" }),
  shortenedUrl: z.string().regex(/^[a-z0-9-]+$/, 'Informe uma url minúscula e sem, espaço/caracter especial'),
})

export default function Home() {

  const hasUrls = useUrlStore((state) => state.hasUrls())
  const setUrls = useUrlStore((state) => state.setUrls)

  const createShortUrlMutation = useCreateShortUrl()
  const fetchUrlsMutation = useFetchUrls({
    onSuccess: (data) => {
      setUrls(data)
    }
  })
  const getCsvLinkMutation = useGetCsvLink({
    onSuccess: (data) => {
      window.location.assign(data)
    }
  })
  const removeUrlMutation = useRemoveUrl({
    onSuccess: () => {
      fetchUrlsMutation.mutate()
    }
  })

  useEffect(() => {
    fetchUrlsMutation.mutate()
}, [])

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (data: {originalUrl: string, shortenedUrl: string}) => {
    createShortUrlMutation.mutate(
      { originalUrl: data.originalUrl, shortenedUrl: data.shortenedUrl },
      {
        onSuccess: () => {
          reset()
          fetchUrlsMutation.mutate()
        },
      }
    )
  }

  console.log('isPending', fetchUrlsMutation.isPending, getCsvLinkMutation.isPending, removeUrlMutation.isPending)
  console.log((fetchUrlsMutation.isPending || getCsvLinkMutation.isPending || removeUrlMutation.isPending))
  
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
              <div className="flex flex-1 items-center justify-center">
                <LoadingStrip 
                  className="flex flex-1 w-full"
                  disabled={!(fetchUrlsMutation.isPending || getCsvLinkMutation.isPending || removeUrlMutation.isPending)}
                />
              </div>
            <div className="flex justify-between items-center gap-4">
              <p className="typography-lg text-gray-600">Meus links</p>
              <Button className="h-8" 
                icon={<IconDownload size={16}
                className="text-gray-600" />}
                disabled={getCsvLinkMutation.isPending || removeUrlMutation.isPending || !hasUrls}
                secondary 
                onClick={async () => {
                  getCsvLinkMutation.mutate()
                }}>Baixar CSV</Button>
            </div>

            {!hasUrls && (
              <div className="flex flex-col items-center justify-center gap-2 border-t border-gray-200 pt-4">
                <img src={LinkIcon} alt="Brev" className="w-8 h-8" />
                <p className="typography-xs text-gray-500">Ainda não existem links cadastrados</p>
              </div>
            )}

            {hasUrls && (
              <Urls fnRemove={removeUrlMutation} />
            )}

          </div>


        </div>


      </div>
    </div>
  )
}