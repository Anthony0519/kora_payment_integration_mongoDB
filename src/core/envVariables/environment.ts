import dotenv from 'dotenv'
dotenv.config()

const variable = {
    PORT:parseInt(process.env.PORT as string),
    DBLink:process.env.DBLink as string,
    SECRETE:process.env.SECRETE_KEY as string,
    CLOUD_NAME: process.env.cloudName as string, 
    CLOUD_KEY: process.env.cloudKey as string, 
    CLOUD_SECRETE: process.env.cloudSecrete as string,
    API_KEY: process.env.KORAPAY_KEY as string
}

export default variable