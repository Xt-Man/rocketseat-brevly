import { useUrlStore } from "@/store/urlStore"
import { getShortenedUrl } from "@/utils/shortened-url"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { IconCopy, IconTrash } from "@tabler/icons-react"
import Button from "./ui/Button"
import { copyToClipboard } from "@/utils/copy-to-clipboard"
import { toast } from "react-toastify"

export default function Urls() {

  const urls = useUrlStore(state => state.urls)
  const incrementAccess = useUrlStore(state => state.incrementAccess)
  const removeUrl = useUrlStore(state => state.removeUrl)

  return (
    <ScrollArea.Root className="flex flex-col gap-4 max-h-[50vh] overflow-hidden">
      <ScrollArea.Viewport className="max-h-[50vh]">
          {urls?.map((url) => (
              <div key={url.id} className="flex justify-between items-center py-4 border-t border-gray-200">
                  <div className="flex flex-col gap-2">
                      <a className="typography-md text-blue" onClick={() => incrementAccess(url.id)} href={getShortenedUrl(url.shortenedUrl)} target="_blank">
                        {`brev.ly/${url.shortenedUrl}`}</a>
                      <span className="typography-sm text-gray-500">{url.originalUrl}</span>
                  </div>
                  <div className="flex items-center gap-4">
                      <span className="typography-sm text-gray-500">{url.accessCount} acesso{url.accessCount === 1 ? '' : 's'}</span>
                      <div className="flex gap-1">
                          <Button className="h-8" icon={<IconCopy size={16} className="text-gray-600" />} secondary onClick={() => {
                            copyToClipboard(getShortenedUrl(url.shortenedUrl))
                            toast.info(`Link copiado com sucesso\nO link ${url.shortenedUrl} foi copiado para a área de transferência`, {
                              position: "bottom-right"
                            } )
                          }}   />
                          <Button className="h-8" icon={<IconTrash size={16} className="text-gray-600" />} secondary onClick={() => { if (window.confirm(`Você realmente quer apargar o link ${url.shortenedUrl} ?`)) removeUrl(url.id) } } />
                      </div>
                  </div>
              </div>
          ))}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-gray-200 p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
      >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-gray-400 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}