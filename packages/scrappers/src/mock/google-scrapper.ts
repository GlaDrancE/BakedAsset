import { scrapGoogleBusiness } from "../google-scrapper/index.ts";

const mockScrapGoogleBusiness = async () => {
    const query = "https://www.google.com/maps/place/KATexperts+%7C+Best+CAT,+CLAT,+IPMAT,+CET+Coaching+in+Nagpur/@21.139144,78.9931882,13z/data=!4m9!1m2!2m1!1scoaching+classes+in+nagpur+for+11th+and+12th+!3m5!1s0x3bd4c1d97019e6e3:0x6a6248e272375aa9!8m2!3d21.139144!4d79.0632255!16s%2Fg%2F11mdf4cdsj?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D"
    const result = await scrapGoogleBusiness(query)

    console.log(result)
}

mockScrapGoogleBusiness().catch(err => console.error(err))