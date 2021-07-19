import { I_PageProps } from "./index.d"

export const $processor = (pageProps: I_PageProps) => {
  const { data, handlers } = pageProps
  const { processing } = data
  const { setProcessing } = handlers

  function Processors (this: any): any {
      this.$result = () => {
  
      }
      this.$error = (error: any) => {
          console.error(error)
          this.$finalizer()
      }

      this.$finalizer = () => {
          if (processing && setProcessing) {
              const processing_ = { ...processing }
              if (processing.isProcessing) { processing_.isProcessing = false }
              if (processing.isLoading) { processing_.isLoading = false }
              setProcessing(processing_);
          }
      }
      return this
  }

  return new (Processors as any)()
}
