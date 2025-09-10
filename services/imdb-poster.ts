import { parseHTML } from "linkedom"

async function getPoster(id: string) {
    const url = `https://imdb.com/title/${id}`
    const fch = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (React Native)"
        }
    })

    const text = await fch.text()
    const {document} = parseHTML(text)
    return document.querySelector('meta[property=og:image]')?.getAttribute("content")
}

async function getId(name: string) {
    const url = `https://www.imdb.com/find/?q=${name}`
    const fch = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (React Native)"
        }
    })
    const text = await fch.text()
    const {document} = parseHTML(text)
    const section = document.querySelectorAll("section")[3]
    const ul = section.querySelector("ul")
    const link = ul?.querySelector("a")?.getAttribute("href")
    return link?.split("?")[0].split("/")[2]
}

async function extractPoster(name: string) {
    const id = await getId(name)
    return await getPoster(id as string)
}

export { extractPoster }
