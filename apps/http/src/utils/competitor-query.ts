export const createCompetitorQuery = (businessCategory: string, address: string) => {
    return businessCategory + "in" + address
}