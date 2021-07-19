const debugMode = false

export const debugInfo = (caller?: string) => {
  return function (...messages: any) {
    if (debugMode) {
      if (caller) {
        console.log(`in ${caller}`, messages.join(" "))
      } else {
        console.log(messages.join(" "))
      }
    }
  }
}

export const debugObject = (caller?: string) => {
  return function (...messages: any) {
    if (debugMode) {
      console.log(`in ${caller}`, messages)
    }
  }
}

export const modules: any = {
  mode: debugMode,
  info: debugInfo,
  object: debugObject,
}

export const $debug = (function () { 
  const _modules: any = {}
  for (let module in modules) {
    if (typeof modules[module] === "function") {
      _modules[module] = modules[module]()
    } else {
      _modules[module] = modules[module]
    }
  }
  return _modules
}())

export default function Debug (caller: string): any {
  const _modules: any = {}
  for (let module in modules) {
    if (typeof modules[module] === "function") {
      _modules[module] = modules[module](caller)
    } else {
      _modules[module] = modules[module]
    }
  }

  return _modules
}
