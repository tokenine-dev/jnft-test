export const ip = "https://us-central1-tokenine-nft-khonkaen.cloudfunctions.net"

function response(json: any) {
      return json;
}

export const GET = (path: string) => {
      return fetch(ip + path, {
            method: "GET",
            // mode: 'no-cors'
      })
      .then(response => response.json())
      .then(response)
      .catch(e => console.error(e))
};

export const POST = async (path: string, formData: FormData) => {
      try {
            const response = await fetch(ip + path, {
                  method: "POST",
                  body: formData,
                  // mode: 'no-cors'
            })
            return response.json()
      } catch (error) {
            console.error(error)
            return error
      }
      // .then((res) => res.json())
      // .then(response)
      // .catch(e => e)
}

