import { scrapGoogleBusiness } from "../google-scrapper/index.ts";

const mockScrapGoogleBusiness = async () => {
    const query = "Coaching classes in nagpur for 11th and 12th"
    const result = await scrapGoogleBusiness(query)

    console.log(result)
}

mockScrapGoogleBusiness().catch(err => console.error(err))